import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export const useBidding = (rideId: string) => {
    const [bids, setBids] = useState<any[]>([]);

    useEffect(() => {
        const fetchBids = async () => {
            // 🛑 Prevent it from crashing if the ID isn't ready yet
            if (!rideId || rideId === "0") return; 

            const { data, error } = await supabase
                .from('bids')
                .select('*')
                .eq('ride_id', rideId);

            if (error) {
                // 🚨 This forces JavaScript to print the ACTUAL English error sentence
                console.error("Radar Error:", error.message, error.hint);
            } else if (data) {
                setBids(data);
            }
        };

        fetchBids();

        // 📡 Real-time listener: Watch for drivers making offers
        const subscription = supabase
            .channel(`bids_listener_${rideId}`)
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'bids', 
                filter: `ride_id=eq.${rideId}` 
            }, () => {
                fetchBids();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [rideId]);

    const acceptBid = async (bidId: string | number) => {
        // Handled primarily on-chain in MVP, but hook requires this function
        console.log("Bid accepted:", bidId);
    };

    const cancelBid = async (bidId: string | number) => {
        try {
            await supabase.from('bids').delete().eq('id', bidId);
            setBids(prev => prev.filter(b => b.id !== bidId));
        } catch (error) {
            console.error("Failed to reject bid:", error);
        }
    };

    return { bids, acceptBid, cancelBid };
};