export interface UserSignInCredentials {
  email: string
  password: string
  options: {
    captchaToken: string
  }
}

export interface UserSignUpCredentials {
  email: string
  password: string
  options: {
    captchaToken: string
  }
}

export interface UserResetPasswordCredentials {
  email: string
  captchaToken: string
}
