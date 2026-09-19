import uuid from './uuid'

/**
 * Generate a UUID
 * @returns {string} A unique identifier
 */
export const generateUUID = () => uuid()

export { default as uuid } from './uuid'
export { default as debounce } from './debounce'
export {
  formatDate,
  formatDatePickerDisplay,
  getCalendarType,
  getDateFormat,
  getPickerFormat,
  nowAsSignatureUtcIso,
  parseStoredDate,
  serializeSignedDateTime,
  toStoredDateIso,
} from './dateUtil'
export { isSignedSignatureValue, pickSignatureValue } from './signatureCollect'
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
