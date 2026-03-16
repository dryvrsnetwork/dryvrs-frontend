export default function RadarMap() {
  return (
    <div className="relative w-full h-56 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center shadow-inner">
      {/* Background GPS Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      {/* Radar Distance Rings */}
      <div className="absolute w-24 h-24 rounded-full border border-emerald-500/10"></div>
      <div className="absolute w-40 h-40 rounded-full border border-emerald-500/20"></div>
      <div className="absolute w-56 h-56 rounded-full border border-emerald-500/10"></div>

      {/* The Sweeping Radar Arm */}
      <div className="absolute w-full h-full animate-[spin_4s_linear_infinite]">
        <div className="w-1/2 h-1/2 border-r-2 border-emerald-400 bg-gradient-to-tr from-transparent via-emerald-500/10 to-emerald-400/30 origin-bottom-right"></div>
      </div>

      {/* Center Dot (Your Location) */}
      <div className="absolute w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)]"></div>

      {/* Mock GPS Target Blip (The Ride) */}
      <div className="absolute top-[30%] left-[65%]">
        <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping absolute"></div>
        <div className="w-2.5 h-2.5 bg-white rounded-full relative shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        <span className="absolute top-3 -left-4 text-[10px] text-white font-mono bg-black/60 px-1 rounded">RIDE_01</span>
      </div>

      {/* GPS Telemetry Overlay */}
      <div className="absolute top-2 left-2 flex flex-col">
        <span className="text-[10px] text-emerald-500 font-mono tracking-widest">SAT_LINK: ACTIVE</span>
        <span className="text-[10px] text-emerald-500/60 font-mono">LAT: 43.0389 N // LNG: 87.9065 W</span>
      </div>
    </div>
  );
}