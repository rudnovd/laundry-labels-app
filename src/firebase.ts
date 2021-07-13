import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
})

export const db = getFirestore()
export const storage = getStorage()

export enum dbCollections {
  items_types = 'items_types',
  languages = 'languages',
  laundry_icons_groups = 'laundry_icons_groups',
  users_items = 'users_items',
}
