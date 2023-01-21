import jwt_decode, { type JwtPayload } from 'jwt-decode'
import { date, LocalStorage } from 'quasar'

export function isAccessTokenValid() {
  const accessToken = LocalStorage.getItem('accessToken')?.toString()
  if (!accessToken) {
    return false
  }

  const MAX_REQUEST_TIME_SECONDS = 30
  const jwtPayload = jwt_decode<JwtPayload>(accessToken)
  const tokenExpireTime = jwtPayload.exp ?? 0
  const currentTime = Number(date.formatDate(Date.now(), 'X'))

  const isTokenExpire = tokenExpireTime < currentTime + MAX_REQUEST_TIME_SECONDS
  if (isTokenExpire) {
    return false
  }

  return true
}
