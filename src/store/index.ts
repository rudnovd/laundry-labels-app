import { createPinia } from 'pinia'
import { Notify } from 'quasar'

const pinia = createPinia()

pinia.use(({ store }) => {
  store.$onAction(({ onError }) => {
    // catch errors for all store actions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError((response: any) => {
      console.error(`${response.name}: ${response.message}`)
      Notify.create({
        type: 'negative',
        message: response.message,
        timeout: 5000,
      })
      throw new Error(response.message)
    })
  })
})

export default pinia
