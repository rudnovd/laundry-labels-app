export interface User {
  _id: string
}

export interface UserRefreshTokenResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export type UserLoginResponse = Omit<UserRefreshTokenResponse, 'refreshtoken'>
