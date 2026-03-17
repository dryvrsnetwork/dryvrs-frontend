'use client'
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract, usePublicClient } from 'wagmi'
import { parseUnits } from 'viem';
import Link from 'next/link';
import { RIDE_ESCROW_ADDRESS, RIDE_ESCROW_ABI, MOCK_USDC_ADDRESS, MOCK_USDC_ABI } from '../../constants/contracts';
import dynamic from 'next/dynamic';
import { useBidding } from '../../hooks/useBidding';
import { getLiveRouteData } from '../../utils/routing'; 
import { supabase } from '../../utils/supabaseClient'; 

const RadarMap = dynamic(() => import('../../components/LiveMap'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center text-cyan-500 font-mono text-xl animate-pulse z-0">ESTABLISHING UPLINK...</div>
});

const getRideStateString = (stateCode: number | undefined) => {
  if (stateCode === 0) return "🟡 PENDING (Awaiting Dryvr)";
  if (stateCode === 1) return "🔵 ACCEPTED (In Transit)";
  if (stateCode === 2) return "⚠️ EJECT PROPOSED (Review Split)"; 
  if (stateCode === 3) return "🟢 COMPLETED (Paid Out)";
  if (stateCode === 4) return "🛑 DISPUTED (Frozen)";
  if (stateCode === 5) return "⚫ CANCELLED (Refunded)";
  return "⚫ UNKNOWN (Ready to Request)";
};

export default function RydrPortal() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContractAsync } = useWriteContract()
  
  const publicClient = usePublicClient()
  
  const [rideId, setRideId] = useState("0");
  const [origin, setOrigin] = useState("Milwaukee Public Market");
  const [destination, setDestination] = useState("Fiserv Forum");
  const [mounted, setMounted] = useState(false);
  
  const [routeData, setRouteData] = useState<any>(null);
  const [dynamicFare, setDynamicFare] = useState(15.00);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const safeRideId = rideId && !isNaN(Number(rideId)) ? BigInt(rideId) : BigInt(0);
  
  const { bids, acceptBid, cancelBid } = useBidding(rideId);

  useEffect(() => setMounted(true), []);

  const calculateRouteAndPrice = async () => {
    setIsCalculating(true);
    const data = await getLiveRouteData(origin, destination);
    if (data) {
      setRouteData(data);
      let calcPrice = 3 + (data.distanceMiles * 1.50);
      calcPrice = Math.max(5, Number(calcPrice.toFixed(2))); 
      setDynamicFare(calcPrice);
    } else {
      alert("Sat-Link Failed: Could not locate those addresses.");
    }
    setIsCalculating(false);
  };

  const { data: currentCounter } = useReadContract({
    address: RIDE_ESCROW_ADDRESS,
    abi: RIDE_ESCROW_ABI,
    functionName: 'nextRideId', 
    query: { refetchInterval: 2000 }
  });

  const { data: rideData, refetch, isLoading } = useReadContract({
    address: RIDE_ESCROW_ADDRESS,
    abi: RIDE_ESCROW_ABI,
    functionName: 'rides',
    args: [safeRideId], 
    query: { refetchInterval: 2000 }
  });

  const lockedAmount = rideData ? Number((rideData as any)[3]) : 0; 
  const rideState = lockedAmount > 0 ? Number((rideData as any)[6]) : undefined; 
  
  const currentDriver = rideData ? (rideData as any)[1] : undefined;
  const displayDriver = currentDriver && currentDriver !== "0x0000000000000000000000000000000000000000" 
    ? `${currentDriver.slice(0,6)}...${currentDriver.slice(-4)}` 
    : "Searching...";

  const FARE_AMOUNT = parseUnits(dynamicFare.toString(), 6);

  const handleApprove = async () => {
    try {
      await writeContractAsync({
        address: MOCK_USDC_ADDRESS,
        abi: MOCK_USDC_ABI,
        functionName: 'approve',
        args: [RIDE_ESCROW_ADDRESS, FARE_AMOUNT],
      });
      alert(`Approved ${dynamicFare} USDC for the Escrow Contract!`);
    } catch (error) { console.error("Failed to approve:", error); }
  };

  const handleRequestRide = async () => {
    try {
      const payloadHash = '0x0000000000000000000000000000000000000000000000000000000000000000'; 
      const expiry = Math.floor(Date.now() / 1000) + 600; 
      
      // 1. Ping the secure Vercel Oracle for the signature
      const response = await fetch('/api/oracle/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider: address,
          paymentToken: MOCK_USDC_ADDRESS,
          amount: FARE_AMOUNT.toString(),
          payloadHash: payloadHash,
          expiry: expiry
        })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Oracle failed to sign quote");

      // 2. Send the verified signature to the blockchain
      await writeContractAsync({
        address: RIDE_ESCROW_ADDRESS,
        abi: RIDE_ESCROW_ABI,
        functionName: 'requestRide',
        args: [MOCK_USDC_ADDRESS, FARE_AMOUNT, payloadHash, BigInt(expiry), data.signature],
      });

      const nextId = currentCounter ? Number(currentCounter) : 0; 
      
      const { error } = await supabase.from('active_rides').insert([{
        ride_id: nextId,
        rider_wallet: address,
        origin: origin,
        destination: destination,
        distance_miles: routeData.distanceMiles,
        initial_fare: Number(dynamicFare.toFixed(2)),
        status: 'PENDING'
      }]);

      if (error) console.error("Database sync error:", error.message, error.hint, error.details);
      
      alert(`Ride requested! Radar ping sent to all local Dryvrs.`);
      setRideId(nextId.toString()); 
      refetch();
    } catch (error) { 
      console.error("Failed to request:", error); 
      alert("Failed to request ride. Check console for details.");
    }
  };

  const handleCancelRide = async () => {
    try {
      await writeContractAsync({
        address: RIDE_ESCROW_ADDRESS,
        abi: RIDE_ESCROW_ABI,
        functionName: 'cancelRide',
        args: [safeRideId],
      });
      
      await supabase.from('active_rides').update({ status: 'CANCELLED' }).eq('ride_id', Number(safeRideId));
      
      refetch();
    } catch (error) { console.error("Failed to cancel:", error); }
  };

  if (!mounted) return <div className="flex w-screen h-screen items-center justify-center bg-zinc-950 text-cyan-400 font-mono animate-pulse">Initializing HUD...</div>;

  return (
    <main className="relative w-screen h-screen bg-zinc-950 text-white overflow-hidden">
      <RadarMap routeData={routeData} />

      <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-md">Rydr Terminal</h1>
          <p className="text-cyan-500/80 font-mono text-xs tracking-widest mt-1">UPLINK: ACTIVE</p>
        </div>
        <Link href="/" className="text-sm text-zinc-300 hover:text-white pointer-events-auto bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-800 transition-colors">← Back</Link>
      </div>

      <div className="absolute bottom-0 left-0 w-full md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-[28rem] z-10 p-4 pointer-events-none overflow-y-auto max-h-[90vh]">
        <div className="bg-black/70 backdrop-blur-xl border border-cyan-500/20 p-6 rounded-3xl space-y-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] pointer-events-auto">
          {isConnected ? (
            <div className="space-y-4 text-center">
              
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white tracking-wide">Monitor Ride ID</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setRideId((prev) => (Number(prev) + 1).toString());
                      setRouteData(null); 
                    }}
                    className="bg-cyan-900/50 hover:bg-cyan-800 border border-cyan-500/30 text-cyan-400 px-3 py-2 rounded-lg text-xs font-bold font-mono transition-colors active:scale-95"
                    title="Skip to next empty ride slot"
                  >
                    + NEW
                  </button>
                  <input 
                    type="number" 
                    value={rideId}
                    onChange={(e) => setRideId(e.target.value)}
                    className="bg-black/50 border border-cyan-500/30 text-cyan-400 px-3 py-2 rounded-lg w-20 text-center font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                    min="0"
                  />
                </div>
              </div>

              {(!rideState || rideState > 2) && (
                <div className="space-y-3 text-left bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/10">
                  <h3 className="text-cyan-400 font-mono text-xs tracking-widest mb-2 border-b border-cyan-500/20 pb-1">NAVIGATION MATRIX</h3>
                  
                  <div className="flex flex-col">
                    <label className="text-zinc-500 text-xs font-mono mb-1">ORIGIN</label>
                    <input 
                      type="text" 
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="e.g. 123 Main St, Milwaukee"
                      className="bg-black/50 border border-zinc-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-zinc-500 text-xs font-mono mb-1">DESTINATION</label>
                    <input 
                      type="text" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Mitchell Airport"
                      className="bg-black/50 border border-zinc-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <button 
                    onClick={calculateRouteAndPrice}
                    disabled={isCalculating || !origin || !destination}
                    className="w-full mt-2 bg-cyan-900/50 hover:bg-cyan-800 border border-cyan-500/50 text-cyan-100 font-mono text-xs py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isCalculating ? "CALCULATING SATELLITE DATA..." : "LOCK ROUTE & CALCULATE FARE"}
                  </button>
                  
                  {routeData && (
                    <div className="mt-3 flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-400">Est. Distance: <span className="text-white">{routeData.distanceMiles.toFixed(1)} mi</span></span>
                      <span className="text-zinc-400">Est. Time: <span className="text-white">{routeData.durationMinutes} min</span></span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-left space-y-1 text-sm font-mono bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/10">
                <p><span className="text-zinc-400">Status:</span> <span className="text-white">{isLoading ? "Scanning..." : getRideStateString(rideState)}</span></p>
                <p><span className="text-zinc-400">Dryvr:</span> <span className="text-white">{isLoading ? "Scanning..." : displayDriver}</span></p>
                <p><span className="text-zinc-400">Market Fare:</span> <span className="text-cyan-400 font-bold">{lockedAmount > 0 ? (lockedAmount / 10**6).toFixed(2) : dynamicFare.toFixed(2)} USDC</span></p>
              </div>

              {/* 🔧 INJECTION: Rider's Ghost Mode UI (BLE Handshake Status) */}
              {rideState === 1 && (
                <div className="bg-black/80 border border-cyan-900 rounded-xl p-4 font-mono text-sm shadow-[0_0_15px_rgba(6,182,212,0.15)] mt-4 animate-fade-in text-left">
                  <div className="flex justify-between items-center border-b border-cyan-900 pb-2 mb-3">
                    <div className="text-cyan-500 font-bold tracking-widest text-xs flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                      GHOST MODE ACTIVE
                    </div>
                    <div className="text-zinc-500 text-[10px]">BLE: BROADCASTING</div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Proximity Link:</span>
                      <span className="text-cyan-400">ESTABLISHED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Telemetry Sweep:</span>
                      <span className="text-cyan-400 animate-pulse">SYNCING BACKGROUND...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ZK-Routing:</span>
                      <span className="text-cyan-400">ENCRYPTED</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-cyan-900/50 text-[10px] text-zinc-500 text-center">
                    Ride will automatically settle upon exit (BLE Disconnect)
                  </div>
                </div>
              )}

              {rideState === 0 && bids.length > 0 && (
                <div className="mt-4 bg-zinc-900/80 border border-cyan-500/30 p-4 rounded-xl space-y-3">
                  <p className="text-xs text-cyan-400 font-mono tracking-widest border-b border-cyan-500/20 pb-2 text-left">INCOMING DRIVER OFFERS</p>
                  
                  {bids.map((bid) => (
                    <div key={bid.id} className="flex justify-between items-center bg-black/50 p-3 rounded-lg border border-cyan-500/10 transition-all hover:border-cyan-500/30">
                      <div className="text-left">
                        <p className="text-white font-bold">{bid.bid_amount} USDC</p>
                        <p className="text-[10px] text-zinc-500 font-mono">Dryvr: {bid.driver_wallet.slice(0,6)}...{bid.driver_wallet.slice(-4)}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => cancelBid(bid.id)}
                          className="bg-red-900/50 hover:bg-red-800 text-red-200 text-xs font-bold py-2 px-3 rounded transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={async () => {
                            try {
                              await acceptBid(bid.id);
                              await supabase.from('active_rides').update({ status: 'ACCEPTED' }).eq('ride_id', Number(safeRideId));
                              alert(`Offer accepted! The Dryvr is clear to accept the ride on-chain.`);
                              refetch(); 
                            } catch (error) {
                              console.error("Failed:", error);
                              alert("Transaction failed! Check console.");
                            }
                          }}
                          className="bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs font-bold py-2 px-3 rounded transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lockedAmount === 0 || rideState === undefined ? (
                <div className="flex gap-3 pt-2">
                  <button onClick={handleApprove} disabled={!routeData} className="flex-1 bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-30 text-white font-bold py-3 px-4 rounded-xl transition-all border border-zinc-700">
                    1. Approve
                  </button>
                  <button onClick={handleRequestRide} disabled={!routeData} className="flex-1 bg-cyan-600/80 hover:bg-cyan-500 disabled:opacity-30 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all border border-cyan-500/50">
                    2. Request
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  {rideState === 0 && (
                    <button onClick={handleCancelRide} className="flex-1 bg-red-900/80 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-xl transition-all border border-red-500/50">
                      Cancel Ping
                    </button>
                  )}
                </div>
              )}
              
            </div>
          ) : (
            <button 
              onClick={() => {
                const coinbaseConnector = connectors.find(
                  (c) => c.id.toLowerCase().includes('coinbase') || c.name.toLowerCase().includes('coinbase')
                );
                connect({ connector: coinbaseConnector || connectors[0] });
              }} 
              className="w-full bg-[#0052FF]/90 hover:bg-[#0052FF] text-white font-bold py-4 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,82,255,0.3)] transition-all"
            >
              Connect Coinbase Wallet
            </button>
          )}
        </div>
      </div>
    </main>
  );
}