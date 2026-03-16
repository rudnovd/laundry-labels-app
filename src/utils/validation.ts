export const validation = {
  notEmpty(value: string | number) {
    return !!String(value).length
  },
  minLength(value: string | number, min: number) {
    return String(value).length >= min
  },
  isEqual(value1: string | number, value2: string | number) {
    return String(value1) === String(value2)
  },
  isEmail(value: string | number) {
    // eslint-disable-next-line e18e/prefer-static-regex
    const emailRegExp = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    return emailRegExp.test(String(value).toLowerCase())
  },
}
