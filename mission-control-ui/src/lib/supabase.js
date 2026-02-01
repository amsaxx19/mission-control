import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ihdbwzuslgtepalvjwxz.supabase.co'
const supabaseAnonKey = 'sb_publishable_rQkHIzJJuYpMK5Fg_zpDAg_buaoi20b'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})