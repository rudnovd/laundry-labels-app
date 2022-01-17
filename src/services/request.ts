import type { UserRefreshTokenResponse } from '@/interfaces/user'
import router from '@/router'
import { useStore } from '@/store'
import dayjs from 'dayjs'
import type { JwtPayload } from 'jwt-decode'
import jwt_decode from 'jwt-decode'
import ky from 'ky'
import { LocalStorage } from 'quasar'

let isRefreshTokenRequestStarted = false
const publicRoutes = [{ path: /\/api\/auth\/.*/ }, { path: /\/upload\/items\/.*/, methods: ['GET'] }]

async function getAccessToken(): Promise<string> {
  try {
    let accessToken = LocalStorage.getItem('accessToken')?.toString()

    // get new token
    if (!accessToken) {
      const auth = await ky.post('/api/auth/refreshtoken').json<UserRefreshTokenResponse>()
      accessToken = auth.refreshToken
    } else {
      const now = dayjs().unix()
      const MAX_REQUEST_TIME_SECONDS = 10
      const jwtPayload: JwtPayload = jwt_decode(accessToken)

      // if current token expired soon get new token
      if (!isRefreshTokenRequestStarted && jwtPayload.exp && jwtPayload.exp < now + MAX_REQUEST_TIME_SECONDS) {
        isRefreshTokenRequestStarted = true
        const auth = await ky.post('/api/auth/refreshtoken').json<UserRefreshTokenResponse>()
        console.log(auth)
        accessToken = auth.refreshToken
      }
    }

    return accessToken
  } catch (error) {
    return ''
  } finally {
    isRefreshTokenRequestStarted = false
  }
}

const request = ky.create({
  timeout: 10000,
  hooks: {
    beforeRequest: [
      async (request) => {
        const isPublicRoute = publicRoutes.find((publicRoute) => {
          const isMatchUrl = request.url?.match(publicRoute.path)
          const isRouteMethodAllowed = publicRoute.methods ? publicRoute.methods.indexOf(request.method) > -1 : true
          return isMatchUrl && isRouteMethodAllowed
        })
        if (isPublicRoute) return

        const accessToken = await getAccessToken()
        request.headers.set('Authorization', `Bearer ${accessToken}`)
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // if unauthorized error
        if (response.status === 401) {
          const store = useStore()
          store.user = {}
          router.push('/login')
        } else if (!response.ok) {
          // throw { error: { name: string; message: string } } from server
          throw await response.json()
        }
      },
    ],
  },
  throwHttpErrors: false,
})

export default request
