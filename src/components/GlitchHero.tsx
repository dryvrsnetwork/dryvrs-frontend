'use client';

import React, { useState, useRef } from 'react';

export default function GlitchHero() {
  // Phases: 'idle' (waiting for click), 'wholesome' (acoustic), 'glitching', 'outlaw' (industrial)
  const [phase, setPhase] = useState('idle');
  const wholesomeAudioRef = useRef<HTMLAudioElement>(null);
  const outlawAudioRef = useRef<HTMLAudioElement>(null);

  const startSequence = () => {
    setPhase('wholesome');
    if (wholesomeAudioRef.current) {
      wholesomeAudioRef.current.play().catch(e => console.log(e));
    }

    // Trigger glitch after 8 seconds
    setTimeout(() => {
      setPhase('glitching');
      if (wholesomeAudioRef.current) {
        wholesomeAudioRef.current.pause();
      }

      // Heavy glitch lasts for half a second, then drop the ledger
      setTimeout(() => {
        setPhase('outlaw');
        if (outlawAudioRef.current) {
          outlawAudioRef.current.play().catch(e => console.log(e));
        }
      }, 500);

    }, 8000);
  };

  return (
    <div 
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black cursor-pointer" 
      onClick={phase === 'idle' ? startSequence : undefined}
    >
      {/* Hidden Audio Elements */}
      <audio ref={wholesomeAudioRef} src="/audio/The Badger State Run (Remastered).mp3" />
      <audio ref={outlawAudioRef} src="/audio/01-the-ledger.mp3" />

      {/* Idle Phase Overlay (Forces user interaction to allow audio playback) */}
      {phase === 'idle' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-zinc-100 text-black px-8 py-4 font-bold uppercase tracking-widest animate-pulse border-2 border-zinc-500 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Tap to Start the Run
          </div>
        </div>
      )}

      {/* The Visuals */}
      <div className={`absolute inset-0 transition-all duration-75 ${phase === 'glitching' ? 'invert sepia saturate-200 hue-rotate-180 scale-110 blur-[2px]' : ''}`}>
        
        {(phase === 'idle' || phase === 'wholesome' || phase === 'glitching') && (
          <img
            src="/images/campaign-poster.png"
            alt="Campaign Poster"
            className="w-full h-full object-cover object-center"
          />
        )}

        {phase === 'outlaw' && (
          <img
            src="/images/album-art.jpeg"
            alt="Album Art"
            className="w-full h-full object-cover object-center scale-105"
          />
        )}
      </div>

      {/* The Outlaw Text Overlay */}
      {phase === 'outlaw' && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-8 text-center z-10">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
              The state does not grant your rights.
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-red-500 uppercase tracking-widest">
              We just codified them.
            </h2>
         </div>
      )}
    </div>
  );
}