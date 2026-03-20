'use client';
import { useState } from 'react';
import Image from 'next/image';
import DryvrsPlayer from '@/components/DryvrsPlayer';

// Campaign posters are strictly .png files
const campaignPosters = [
  { src: '/images/poster-01.png', alt: 'Campaign Poster 1' },
  { src: '/images/poster-02.png', alt: 'Campaign Poster 2' },
  { src: '/images/poster-03.png', alt: 'Campaign Poster 3' },
  { src: '/images/indiana-jones.png', alt: 'The Illusion of Access' }
];

export default function Home() {
  const [isGlitch, setIsGlitch] = useState(false);
  const [selectedPosterIndex, setSelectedPosterIndex] = useState(null); 

  // THE IGNITION SWITCH: Directly targets the audio DOM element
  const handleOverride = () => {
    setIsGlitch(true);
    const audioEl = document.getElementById('dryvrs-audio-core');
    if (audioEl) {
      audioEl.play().catch(err => console.error("Audio blocked:", err));
    }
  };

  return (
    <main className="min-h-screen bg-black text-zinc-300 font-mono relative pb-32 overflow-x-hidden">
      
      {/* 1. The Hero Section (The Gatekeeper) */}
      <section className="relative h-screen w-full flex items-center justify-center bg-black">
        {!isGlitch ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 z-10">
            <div className="absolute inset-0 z-0">
              <Image src="/images/indiana-jones.png" alt="The Bait" fill className="object-contain p-4 md:p-16 opacity-50" priority />
              <div className="absolute inset-0 bg-black/60" /> 
            </div>

            <div className="z-10 text-center space-y-12 flex flex-col items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] text-white uppercase drop-shadow-lg">The Illusion of Access</h1>
                <p className="mt-4 text-zinc-400 tracking-widest text-sm uppercase">Awaiting Protocol...</p>
              </div>
              
              <button onClick={handleOverride} className="px-8 py-4 bg-red-900/80 hover:bg-red-600 text-white font-bold tracking-widest uppercase border border-red-500/50 hover:border-red-400 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] cursor-pointer">
                Initiate System Override
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 animate-pulse transition-opacity duration-100">
            <Image src="/images/ledger-ram.jpeg" alt="The Switch" fill className="object-cover opacity-80 mix-blend-difference" priority />
            <div className="absolute inset-0 bg-red-900/20 mix-blend-color-burn" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center pb-20">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-red-600 uppercase drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">Dryvrs Network</h1>
              <h2 className="text-2xl md:text-4xl font-bold tracking-widest text-white mt-2 uppercase">System Override</h2>
            </div>
          </div>
        )}
      </section>

      {/* 2. The Manifesto Nodes (Updated to .png) */}
      <section className="max-w-6xl mx-auto px-6 py-32 space-y-40 relative z-10">
        
        <div className="flex flex-col md:flex-row items-center gap-12 border-l-2 border-zinc-800 pl-8 md:pl-12">
          <div className="w-full md:w-1/2 relative h-[500px] md:h-[700px]">
            <Image src="/images/node-01.png" alt="Manifesto Node 1" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700 border border-zinc-900" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-sm font-bold text-red-600 tracking-widest uppercase">Node 01</h3>
            <h2 className="text-3xl md:text-5xl font-bold uppercase text-white tracking-tight">The 30% Tax is Dead</h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">The legacy transit model relies on extraction. The rider pays a premium, the driver takes a fraction, and centralized servers absorb the spread. That ends now. The smart contract replaces the middleman, routing capital directly to the sovereign operator.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-12 border-r-2 border-zinc-800 pr-8 md:pr-12 text-right">
          <div className="w-full md:w-1/2 relative h-[500px] md:h-[700px]">
            <Image src="/images/node-02.png" alt="Manifesto Node 2" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700 border border-zinc-900" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-sm font-bold text-red-600 tracking-widest uppercase">Node 02</h3>
            <h2 className="text-3xl md:text-5xl font-bold uppercase text-white tracking-tight">Sovereign Infrastructure</h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">You are not an algorithmic employee responding to a surge map. You own the physical infrastructure—the vehicle. When you execute the physical transport, you capture 100% of the fare. Algorithms no longer dictate your value.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 border-l-2 border-zinc-800 pl-8 md:pl-12">
          <div className="w-full md:w-1/2 relative h-[500px] md:h-[700px]">
            <Image src="/images/node-03.png" alt="Manifesto Node 3" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700 border border-zinc-900" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-sm font-bold text-red-600 tracking-widest uppercase">Node 03</h3>
            <h2 className="text-3xl md:text-5xl font-bold uppercase text-white tracking-tight">The Decentralized Grid</h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">The ride-hailing grid is no longer a corporate monopoly; it is a public utility. Independent node operators validate the transactions, ensuring the network is permanently secured by the human beings who actually use it.</p>
          </div>
        </div>
      </section>

      {/* 3. The Campaign Bubble Array & Manifesto Link */}
      <section className="max-w-4xl mx-auto px-6 pb-20 pt-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-black/60 backdrop-blur-md border border-zinc-900 p-6 rounded-[2rem]">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xs text-zinc-500 tracking-widest uppercase">Intercepted Transmissions</h3>
            <div className="flex -space-x-4 hover:space-x-2 transition-all duration-300 ease-out group">
              {campaignPosters.map((poster, index) => (
                <button key={index} onClick={() => setSelectedPosterIndex(index)} className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-zinc-800 hover:border-red-500 transition-all duration-300 hover:scale-110 hover:z-30 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 cursor-pointer bg-black">
                  <Image src={poster.src} alt={poster.alt} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </button>
              ))}
            </div>
          </div>
          <a href="/manifesto.pdf" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm tracking-[0.2em] text-white border border-red-600 bg-red-900/40 px-6 py-4 hover:bg-red-600 transition-all uppercase rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] cursor-pointer">
            Read The Manifesto <span className="text-red-400">→</span>
          </a>
        </div>
      </section>

      {/* 4. Full-Screen Poster Viewer (Modal) */}
      {selectedPosterIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button onClick={() => setSelectedPosterIndex(null)} className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-red-500 text-4xl z-50 transition-colors">✕</button>
          <button onClick={() => setSelectedPosterIndex(prev => prev > 0 ? prev - 1 : campaignPosters.length - 1)} className="absolute left-2 md:left-10 text-zinc-500 hover:text-white text-6xl z-50 transition-colors pb-4">‹</button>
          <div className="relative w-full h-[85vh] max-w-4xl mx-12">
            <Image src={campaignPosters[selectedPosterIndex].src} alt={campaignPosters[selectedPosterIndex].alt} fill className="object-contain" />
          </div>
          <button onClick={() => setSelectedPosterIndex(prev => prev < campaignPosters.length - 1 ? prev + 1 : 0)} className="absolute right-2 md:right-10 text-zinc-500 hover:text-white text-6xl z-50 transition-colors pb-4">›</button>
        </div>
      )}

      {/* 5. The Pinned Audio Player */}
      <div className="fixed bottom-0 left-0 w-full z-50 border-t border-zinc-900 bg-black/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <DryvrsPlayer />
        </div>
      </div>

    </main>
  );
}