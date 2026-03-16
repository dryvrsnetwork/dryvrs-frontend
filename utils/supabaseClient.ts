import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 🚨 DIAGNOSTIC LOGS - This will print exactly what the app sees
console.log("=== SUPABASE DIAGNOSTICS ===");
console.log("URL:", supabaseUrl ? supabaseUrl : "UNDEFINED ❌");
console.log("KEY:", supabaseAnonKey ? supabaseAnonKey.substring(0, 15) + "..." : "UNDEFINED ❌");

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder_key"
)