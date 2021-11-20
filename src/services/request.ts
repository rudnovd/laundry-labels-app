import router from '@/router'
import store from '@/store'
import axios from 'axios'
import dayjs from 'dayjs'
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { LocalStorage } from 'quasar'

let isRefreshTokenRequestStarted = false
const publicRoutes = [{ path: /^\/auth\/.*/ }, { path: /^\/upload\/items\/.*/, methods: ['GET'] }]

async function getAccessToken(): Promise<string> {
  let accessToken = LocalStorage.getItem('accessToken')?.toString()
  if (!accessToken) {
    accessToken = (await store.dispatch('getAuthFromRefreshToken')).accessToken
  } else {
    const now = dayjs().unix()
    const jwtPayload = jwt_decode(accessToken) as JwtPayload

    if (!isRefreshTokenRequestStarted && jwtPayload.exp && jwtPayload.exp < now + 15) {
      isRefreshTokenRequestStarted = true
      accessToken = (await store.dispatch('getAuthFromRefreshToken')).accessToken
    }
  }

  isRefreshTokenRequestStarted = false
  return accessToken ? accessToken : ''
}

const request = axios.create({
  validateStatus: (status) => status < 500,
  headers: {
    Authorization: `Bearer ${LocalStorage.getItem('accessToken')}`,
  },
})

request.interceptors.request.use(async (config) => {
  // do nothing if public api route
  if (
    publicRoutes.find((route) => {
      const isMatchUrl = config.url?.match(route.path)
      const isRouteMethod = route.methods && config.method ? route.methods.indexOf(config.method) > -1 : true
      return isMatchUrl && isRouteMethod
    })
  )
    return config

  const accessToken = await getAccessToken()
  return {
    ...config,
    headers: {
      common: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  }
})

request.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      store.commit('SET_USER', {})
      router.push('/welcome')
    } else if (response.data.error) {
      // eslint-disable-next-line
      console.log(response.data.error)
    }

    return response
  },
  (error) => Promise.reject(error)
)

export default request
