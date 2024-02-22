import { createPinia } from 'pinia'
import { Notify } from 'quasar'

interface ErrorResponse {
  name: string
  message: string
  status: number
}

const pinia = createPinia()
pinia.use(({ store }) => {
  store.$onAction(({ name, args, onError }) => {
    // catch errors from all store actions
    onError((storeError) => {
      const error: ErrorResponse = storeError as ErrorResponse
      if (import.meta.env.DEV) {
        console.warn(`Failed action "${name}" in store "${store.$id}" with args "${JSON.stringify(args)}".`)
      }
      if (!error.name || !error.message) throw error

      console.error(`${error.name}: ${error.message}`)
      Notify.create({
        type: 'negative',
        message: error.message,
        timeout: 5000,
      })
      throw error
    })
  })
})

export default pinia
