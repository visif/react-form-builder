/* eslint-disable eqeqeq, no-param-reassign, prefer-rest-params, no-bitwise, no-multi-assign */
// Private array of chars to use
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

// Use crypto.getRandomValues when available for better randomness
const getRandomInt = (max: number): number => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] % max
  }
  return Math.floor(Math.random() * max)
}

const uuid = (len?: number, radix?: number): string => {
  const chars = CHARS
  const uuidArr: string[] = []
  let i: number
  const resolvedRadix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuidArr[i] = chars[getRandomInt(resolvedRadix)]
  } else {
    // rfc4122, version 4 form
    let r: number

    // rfc4122 requires these characters
    uuidArr[8] = uuidArr[13] = uuidArr[18] = uuidArr[23] = '-'
    uuidArr[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuidArr[i]) {
        r = getRandomInt(16)
        uuidArr[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuidArr.join('')
}

// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
// by minimizing calls to random()
const uuidFast = (): string => {
  const chars = CHARS
  const uuidArr = new Array<string>(36)
  let rnd = 0
  let r: number
  for (let i = 0; i < 36; i++) {
    if (i == 8 || i == 13 || i == 18 || i == 23) {
      uuidArr[i] = '-'
    } else if (i == 14) {
      uuidArr[i] = '4'
    } else {
      if (rnd <= 0x02) rnd = (0x2000000 + getRandomInt(0x1000000)) | 0
      r = rnd & 0xf
      rnd >>= 4
      uuidArr[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
    }
  }
  return uuidArr.join('')
}

// A more compact, but less performant, RFC4122v4 solution:
const uuidCompact = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = getRandomInt(16)
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

const ID = {
  uuid,
  uuidFast,
  uuidCompact,
}

export default ID
