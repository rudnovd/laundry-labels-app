import type { UserRefreshTokenResponse } from '@/interfaces/user'
import router from '@/router'
import { useUserStore } from '@/store/user'
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
      LocalStorage.set('accessToken', auth.accessToken)
      LocalStorage.set('hasRefreshToken', true)
      accessToken = auth.accessToken
    } else {
      const now = dayjs().unix()
      const MAX_REQUEST_TIME_SECONDS = 10
      const jwtPayload: JwtPayload = jwt_decode(accessToken)

      // if current token expired soon get new token
      if (!isRefreshTokenRequestStarted && jwtPayload.exp && jwtPayload.exp < now + MAX_REQUEST_TIME_SECONDS) {
        isRefreshTokenRequestStarted = true
        const auth = await ky.post('/api/auth/refreshtoken').json<UserRefreshTokenResponse>()
        LocalStorage.set('accessToken', auth.accessToken)
        LocalStorage.set('hasRefreshToken', true)
        accessToken = auth.accessToken
      }
    }

    return accessToken
  } catch (error) {
    LocalStorage.remove('accessToken')
    LocalStorage.remove('hasRefreshToken')
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
          const user = useUserStore()
          user.user = null
          router.push('/signIn')
        } else if (!response.ok) {
          const error = await response.json()
          throw { name: error.error.name, message: error.error.message }
        }
      },
    ],
  },
  throwHttpErrors: false,
})

export default request
