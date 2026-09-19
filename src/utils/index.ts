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
export {
  applyAutoCellName,
  applyAutoCellNamesAfterSwap,
  defaultCellName,
  effectiveCellName,
  isCellNameTaken,
  isUniqueNameTaken,
  nextDynamicColumnRowUniqueName,
  sanitizeCellName,
  sanitizeUniqueName,
  templateColumnTagPreview,
  templateTagPreview,
} from './dynamic-column-row-names'
