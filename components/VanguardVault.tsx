'use client';
import { useAccount, useReadContract } from 'wagmi';
import { MOCK_USDC_ADDRESS, DGEN_ADDRESS } from '../constants/contracts';

// Minimal ABI just to read token balances
const ERC20_BALANCE_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export default function VanguardVault() {
  const { address } = useAccount();

  // Poll the blockchain for the Driver's liquid USDC
  const { data: usdcBalance } = useReadContract({
    address: MOCK_USDC_ADDRESS as `0x${string}`,
    abi: ERC20_BALANCE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { refetchInterval: 3000 }
  });

  // Poll the blockchain for the Driver's Proof-of-Labor $DGEN
  const { data: dgenBalance } = useReadContract({
    address: DGEN_ADDRESS as `0x${string}`,
    abi: ERC20_BALANCE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { refetchInterval: 3000 }
  });

  // USDC has 6 decimals, DGEN has 18 decimals
  const formattedUSDC = usdcBalance !== undefined ? (Number(usdcBalance) / 10**6).toFixed(2) : "0.00";
  const formattedDGEN = dgenBalance !== undefined ? (Number(dgenBalance) / 10**18).toFixed(2) : "0.00";

  return (
    <div className="bg-black/80 border border-emerald-900 rounded-xl p-4 font-mono shadow-[0_0_15px_rgba(16,185,129,0.15)] mt-4 mb-4">
      <h3 className="text-emerald-500 font-bold tracking-widest text-xs border-b border-emerald-900 pb-2 mb-3">VANGUARD VAULT</h3>
      <div className="grid grid-cols-2 gap-4 text-left">
        <div>
          <div className="text-zinc-500 text-[10px] tracking-widest">LIQUID CAPITAL</div>
          <div className="text-emerald-400 font-bold text-lg">{formattedUSDC} <span className="text-xs text-zinc-400">USDC</span></div>
        </div>
        <div>
          <div className="text-zinc-500 text-[10px] tracking-widest">SWEAT EQUITY</div>
          <div className="text-emerald-400 font-bold text-lg">{formattedDGEN} <span className="text-xs text-zinc-400">$DGEN</span></div>
        </div>
      </div>
    </div>
  );
}