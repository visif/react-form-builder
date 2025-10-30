import uuid from './uuid'

/**
 * Generate a UUID
 * @returns {string} A unique identifier
 */
export const generateUUID = () => uuid()

export { default as uuid } from './uuid'
export { default as debounce } from './debounce'
export { formatDate } from './dateUtil'
export { default as requests } from './requests'
export { myxss } from './xss'
export { TextAreaAutosize, DraftJs, draftToHtml, Editor } from './thirdParty'
