export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="max-w-md w-full space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Dryvrs
          </h1>
          <p className="text-zinc-400 text-lg font-medium">
            The decentralized mobility market.
          </p>
        </div>

        {/* The Action Terminal */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-8">
          <div className="space-y-2 text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Network Status: Live</p>
            <h2 className="text-2xl font-semibold">Enter the Market</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-white text-black text-lg font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors">
              Request a Ride
            </button>
            <button className="w-full bg-transparent border-2 border-zinc-800 text-white text-lg font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors">
              Enter Driver Portal
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}