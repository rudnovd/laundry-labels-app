import type { UserRefreshTokenResponse } from '@/interfaces/user'
import router from '@/router'
import { useUserStore } from '@/store/user'
import ky from 'ky'
import { LocalStorage } from 'quasar'
import { isAccessTokenValid } from './jwt'

const publicRoutes = [{ path: /\/auth\/.*/ }, { path: /\/upload\/items\/.*/, methods: ['GET'] }]

enum ResponseStatus {
  Unauthorized = 400,
  InternalServerError = 500,
}

const refreshTokenRequests: Array<Promise<UserRefreshTokenResponse>> = []
export async function getAccessToken() {
  try {
    let accessToken = LocalStorage.getItem('accessToken')?.toString() ?? ''

    if (!refreshTokenRequests.length && !isAccessTokenValid()) {
      refreshTokenRequests.push(ky.post('/auth/refreshtoken').json<UserRefreshTokenResponse>())
    }
    if (refreshTokenRequests.length) {
      const auth = await Promise.all(refreshTokenRequests)
      accessToken = auth[0].accessToken
      if (!isAccessTokenValid()) {
        LocalStorage.set('accessToken', accessToken)
        LocalStorage.set('hasRefreshToken', !!accessToken)
      }
    }

    return accessToken
  } catch (error) {
    LocalStorage.remove('accessToken')
    LocalStorage.remove('hasRefreshToken')
    throw { name: 'Internal Server Error', message: 'Internal Server Error' }
  } finally {
    refreshTokenRequests.pop()
  }
}

const request = ky.create({
  timeout: 30000,
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      async (request) => {
        const isPublicRoute = publicRoutes.find((publicRoute) => {
          const isMatchUrl = request.url?.match(publicRoute.path)
          const isRouteMethodAllowed = publicRoute.methods ? publicRoute.methods.includes(request.method) : true
          return isMatchUrl && isRouteMethodAllowed
        })
        if (isPublicRoute) return

        const accessToken = await getAccessToken()
        request.headers.set('Authorization', `Bearer ${accessToken}`)
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.ok) return

        switch (response.status) {
          case ResponseStatus.Unauthorized: {
            const user = useUserStore()
            user.user = null
            router.push('/signIn')
            throw { name: 'Unauthorized', message: 'Authorization error' }
          }
          case ResponseStatus.InternalServerError: {
            throw { name: 'Internal Server Error', message: 'Internal Server Error' }
          }
          default: {
            const error = await response.json()
            throw { name: error.error.name, message: error.error.message }
          }
        }
      },
    ],
  },
})

export default request
