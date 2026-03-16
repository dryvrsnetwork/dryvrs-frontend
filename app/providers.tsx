// app/providers.tsx
'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { foundry } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { ReactNode, useState } from 'react';

const wagmiConfig = createConfig({
  chains: [foundry],
  connectors: [
    coinbaseWallet({
      appName: 'Dryvrs Network',
      preference: 'smartWalletOnly', // The invisible Web3 magic
    }),
  ],
  transports: {
    [foundry.id]: http('http://localhost:8545'),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={foundry}>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}