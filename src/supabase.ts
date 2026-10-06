import type { Database } from '@/types/supabase'
import { createClient } from '@supabase/supabase-js'
import { IS_OFFLINE_APP, IS_TAURI } from './constants'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
export const supabase = (() => {
  if (IS_OFFLINE_APP) {
    return null
  }
  return createClient<Database>(supabaseUrl, supabaseKey, {
    db: {
      timeout: 15_000,
    },
    auth: {
      flowType: IS_TAURI ? 'pkce' : 'implicit',
      storageKey: 'auth',
    },
  })
})()
