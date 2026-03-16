import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gospouajpmvuawhbmwnn.supabase.co'
const supabaseKey = 'sb_publishable_qgLPKv3iMJeiHhWAislMRw_A0nfhnXJ'

export const supabase = createClient(supabaseUrl, supabaseKey)