import uuid from './uuid'

/**
 * Generate a UUID
 * @returns {string} A unique identifier
 */
export const generateUUID = () => uuid()

export { default as uuid } from './uuid'
export { default as debounce } from './debounce'
export { formatDate } from './dateUtil'
export { post, get } from './requests'
export { default as myxss } from './xss'
