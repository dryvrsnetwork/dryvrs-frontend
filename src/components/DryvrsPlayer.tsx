'use client';
import { useState, useRef, useEffect } from 'react';

// The Playlist Array
const playlist = [
  { id: 1, title: 'Badger State Run', src: '/audio/10-the-badger-state-run.mp3' }, 
  { id: 2, title: 'The Road Belongs', src: '/audio/1-the-road-belongs.mp3' },
  { id: 3, title: 'System Override', src: '/audio/2-system-override.mp3' },
  { id: 4, title: 'The Tax is Dead', src: '/audio/3-the-tax-is-dead.mp3' },
  { id: 5, title: 'Sovereign Infrastructure', src: '/audio/4-sovereign-infrastructure.mp3' },
  { id: 6, title: 'The Decentralized Grid', src: '/audio/5-the-decentralized-grid.mp3' },
  { id: 7, title: 'The Ledger Ram', src: '/audio/6-the-ledger-ram.mp3' },
  { id: 8, title: 'Indiana Jones Trap', src: '/audio/7-indiana-jones-trap.mp3' },
  { id: 9, title: 'System Reboot', src: '/audio/8-system-reboot.mp3' }
];

export default function DryvrsPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setTimeout(() => {
      if (audioRef.current) audioRef.current.play();
    }, 50);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setTimeout(() => {
      if (audioRef.current) audioRef.current.play();
    }, 50);
  };

  return (
    <div className="flex items-center justify-between py-4 text-zinc-300 font-mono">
      
      {/* THIS IS THE HARDWIRED ID THE HOMEPAGE IS LOOKING FOR */}
      <audio 
        id="dryvrs-audio-core"
        ref={audioRef} 
        src={playlist[currentTrack].src} 
        onEnded={nextTrack}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex flex-col w-1/3">
        <span className="text-xs tracking-widest text-red-600 uppercase">Testnet Radio</span>
        <span className="text-sm font-bold text-white truncate">
          {playlist[currentTrack].title}
        </span>
      </div>

      <div className="flex items-center space-x-6">
        <button onClick={prevTrack} className="hover:text-red-500 transition-colors duration-200">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>
        
        <button onClick={togglePlay} className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-700 hover:border-red-600 hover:text-red-500 transition-all duration-200">
          {isPlaying ? (
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
             <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <button onClick={nextTrack} className="hover:text-red-500 transition-colors duration-200">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>

      <div className="w-1/3 flex justify-end items-center space-x-2">
        <span className="relative flex h-3 w-3">
          <span className={`absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 ${isPlaying ? 'animate-ping' : 'hidden'}`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-red-600' : 'bg-zinc-600'}`}></span>
        </span>
        <span className="text-xs text-zinc-500 tracking-widest uppercase">Node Active</span>
      </div>

    </div>
  );
}