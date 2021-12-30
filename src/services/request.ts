import router from '@/router'
import { useStore } from '@/store'
import axios from 'axios'
import dayjs from 'dayjs'
import type { JwtPayload } from 'jwt-decode'
import jwt_decode from 'jwt-decode'
import { LocalStorage } from 'quasar'

let isRefreshTokenRequestStarted = false
const publicRoutes = [{ path: /^\/api\/auth\/.*/ }, { path: /^\/upload\/items\/.*/, methods: ['GET'] }]

async function getAccessToken(): Promise<string> {
  try {
    let accessToken = LocalStorage.getItem('accessToken')?.toString()
    if (!accessToken) {
      const auth = await axios.post('/api/auth/refreshtoken', {}, { withCredentials: true })
      accessToken = auth.data.accessToken
    } else {
      const now = dayjs().unix()
      const jwtPayload = jwt_decode(accessToken) as JwtPayload
      if (!isRefreshTokenRequestStarted && jwtPayload.exp && jwtPayload.exp < now + 15) {
        isRefreshTokenRequestStarted = true
        const auth = await axios.post('/api/auth/refreshtoken', {}, { withCredentials: true })
        accessToken = auth.data.accessToken
      }
    }

    isRefreshTokenRequestStarted = false
    return accessToken || ''
  } catch (error) {
    return ''
  }
}

const request = axios.create({
  validateStatus: (status) => status < 500,
  timeout: 10000,
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
      const store = useStore()
      store.user = {}
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
