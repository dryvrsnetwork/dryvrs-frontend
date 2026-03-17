'use client';
import { useState, useEffect } from 'react';
import { useWriteContract } from 'wagmi';
import { RIDE_ESCROW_ADDRESS, RIDE_ESCROW_ABI } from '../constants/contracts';

export default function GhostTelemetryHUD({ rideId, riderAddress }: { rideId: string | number, riderAddress: string }) {
  const [scanStatus, setScanStatus] = useState('INITIALIZING GHOST LINK');
  const [accelData, setAccelData] = useState({ x: '0.00', y: '0.00', z: '0.00' });
  const [wifiNodes, setWifiNodes] = useState(0);
  const [isSettling, setIsSettling] = useState(false);

  const { writeContractAsync } = useWriteContract();

  // Simulated Telemetry Sweeps (The visual representation of the Pothole Protocol)
  useEffect(() => {
    const sequence = async () => {
      setTimeout(() => setScanStatus('SWEEPING AMBIENT BSSID (Wi-Fi)'), 2000);
      setTimeout(() => setWifiNodes(Math.floor(Math.random() * 8) + 3), 3500);
      setTimeout(() => setScanStatus('SYNCING G-FORCE VECTORS'), 5000);
      setTimeout(() => setScanStatus('GHOST MODE ACTIVE: TELEMETRY LOCKED'), 7000);
    };
    sequence();

    // Simulating the live accelerometer data bouncing
    const interval = setInterval(() => {
      setAccelData({
        x: (Math.random() * 2 - 1).toFixed(2),
        y: (Math.random() * 2 - 1).toFixed(2),
        z: (Math.random() * 2 + 9.8).toFixed(2), // Gravity baseline
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleForceSettlement = async () => {
    setIsSettling(true);
    setScanStatus('UPLINKING TO ORACLE...');
    
    try {
      // 1. Fetch Zero-Knowledge Signature from Next.js Oracle
      const response = await fetch('/api/oracle/verify-ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: rideId,
          accelData: accelData,
          wifiNodes: wifiNodes
        })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Oracle failed to sign telemetry");

      setScanStatus('ORACLE SIGNATURE SECURED. MINTING...');

      // 2. Submit Payload to Base Sepolia Smart Contract
      await writeContractAsync({
        address: RIDE_ESCROW_ADDRESS as `0x${string}`,
        abi: RIDE_ESCROW_ABI,
        functionName: 'completeRideGhostMode',
        args: [
          BigInt(rideId),
          data.telemetryHash,
          data.oracleSignature
        ]
      });

      setScanStatus('SETTLEMENT COMPLETE. DGEN MINTED.');
      alert("Ghost Mode Settlement Successful! USDC and DGEN have been routed to your Vanguard Vault.");
      
    } catch (error) {
      console.error("Settlement Error:", error);
      setScanStatus('SETTLEMENT FAILED. RETRY.');
      alert("Failed to settle ride on-chain. Check the console for details.");
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="bg-black/80 border border-emerald-900 rounded-xl p-4 font-mono text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] mt-4">
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-emerald-900 pb-2 mb-3">
        <div className="text-emerald-500 font-bold tracking-widest text-xs flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          ZERO-KNOWLEDGE AUDIT
        </div>
        <div className="text-zinc-500 text-xs">ID: {rideId?.toString().slice(0, 8)}...</div>
      </div>

      {/* Dynamic Status Indicator */}
      <div className="text-center py-3 mb-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <div className={`text-xs font-bold ${scanStatus.includes('LOCKED') || scanStatus.includes('SECURED') || scanStatus.includes('COMPLETE') ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
          {scanStatus}
        </div>
      </div>

      {/* Live Sensor Data Feed */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <div className="text-zinc-500">PHYSICS (G-FORCE)</div>
          <div className="text-zinc-300">X: <span className="text-emerald-400">{accelData.x}</span></div>
          <div className="text-zinc-300">Y: <span className="text-emerald-400">{accelData.y}</span></div>
          <div className="text-zinc-300">Z: <span className="text-emerald-400">{accelData.z}</span></div>
        </div>
        <div className="space-y-1">
          <div className="text-zinc-500">ENVIRONMENT</div>
          <div className="text-zinc-300">AMBIENT NODES: <span className="text-emerald-400">{wifiNodes}</span></div>
          <div className="text-zinc-300 mt-2 text-[10px] break-all">
            RIDER SIG: <br/>
            <span className="text-zinc-600">{riderAddress || '0x...'}</span>
          </div>
        </div>
      </div>

      {/* Manual Override Execution */}
      <button 
        onClick={handleForceSettlement}
        disabled={isSettling}
        className="w-full mt-4 bg-emerald-900/30 hover:bg-emerald-800/50 disabled:opacity-50 border border-emerald-700 text-emerald-400 py-2 rounded transition-colors text-xs font-bold tracking-widest active:scale-95"
      >
        {isSettling ? 'EXECUTING SMART CONTRACT...' : 'FORCE SETTLEMENT HASH'}
      </button>
    </div>
  );
}