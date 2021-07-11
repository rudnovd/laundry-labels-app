import {
  query,
  limit,
  collection,
  getDocs,
  where,
  doc,
  startAfter,
  DocumentData,
  getDoc,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { userItem } from '@/interfaces/userItem'
import { createStore } from 'vuex'
import { db, storage } from '@/firebase'
import { Notify } from 'quasar'
import { User } from 'firebase/auth'
import { laundryIcon } from '@/interfaces/laundryIcon'

async function getFormattedUserItems(documents: QuerySnapshot<DocumentData> | Array<DocumentSnapshot<DocumentData>>) {
  try {
    const userItems = []

    for (const document of Array.isArray(documents) ? documents : documents.docs) {
      if (!document.exists()) continue

      const { name, created, type, laundryIcons, images } = document.data()

      const laundryIconsValues: Array<laundryIcon> = []
      for (const laundryIconGroupRef of laundryIcons) {
        const iconDocument = await getDoc(doc(db, laundryIconGroupRef.path))
        const { icon } = iconDocument.data() || { icon: null }

        const iconGroupDocument = await getDoc(doc(db, laundryIconGroupRef.parent.parent.path, 'name', 'en'))
        const { value: groupValue } = iconGroupDocument.data() || { value: null }

        const descriptionDocument = await getDoc(doc(db, laundryIconGroupRef.path, 'description', 'en'))
        const { value: textValue } = descriptionDocument.data() || { value: null }

        laundryIconsValues.push({
          code: laundryIconGroupRef.id,
          icon,
          group: {
            code: laundryIconGroupRef.parent.parent.id,
            value: groupValue,
          },
          text: textValue,
        })
      }

      const itemTypeDocument = await getDoc(doc(db, 'items_types', type.id, 'description', 'en'))
      const { value: itemTypeValue } = itemTypeDocument.data() || { itemTypeValue: null }

      const imagesValues = []
      for (const image of images) {
        const imageUrl = await getDownloadURL(ref(storage, image))
        imagesValues.push(imageUrl)
      }

      const userItem: userItem = {
        id: document.id,
        name,
        images: imagesValues,
        created,
        type: itemTypeValue,
        laundryIcons: laundryIconsValues,
      }

      userItems.push(userItem)
    }

    console.log(userItems)

    return userItems
  } catch (error) {
    throw new Error(error)
  }
}

const store = createStore({
  actions: {
    async getItems({ rootState, commit }, payload: { page: number }) {
      try {
        if (!rootState.user) throw new Error('auth reqired')

        const offset = (payload?.page * 10) | 10
        const dbQuery = query(
          collection(db, 'users_items'),
          where('uid', '==', rootState.user.uid),
          where('isDeleted', '==', false),
          limit(offset)
        )
        let data = []

        const querySnapshot = await getDocs(dbQuery)

        if (offset > 10) {
          const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1]

          const dbQueryAfter = query(
            collection(db, 'users_items'),
            where('uid', '==', rootState.user.uid),
            startAfter(lastDocument),
            limit(10)
          )

          const documents = await getDocs(dbQueryAfter)
          data = await getFormattedUserItems(documents)
        } else {
          data = await getFormattedUserItems(querySnapshot)
        }

        commit('SET_USER_ITEMS', data)
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'negative',
          message: error.message,
        })
      }
    },
    async getUserItemById({ commit }, payload: { id: string }) {
      try {
        const documentReference = doc(db, 'users_items', payload.id)
        const document = await getDoc(documentReference)

        const data = await getFormattedUserItems([document])

        console.log('userItem', data)

        commit('SET_USER_ITEMS', data)
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'negative',
          message: error.message,
        })
      }
    },
  },
  mutations: {
    SET_USER(state, user: User) {
      state.user = user
    },
    SET_USER_ITEMS(state, items: userItem[]) {
      state.items = items
    },
  },
  state: {
    user: null as User | null,
    items: [] as Array<userItem>,
  },

  strict: process.env.NODE_ENV === 'development',
})

if (process.env.NODE_ENV === 'development') {
  store.subscribe((mutation) => {
    console.log(
      '%c%s',
      'font-family: "Jetbrains Mono", color: black; font-weight: bold; padding: 8px; background: rgb(104, 184, 132); font-size: 14px;',
      `Mutation logger: ${mutation.type}(${mutation.payload})`
    )

    console.log(
      '%c%s',
      'font-family: "Jetbrains Mono", color: black; font-weight: bold; padding: 8px; background: rgb(104, 184, 132); font-size: 14px;',
      `Mutation logger: ${JSON.stringify(mutation.payload)}`
    )
  })

  store.subscribeAction((action) => {
    console.log(
      '%c%s',
      'font-family: "Jetbrains Mono", color: black; font-weight: bold; padding: 8px; background: rgb(104, 184, 132); font-size: 14px;',
      `Action logger: ${action.type}(${action.payload})`
    )

    console.log(
      '%c%s',
      'font-family: "Jetbrains Mono", color: black; font-weight: bold; padding: 8px; background: rgb(104, 184, 132); font-size: 14px;',
      `Payload logger: ${JSON.stringify(action.payload)}`
    )
  })
}

export default store
