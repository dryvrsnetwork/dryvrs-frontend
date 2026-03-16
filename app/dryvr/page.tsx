'use client'
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract } from 'wagmi'
import Link from 'next/link';
import { RIDE_ESCROW_ADDRESS, RIDE_ESCROW_ABI } from '../../constants/contracts';
import dynamic from 'next/dynamic';
import { useBidding } from '../../hooks/useBidding';
import { useRadar } from '../../hooks/useRadar'; 
import { getLiveRouteData } from '../../utils/routing'; 
import { supabase } from '../../utils/supabaseClient'; // 🔧 Added for direct DB writes

const RadarMap = dynamic(() => import('../../components/LiveMap'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center text-emerald-500 font-mono text-xl animate-pulse z-0">CALIBRATING RADAR...</div>
});

const getRideStateString = (stateCode: number | undefined) => {
  if (stateCode === 0) return "🟡 PENDING (Haggling Open)";
  if (stateCode === 1) return "🔵 ACCEPTED (In Transit)";
  if (stateCode === 2) return "⚠️ EJECT PROPOSED (Review Split)"; 
  if (stateCode === 3) return "🟢 COMPLETED (Paid Out)";
  if (stateCode === 4) return "🛑 DISPUTED (Frozen)";
  if (stateCode === 5) return "⚫ CANCELLED (Refunded)";
  return "⚫ UNKNOWN (Ride does not exist)";
};

export default function DryvrPortal() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { writeContractAsync } = useWriteContract()
  
  const [rideId, setRideId] = useState(""); 
  const [mounted, setMounted] = useState(false);
  const [counterOffer, setCounterOffer] = useState("");
  
  const [routeData, setRouteData] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const safeRideId = rideId && !isNaN(Number(rideId)) ? BigInt(rideId) : BigInt(0);

  const { bids, cancelBid } = useBidding(rideId); // 🔧 FIX 2: Removed broken submitBid import
  const { activeRides } = useRadar(); 

  useEffect(() => setMounted(true), []);

  const { data: rideData, refetch, isLoading } = useReadContract({
    address: RIDE_ESCROW_ADDRESS,
    abi: RIDE_ESCROW_ABI,
    functionName: 'rides',
    args: [safeRideId], 
    query: { refetchInterval: 2000 }
  });

  const lockedAmount = rideData ? Number((rideData as any)[3]) : 0; 
  const rideState = lockedAmount > 0 ? Number((rideData as any)[6]) : undefined; 

  // 🔧 FIX 1: Pull addresses safely from the Supabase Radar, NOT the blockchain
  const targetedRide = activeRides.find(r => r.ride_id.toString() === rideId);
  const origin = targetedRide ? targetedRide.origin : "";
  const destination = targetedRide ? targetedRide.destination : "";

  // 🔧 FIX 2: Define the missing bid submission logic right here
  const submitDriverBid = async (targetRideId: string, bidAmount: number) => {
    const { error } = await supabase.from('bids').insert([{
      ride_id: Number(targetRideId),
      driver_wallet: address,
      bid_amount: bidAmount
    }]);
    if (error) throw error;
  };

  useEffect(() => {
    const fetchTelemetry = async () => {
      if (origin && destination && origin !== "" && destination !== "") {
        setIsCalculating(true);
        const data = await getLiveRouteData(origin, destination);
        if (data) {
          setRouteData(data);
        }
        setIsCalculating(false); 
      } else {
        setRouteData(null); 
      }
    };
    fetchTelemetry();
  }, [origin, destination]);

  const handleAcceptRide = async () => {
    try {
      await writeContractAsync({
        address: RIDE_ESCROW_ADDRESS,
        abi: RIDE_ESCROW_ABI,
        functionName: 'acceptRide',
        args: [safeRideId],
      });
      alert(`Contract locked! You are now the official Dryvr for Ride #${rideId}.`);
      refetch();
    } catch (error) { console.error("Failed to accept:", error); }
  };

  const handleBidSubmit = async () => {
    const numOffer = Number(Number(counterOffer).toFixed(2));
    if (numOffer <= 0 || isNaN(numOffer)) {
      alert("Invalid transmission. Offer must be greater than zero.");
      return;
    }
    
    try {
      await submitDriverBid(rideId, numOffer); 
      alert(`Transmission successful! Bid of ${numOffer.toFixed(2)} USDC sent to rider.`);
      setCounterOffer(""); 
    } catch (error) {
      console.error(error);
      alert("Radar interference. Failed to send bid.");
    }
  };

  if (!mounted) return <div className="flex w-screen h-screen items-center justify-center bg-zinc-950 text-emerald-400 font-mono animate-pulse">Initializing HUD...</div>;

  return (
    <main className="relative w-screen h-screen bg-zinc-950 text-white overflow-hidden">
      
      <RadarMap routeData={routeData} />

      <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-md">Dryvr HUD</h1>
          <p className="text-emerald-500/80 font-mono text-xs tracking-widest mt-1">RADAR: SWEEPING</p>
        </div>
        <Link href="/" className="text-sm text-zinc-300 hover:text-white pointer-events-auto bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-800 transition-colors">← Back</Link>
      </div>

      <div className="absolute bottom-0 left-0 w-full md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-[28rem] z-10 p-4 pointer-events-none overflow-y-auto max-h-[90vh]">
        <div className="bg-black/70 backdrop-blur-xl border border-emerald-500/20 p-6 rounded-3xl space-y-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] pointer-events-auto">
          {isConnected ? (
            <div className="space-y-4 text-center">
              <p className="text-emerald-400 font-mono text-sm border-b border-zinc-800/50 pb-3">Operator: {address?.slice(0,6)}...{address?.slice(-4)}</p>
              
              {!rideId && (
                <div className="text-left space-y-2">
                  <h4 className="text-xs text-emerald-500 tracking-widest border-b border-emerald-500/20 pb-1 mb-2">OPEN MARKET RADAR</h4>
                  {activeRides.length === 0 ? (
                    <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/10 text-center font-mono text-xs text-emerald-500/70 animate-pulse">
                      NO ACTIVE SIGNALS...
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {activeRides.map((ride) => (
                        <button 
                          key={ride.ride_id}
                          onClick={() => setRideId(ride.ride_id.toString())}
                          className="w-full flex justify-between items-center bg-black/50 p-3 rounded-lg border border-emerald-500/30 hover:bg-emerald-900/30 hover:border-emerald-400 transition-all text-left"
                        >
                          <div>
                            <p className="text-white text-sm font-bold truncate max-w-[160px]">{ride.destination}</p>
                            <p className="text-zinc-500 text-[10px] font-mono">Payload pending</p>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 font-bold">{ride.initial_fare} USDC</p>
                            <p className="text-emerald-600 text-[10px] font-mono">Ride #{ride.ride_id}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <h3 className="text-sm font-bold text-zinc-400 tracking-wide">Target Override</h3>
                <div className="flex gap-2">
                   {rideId && (
                     <button 
                       onClick={() => setRideId("")}
                       className="bg-zinc-800 text-zinc-400 px-3 py-2 rounded-lg text-xs font-mono hover:bg-zinc-700 transition-colors"
                     >
                       Clear Target
                     </button>
                   )}
                  <input 
                    type="number" 
                    value={rideId}
                    onChange={(e) => setRideId(e.target.value)}
                    placeholder="ID"
                    className="bg-black/50 border border-emerald-500/30 text-emerald-400 px-3 py-2 rounded-lg w-20 text-center font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                    min="1"
                  />
                </div>
              </div>

              {rideId && origin && destination && (
                <div className="text-left space-y-2 text-sm font-mono bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/10 animate-fade-in">
                  <h4 className="text-xs text-emerald-500 tracking-widest border-b border-emerald-500/20 pb-1 mb-2">INTERCEPTED ROUTE #{rideId}</h4>
                  <p className="truncate"><span className="text-zinc-500">FROM:</span> <span className="text-white">{origin}</span></p>
                  <p className="truncate"><span className="text-zinc-500">TO:</span> <span className="text-white">{destination}</span></p>
                  
                  {routeData && (
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-emerald-500/10">
                      <span className="text-emerald-400 font-bold">{routeData.distanceMiles.toFixed(1)} miles</span>
                      <span className="text-emerald-400">{routeData.durationMinutes} min est.</span>
                    </div>
                  )}
                </div>
              )}

              {rideId && (
                <div className="text-left space-y-1 text-sm font-mono bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/10">
                  <p><span className="text-zinc-400">Status:</span> <span className="text-white">{isLoading ? "Scanning..." : getRideStateString(rideState)}</span></p>
                  <p><span className="text-zinc-400">Rydr Vault:</span> <span className="text-emerald-400 font-bold">{(lockedAmount / 10**6).toFixed(2)} USDC</span></p>
                </div>
              )}

              {rideId && rideState === 0 && (
                <div className="bg-zinc-900/80 border border-emerald-500/30 p-4 rounded-xl space-y-3 mt-4 mb-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-xs font-mono">COUNTER-OFFER</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input 
                      type="number" 
                      value={counterOffer}
                      onChange={(e) => setCounterOffer(e.target.value)}
                      placeholder="Enter amount..."
                      className="bg-black border border-zinc-700 text-emerald-400 px-3 py-2 rounded-lg w-full text-center font-mono focus:border-emerald-400 focus:outline-none"
                    />
                    <button 
                      onClick={handleBidSubmit}
                      disabled={!counterOffer}
                      className="w-full sm:w-auto bg-emerald-600/80 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors whitespace-nowrap active:scale-95"
                    >
                      Send Bid
                    </button>
                  </div>

                  {bids.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/20">
                      <p className="text-[10px] text-emerald-500 font-mono mb-2 tracking-widest">ACTIVE TRANSMISSIONS:</p>
                      {bids.map((bid) => (
                        <div key={bid.id} className="flex justify-between items-center text-xs font-mono bg-black/40 p-2 rounded border border-emerald-500/10 mb-1">
                          <span className="text-zinc-400">You offered: <span className="text-emerald-400 font-bold">{bid.bid_amount} USDC</span></span>
                          
                          <button 
                            onClick={() => cancelBid(bid.id)}
                            className="text-red-500 hover:text-red-400 text-[10px] px-2 py-1 bg-red-950/30 rounded border border-red-900/50 transition-colors"
                          >
                            CANCEL
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {rideId && lockedAmount > 0 && (
                <div className="flex gap-3 pt-2">
                  {rideState === 0 && (
                    <button onClick={handleAcceptRide} className="flex-1 bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all border border-emerald-500/50">
                      Lock In Contract
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