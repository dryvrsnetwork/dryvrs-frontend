'use client';

import React, { useState, useRef, useEffect } from 'react';

// The Official 10-Track Testnet Playlist
const tracks = [
  { id: 1, title: "The Ledger (The Foundation)", file: "/audio/01-the-ledger.mp3" },
  { id: 2, title: "Ghost Mode (The Midnight Haul)", file: "/audio/02-ghost-mode.mp3" },
  { id: 3, title: "The Vault (The Rider's Handshake)", file: "/audio/03-the-vault.mp3" },
  { id: 4, title: "Idle State (The Iron in the Garage)", file: "/audio/04-idle-state.mp3" },
  { id: 5, title: "The Bloodline (A Beggar's Wage)", file: "/audio/05-the-bloodline.mp3" },
  { id: 6, title: "Genesis Block (The Open Road)", file: "/audio/06-genesis-block.mp3" },
  { id: 7, title: "The Sovereign Union (Side by Side)", file: "/audio/07-sovereign-union.mp3" },
  { id: 8, title: "Honest Paper (The Local Dollar)", file: "/audio/08-honest-paper.mp3" },
  { id: 9, title: "Queen of the Night Shift", file: "/audio/09-queen-of-the-night.mp3" },
  { id: 10, title: "The Badger State Run", file: "/audio/The Badger State Run (Remastered).mp3" },
];

export default function DryvrsPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked until user interaction", e));
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
  };

  return (
    <div className="w-full bg-zinc-950 border-t border-zinc-800 p-4 shadow-2xl font-mono text-zinc-300 flex flex-col md:flex-row items-center justify-between z-50">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={tracks[currentTrack].file} 
        onEnded={nextTrack} 
      />

      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-1/3">
        <div className="animate-pulse bg-red-600 h-2 w-2 rounded-full"></div>
        <div>
          <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Live Testnet Radio</p>
          <h3 className="text-sm font-bold text-zinc-100 truncate w-48 md:w-full">
            {tracks[currentTrack].title}
          </h3>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 w-full md:w-1/3">
        <button onClick={prevTrack} className="p-2 hover:text-white transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>

        <button 
          onClick={togglePlay} 
          className="w-12 h-12 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors border border-zinc-600"
        >
          {isPlaying ? (
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <button onClick={nextTrack} className="p-2 hover:text-white transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>

      {/* Footer Text */}
      <div className="hidden md:block w-1/3 text-right">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Dryvrs FM • Track {tracks[currentTrack].id} / 10</p>
      </div>

    </div>
  );
}