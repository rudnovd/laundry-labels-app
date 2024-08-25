export const IS_LOCAL_SUPABASE = import.meta.env.VITE_APP_IS_LOCAL_SUPABASE === 'true'
export const IS_OFFLINE_APP = import.meta.env.VITE_APP_IS_OFFLINE === 'true'
export const REQUEST_THROTTLE_TIMEOUT = 5000

export const MAX_ITEM_PHOTO_UNCOMPRESSED_SIZE = 15_728_640
export const HAS_ITEMS_LIMIT = !IS_LOCAL_SUPABASE || !IS_OFFLINE_APP
export const ITEMS_LIMIT = 50
