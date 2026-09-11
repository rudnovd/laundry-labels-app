import { createPinia } from 'pinia'
import { toast } from 'vue-sonner'
import { IS_OFFLINE_APP } from '@/constants'
import { supabase } from '@/supabase'

interface ErrorResponse {
  name: string
  message: string
  status: number
}

const pinia = createPinia()
pinia.use(({ store }) => {
  store.$onAction(({ name, store: { $id }, args, onError }) => {
    if (($id === 'items' || $id === 'user') && !IS_OFFLINE_APP && !supabase) {
      throw new Error('Supabase not initialized')
    }
    // catch errors from all store actions
    onError((storeError) => {
      const error: ErrorResponse = storeError as ErrorResponse
      if (import.meta.env.DEV) {
        console.warn(`Failed action "${name}" in store "${store.$id}" with args "${JSON.stringify(args)}".`)
      }
      if (!error.name || !error.message) {
        return console.error(error)
      }
      console.error(`${error.name}: ${error.message}`)
      toast.error(error.message)
    })
  })
})
export default pinia
