'use client'
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="max-w-md w-full space-y-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Dryvrs
          </h1>
          <p className="text-zinc-400 text-lg font-medium">
            Select your portal.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <Link href="/rydr" className="block w-full text-center bg-white text-black text-xl font-bold py-5 rounded-xl hover:bg-zinc-200 transition-colors shadow-lg">
            I am a Rydr
          </Link>
          
          <Link href="/dryvr" className="block w-full text-center bg-transparent border-2 border-zinc-800 text-white text-xl font-bold py-5 rounded-xl hover:bg-zinc-800 transition-colors">
            Dryvr Portal
          </Link>
        </div>

      </div>
    </main>
  );
}