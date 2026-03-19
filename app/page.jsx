'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import DryvrsPlayer from '@/components/DryvrsPlayer';

export default function Home() {
  const [isGlitch, setIsGlitch] = useState(false);

  // The 8-Second Bait & Switch Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGlitch(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-zinc-300 font-mono relative pb-32">
      
      {/* 1. The Hero Section (Bait & Switch) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {!isGlitch ? (
          <div className="absolute inset-0 transition-opacity duration-300">
            <Image 
              src="/images/indiana-jones.png" 
              alt="The Bait" 
              fill 
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
              <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] text-white uppercase">
                The Illusion of Access
              </h1>
              <p className="mt-4 text-zinc-400 tracking-widest text-sm uppercase">Loading Protocol...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 animate-pulse transition-opacity duration-100">
            <Image 
              src="/images/ledger-ram.jpeg" 
              alt="The Switch" 
              fill 
              className="object-cover opacity-80 mix-blend-difference"
              priority
            />
            {/* Hard Glitch Overlay */}
            <div className="absolute inset-0 bg-red-900/20 mix-blend-color-burn" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-red-600 uppercase drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">
                Dryvrs Network
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold tracking-widest text-white mt-2 uppercase">
                System Override
              </h2>
            </div>
          </div>
        )}
      </section>

      {/* 2. The Manifesto Nodes (Vertical Scroll) */}
      <section className="max-w-6xl mx-auto px-6 py-32 space-y-40 relative z-10">
        
        {/* Node 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12 border-l-2 border-zinc-800 pl-8 md:pl-12">
          <div className="w-full md:w-1/2 relative h-[500px] md:h-[700px]">
            <Image 
              src="/images/node-01.png" 
              alt="Manifesto Node 1" 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 border border-zinc-900" 
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-sm font-bold text-red-600 tracking-widest uppercase">Node 01</h3>
            <h2 className="text-3xl md:text-5xl font-bold uppercase text-white tracking-tight">The 30% Tax is Dead</h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              The legacy transit model relies on extraction. The rider pays a premium, the driver takes a fraction, and centralized servers absorb the spread. That ends now. The smart contract replaces the middleman, routing capital directly to the sovereign operator.
            </p>
          </div>
        </div>

        {/* Node 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 border-r-2 border-zinc-800 pr-8 md:pr-12 text-right">
          <div className="w-full md:w-1/2 relative h-[500px] md:h-[700px]">
            <Image 
              src="/images/node-02.png" 
              alt="Manifesto Node 2" 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 border border-zinc-900" 
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-sm font-bold text-red-600 tracking-widest uppercase">Node 02</h3>
            <h2 className="text-3xl md:text-5xl font-bold uppercase text-white tracking-tight">Sovereign Infrastructure</h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              You are not an algorithmic employee responding to a surge map. You own the physical infrastructure—the vehicle. When you execute the physical transport, you capture 100% of the fare. Algorithms no longer dictate your value.
            </p>
          </div>
        </div>

        {/* Node 3 */}
        <div className="flex flex-col md:flex-row items-center gap-12 border-l-2 border-zinc-800 pl-8 md:pl-12">
          <div className="w-full md:w-1/2 relative h-[500px] md:h-[700px]">
            <Image 
              src="/images/node-03.png" 
              alt="Manifesto Node 3" 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 border border-zinc-900" 
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-sm font-bold text-red-600 tracking-widest uppercase">Node 03</h3>
            <h2 className="text-3xl md:text-5xl font-bold uppercase text-white tracking-tight">The Decentralized Grid</h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              The ride-hailing grid is no longer a corporate monopoly; it is a public utility. Independent node operators validate the transactions, ensuring the network is permanently secured by the human beings who actually use it.
            </p>
          </div>
        </div>

      </section>

      {/* 3. The Pinned Audio Player */}
      <div className="fixed bottom-0 left-0 w-full z-50 border-t border-zinc-900 bg-black/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <DryvrsPlayer />
        </div>
      </div>

    </main>
  );
}