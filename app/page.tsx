'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Home() {
  // These are the Wagmi hooks that talk to the blockchain
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // A quick helper to make the wallet address look pretty (e.g., 0x123...ABCD)
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

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
            
            {/* Dynamically change title based on connection status */}
            <h2 className="text-2xl font-semibold">
              {isConnected ? 'Wallet Connected' : 'Enter the Market'}
            </h2>
            
            {/* Show the wallet address if connected */}
            {isConnected && address && (
              <p className="text-emerald-400 font-mono text-sm">{truncateAddress(address)}</p>
            )}
          </div>

          <div className="space-y-4">
            {/* If connected, show the actual app actions. If not, show the connect buttons. */}
            {isConnected ? (
              <>
                <button className="w-full bg-blue-500 text-white text-lg font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg">
                  Post Ride Contract
                </button>
                <button 
                  onClick={() => disconnect()}
                  className="w-full bg-transparent border border-zinc-800 text-zinc-400 text-sm font-bold py-3 rounded-xl hover:text-white transition-colors"
                >
                  Disconnect Wallet
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => connect({ connector: connectors[0] })}
                  className="w-full bg-white text-black text-lg font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Connect to Request Ride
                </button>
                <button className="w-full bg-transparent border-2 border-zinc-800 text-white text-lg font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors">
                  Enter Driver Portal
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}