import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { IS_OFFLINE_APP } from './constants'

export const supabase = (() => {
  if (IS_OFFLINE_APP) return null
  const url = import.meta.env.VITE_APP_SUPABASE_URL.length ? import.meta.env.VITE_APP_SUPABASE_URL : 'http://localhost'
  const key = import.meta.env.VITE_APP_SUPABASE_KEY.length ? import.meta.env.VITE_APP_SUPABASE_KEY : 'localhost'
  return createClient<Database>(url, key)
})()
