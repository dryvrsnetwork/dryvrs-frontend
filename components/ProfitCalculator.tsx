'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function ProfitCalculator({ offerUsdc, distanceMiles = 5, driverWallet }) {
  const [stats, setStats] = useState<any>(null);
  const [gasPrice, setGasPrice] = useState(3.25); // Hardcoded MVP fuel price

  // Fetch the driver's specific vehicle from Supabase
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!driverWallet) return;
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('driver_wallet', driverWallet)
        .single();
      
      if (data) setStats(data);
    };
    fetchVehicle();
  }, [driverWallet]);

  if (!stats) return <div className="text-xs text-zinc-500 font-mono animate-pulse mt-2">LINKING TELEMETRY...</div>;

  // The SGN Pricing Logic
  const gross = offerUsdc * 0.90; // SGN takes 10%
  const fuelCost = (distanceMiles / stats.city_mpg) * gasPrice;
  const wearCost = distanceMiles * stats.wear_per_mile;
  const totalCost = fuelCost + wearCost;
  const netProfit = gross - totalCost;

  return (
    <div className="bg-black/60 border border-zinc-800 rounded-xl p-3 text-sm font-mono mt-3 shadow-inner">
      <div className="text-xs text-emerald-500 mb-2 border-b border-zinc-800 pb-1">
        TELEMETRY: {stats.year} {stats.make} {stats.model}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-zinc-400">
          <span>Gross (After 10% SGN Fee):</span>
          <span>${gross.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Overhead (Fuel + Wear):</span>
          <span className="text-red-400">-${totalCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-zinc-700">
          <span className="text-white">NET PROFIT:</span>
          <span className={netProfit > 0 ? "text-emerald-400" : "text-red-500"}>
            ${netProfit.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}