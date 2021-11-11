import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import { Dialog, Loading, LocalStorage, Notify } from 'quasar'
import './styles/quasar.scss'

export default {
  config: {},
  plugins: {
    Notify,
    Loading,
    LocalStorage,
    Dialog,
  },
}
