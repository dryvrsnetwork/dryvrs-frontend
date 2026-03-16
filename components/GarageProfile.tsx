'use client'
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '../utils/supabase';

export default function GarageProfile() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [vehicle, setVehicle] = useState({
    make: 'Volkswagen',
    model: 'Jetta TDI',
    year: 2001,
    city_mpg: 35,
    highway_mpg: 45,
    fuel_type: 'Diesel',
    wear_per_mile: 0.15
  });

  // 1. THE MEMORY BANK: Fetch existing profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!address) return;
      setFetching(true);
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('driver_wallet', address)
        .single();
      
      if (data) {
        setVehicle({
          make: data.make,
          model: data.model,
          year: data.year,
          city_mpg: data.city_mpg,
          highway_mpg: data.highway_mpg,
          fuel_type: data.fuel_type,
          wear_per_mile: data.wear_per_mile
        });
      }
      setFetching(false);
    };
    
    fetchProfile();
  }, [address]);

  // 2. THE UPLINK: Save changes to Supabase
  const saveProfile = async () => {
    if (!address) return;
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .upsert({ 
          driver_wallet: address,
          ...vehicle
        }, { onConflict: 'driver_wallet' });

      if (error) throw error;
      alert("Vehicle specs saved to SGN Telemetry!");
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="bg-black/70 backdrop-blur-xl border border-emerald-500/20 p-6 rounded-3xl space-y-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] mt-4">
      <h3 className="text-emerald-400 font-mono text-sm border-b border-zinc-800/50 pb-2">
        {fetching ? "SCANNING DATABANK..." : "VEHICLE TELEMETRY CALIBRATION"}
      </h3>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <label className="text-zinc-500 text-xs font-mono">MAKE</label>
          <input type="text" value={vehicle.make} onChange={e => setVehicle({...vehicle, make: e.target.value})} className="w-full bg-black/50 border border-zinc-800 text-white px-3 py-2 rounded-lg focus:border-emerald-400 focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-zinc-500 text-xs font-mono">MODEL</label>
          <input type="text" value={vehicle.model} onChange={e => setVehicle({...vehicle, model: e.target.value})} className="w-full bg-black/50 border border-zinc-800 text-white px-3 py-2 rounded-lg focus:border-emerald-400 focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-zinc-500 text-xs font-mono">YEAR</label>
          <input type="number" value={vehicle.year} onChange={e => setVehicle({...vehicle, year: Number(e.target.value)})} className="w-full bg-black/50 border border-zinc-800 text-white px-3 py-2 rounded-lg focus:border-emerald-400 focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-zinc-500 text-xs font-mono">FUEL TYPE</label>
          <select value={vehicle.fuel_type} onChange={e => setVehicle({...vehicle, fuel_type: e.target.value})} className="w-full bg-black/50 border border-zinc-800 text-white px-3 py-2 rounded-lg focus:border-emerald-400 focus:outline-none">
            <option value="Regular">Regular</option>
            <option value="Premium">Premium</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-zinc-500 text-xs font-mono">CITY MPG</label>
          <input type="number" value={vehicle.city_mpg} onChange={e => setVehicle({...vehicle, city_mpg: Number(e.target.value)})} className="w-full bg-black/50 border border-zinc-800 text-white px-3 py-2 rounded-lg focus:border-emerald-400 focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-zinc-500 text-xs font-mono">HWY MPG</label>
          <input type="number" value={vehicle.highway_mpg} onChange={e => setVehicle({...vehicle, highway_mpg: Number(e.target.value)})} className="w-full bg-black/50 border border-zinc-800 text-white px-3 py-2 rounded-lg focus:border-emerald-400 focus:outline-none" />
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-zinc-500 text-xs font-mono">WEAR/TEAR ($/MILE)</label>
          <input type="number" step="0.01" value={vehicle.wear_per_mile} onChange={e => setVehicle({...vehicle, wear_per_mile: Number(e.target.value)})} className="w-full bg-black/50 border border-zinc-800 text-white px-3 py-2 rounded-lg focus:border-emerald-400 focus:outline-none" />
        </div>
      </div>

      <button 
        onClick={saveProfile} 
        disabled={loading || fetching}
        className="w-full bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all border border-zinc-700 mt-2"
      >
        {loading ? "CALIBRATING..." : "SAVE TO DATABANK"}
      </button>
    </div>
  );
}