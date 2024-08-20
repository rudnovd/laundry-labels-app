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
    const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegExp.test(String(value).toLowerCase())
  },
}
