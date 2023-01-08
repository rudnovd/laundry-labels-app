import { createPinia } from 'pinia'
import { Notify } from 'quasar'

const pinia = createPinia()

interface ErrorResponse {
  name: string
  message: string
}

pinia.use(({ store }) => {
  store.$onAction(({ name, args, onError }) => {
    // catch errors from all store actions
    onError((storeError) => {
      const error: ErrorResponse = storeError as ErrorResponse

      if (import.meta.env.DEV) {
        console.warn(`Failed action "${name}" in store "${store.$id}" with args "${JSON.stringify(args)}".`)
      }

      if (!error.name || !error.message) throw new Error()

      console.error(`${error.name}: ${error.message}`)
      Notify.create({
        type: 'negative',
        message: error.message,
        timeout: 5000,
      })
      throw new Error(error.message)
    })
  })
})

export default pinia
