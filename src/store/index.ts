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
  deleteDoc,
  addDoc,
  FirestoreError,
  serverTimestamp,
} from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { userItem, userItemBlank } from '@/interfaces/userItem'
import { createStore } from 'vuex'
import { db, dbCollections, storage } from '@/firebase'
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

      const itemTypeDocument = await getDoc(doc(db, dbCollections.items_types, type.id, 'description', 'en'))
      const { value: itemTypeValue } = itemTypeDocument.data() || { itemTypeValue: null }

      const imagesValues = []
      if (images) {
        for (const image of images) {
          const imageUrl = await getDownloadURL(ref(storage, image))
          imagesValues.push(imageUrl)
        }
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

    return userItems
  } catch (error) {
    throw new Error(error)
  }
}

function storeError(error: FirestoreError) {
  console.error(error)
  Notify.create({
    type: 'negative',
    message: error.message,
  })
}

const store = createStore({
  actions: {
    async getItems({ state, commit }, payload: { page: number }): Promise<userItem[]> {
      try {
        if (!state.user) return storeError({ code: 'unauthenticated', message: 'auth required', name: 'auth-required' })

        const offset = (payload?.page * 10) | 10
        const dbQuery = query(
          collection(db, dbCollections.users_items),
          where('uid', '==', state.user.uid),
          where('isDeleted', '==', false),
          limit(offset)
        )
        let data = []

        const querySnapshot = await getDocs(dbQuery)

        if (offset > 10) {
          const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1]

          const dbQueryAfter = query(
            collection(db, dbCollections.users_items),
            where('uid', '==', state.user.uid),
            startAfter(lastDocument),
            limit(10)
          )

          const documents = await getDocs(dbQueryAfter)
          data = await getFormattedUserItems(documents)
        } else {
          data = await getFormattedUserItems(querySnapshot)
        }

        commit('SET_USER_ITEMS', data)
        return state.items
      } catch (error) {
        storeError(error)
      }
      return state.items
    },
    async getUserItemById({ state, commit }, payload: { id: string }) {
      try {
        const documentReference = doc(db, dbCollections.users_items, payload.id)
        const document = await getDoc(documentReference)

        const data = await getFormattedUserItems([document])

        commit('SET_USER_ITEMS', data)
        return state.items
      } catch (error) {
        storeError(error)
      }
    },
    async createUserItem({ state, commit }, payload: { userItemBlank: userItemBlank }): Promise<userItem[]> {
      try {
        if (!payload.userItemBlank.type) throw { message: 'type required' }

        const laundryIcons = payload.userItemBlank.laundryIcons.map((laundryIcon) => {
          return doc(db, dbCollections.laundry_icons_groups, laundryIcon.group.code, 'icons', laundryIcon.code)
        })

        const firebaseUserItemBlank = {
          ...payload.userItemBlank,
          type: doc(db, dbCollections.items_types, payload.userItemBlank.type.code),
          laundryIcons,
          uid: getAuth().currentUser?.uid,
          created: serverTimestamp(),
          isDeleted: false,
        }

        const newItem = await addDoc(collection(db, dbCollections.users_items), firebaseUserItemBlank)
        const data = await getFormattedUserItems([await getDoc(newItem)])

        commit('ADD_USER_ITEM', ...data)
      } catch (error) {
        storeError(error)
      }
        return state.items
      } catch (error) {
        storeError(error)
      }
    },
    async deleteUserItem({ state, commit }, payload: { id: string }) {
      try {
        const documentReference = doc(db, dbCollections.users_items, payload.id)
        await deleteDoc(documentReference)

        commit('DELETE_USER_ITEM', payload.id)
        return state.items
      } catch (error) {
        storeError(error)
      }
    },

    async getLaundryLabelsIcons({ state, commit }) {
      try {
        const iconsGroupsDocuments = await getDocs(collection(db, 'laundry_icons_groups'))
        // TODO: fix type
        const icons: { [key: string]: any } = {}

        for (const iconGroupDocument of iconsGroupsDocuments.docs) {
          const iconsDocuments = await getDocs(collection(db, 'laundry_icons_groups', iconGroupDocument.id, 'icons'))

          const iconGroupDocumentName = await getDoc(
            doc(db, 'laundry_icons_groups', iconGroupDocument.id, 'name', 'en')
          )
          const { value: groupValue } = iconGroupDocumentName.data() || { value: null }

          icons[iconGroupDocument.id] = {
            icons: [] as Array<laundryIcon>,
            name: groupValue,
          }

          for (const iconDocument of iconsDocuments.docs) {
            const { icon } = iconDocument.data() || { icon: null }

            const descriptionDocument = await getDoc(doc(db, iconDocument.ref.path, 'description', 'en'))
            const { value: textValue } = descriptionDocument.data() || { value: null }

            icons[iconGroupDocument.id].icons.push({
              code: iconDocument.id,
              icon,
              group: {
                code: iconGroupDocument.id,
                value: groupValue,
              },
              text: textValue,
            })
          }
        }

        commit('SET_LAUNDRY_LABELS_OPTIONS', { icons })
        return state.laundryLabelsOptions
      } catch (error) {
        storeError(error)
      }
    },
    async getItemsTypes({ state, commit }) {
      try {
        const types = []
        const itemsTypesDocuments = await getDocs(collection(db, 'items_types'))
        for (const itemTypeDocument of itemsTypesDocuments.docs) {
          const itemTypeDescriptionDocument = await getDoc(
            doc(db, 'items_types', itemTypeDocument.id, 'description', 'en')
          )
          const { value: typeValue } = itemTypeDescriptionDocument.data() || { value: null }

          types.push({
            code: itemTypeDocument.id,
            value: typeValue,
          })
        }

        commit('SET_LAUNDRY_LABELS_OPTIONS', { types })
        return state.laundryLabelsOptions
      } catch (error) {
        storeError(error)
      }
    },
  },
  mutations: {
    // SET_USER(state, user: User) {
    //   state.user = user
    // },
    SET_USER_ITEMS(state, items: userItem[]) {
      state.items = items
    },

    ADD_USER_ITEM(state, item: userItem) {
      state.items.push(item)
    },
    DELETE_USER_ITEM(state, id: string) {
      state.items = state.items.filter((item) => item.id !== id)
    },

    SET_LAUNDRY_LABELS_OPTIONS(
      state,
      payload: { types?: Array<Record<string, string>>; icons?: Array<laundryIcon>; colors?: [] }
    ) {
      state.laundryLabelsOptions = {
        ...state.laundryLabelsOptions,
        ...payload,
      }
    },
  },
  state: {
    // user: null as User | null,
    items: [] as Array<userItem>,

    laundryLabelsOptions: {
      types: [] as Array<Record<string, string>>,
      icons: [] as Array<laundryIcon>,
      colors: [],
    },
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
