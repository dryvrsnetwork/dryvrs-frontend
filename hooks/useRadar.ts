import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export const useRadar = () => {
  const [activeRides, setActiveRides] = useState<any[]>([]);

  useEffect(() => {
    const fetchRides = async () => {
      const { data, error } = await supabase
        .from('active_rides')
        .select('*')
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });
        
      if (error) console.error("Radar Error:", error);
      else if (data) setActiveRides(data);
    };

    fetchRides();

    // 📡 Live Antenna: Listen for new riders pinging the network
    const subscription = supabase
      .channel('public:active_rides')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'active_rides' }, () => {
        fetchRides();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { activeRides };
};