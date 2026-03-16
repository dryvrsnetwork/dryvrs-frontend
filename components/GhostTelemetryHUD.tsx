'use client';
import { useState, useEffect } from 'react';

export default function GhostTelemetryHUD({ rideId, riderAddress }: { rideId: string | number, riderAddress: string }) {
  const [scanStatus, setScanStatus] = useState('INITIALIZING GHOST LINK');
  const [accelData, setAccelData] = useState({ x: '0.00', y: '0.00', z: '0.00' });
  const [wifiNodes, setWifiNodes] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      setTimeout(() => setScanStatus('SWEEPING AMBIENT BSSID (Wi-Fi)'), 2000);
      setTimeout(() => setWifiNodes(Math.floor(Math.random() * 8) + 3), 3500);
      setTimeout(() => setScanStatus('SYNCING G-FORCE VECTORS'), 5000);
      setTimeout(() => setScanStatus('GHOST MODE ACTIVE: TELEMETRY LOCKED'), 7000);
    };
    sequence();

    const interval = setInterval(() => {
      setAccelData({
        x: (Math.random() * 2 - 1).toFixed(2),
        y: (Math.random() * 2 - 1).toFixed(2),
        z: (Math.random() * 2 + 9.8).toFixed(2),
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 border border-emerald-900 rounded-xl p-4 font-mono text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] mt-4">
      <div className="flex justify-between items-center border-b border-emerald-900 pb-2 mb-3">
        <div className="text-emerald-500 font-bold tracking-widest text-xs flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          ZERO-KNOWLEDGE AUDIT
        </div>
        <div className="text-zinc-500 text-xs">ID: {rideId?.toString().slice(0, 8)}...</div>
      </div>
      <div className="text-center py-3 mb-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <div className={`text-xs font-bold ${scanStatus.includes('LOCKED') ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
          {scanStatus}
        </div>
      </div>
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
    </div>
  );
}