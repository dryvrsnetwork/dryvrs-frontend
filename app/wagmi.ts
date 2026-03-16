import { http, createConfig } from 'wagmi'
import { baseSepolia, base, foundry } from 'wagmi/chains' // 🔧 NEW: Added foundry (Anvil)
import { coinbaseWallet, injected } from 'wagmi/connectors'

export const config = createConfig({
  // 🔧 NEW: Put foundry first so Wagmi defaults to your local Anvil node
  chains: [foundry, baseSepolia, base], 
  connectors: [
    coinbaseWallet({ 
      appName: 'Dryvrs',
      // 🔧 CHANGED: Removed 'smartWalletOnly' so it can connect to local Anvil
      // (We will turn smartWalletOnly back on when we deploy to live Base Sepolia)
      preference: 'all', 
    }),
    injected(),
  ],
  transports: {
    [foundry.id]: http(), // 🔧 NEW: Tell Wagmi how to talk to local Anvil
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})