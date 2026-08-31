/**
 * Unique names for Dynamic Column Row export tags: #tableName_cellName#
 */

function stripNameMarkup(text) {
  if (text == null) {
    return ''
  }
  return `${text}`
    .replace(/<[^>]*>/g, ' ')
    .replace(/#/g, '')
    .replace(/&nbsp;/gi, ' ')
}

function collapseSeparators(text) {
  return text
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

/** Table unique names stay ASCII (template / export compatibility). */
export function sanitizeUniqueName(text) {
  return collapseSeparators(stripNameMarkup(text).replace(/[^A-Za-z0-9]+/g, '_'))
}

/**
 * Cell unique names: keep letters/numbers from any language (incl. Thai);
 * strip # / HTML; turn other runs into _.
 */
export function sanitizeCellName(text) {
  return collapseSeparators(stripNameMarkup(text).replace(/[^\p{L}\p{N}]+/gu, '_'))
}

export function defaultCellName(row, col) {
  const rowIndex = Number(row)
  const colIndex = Number(col)
  const rowNum = Number.isFinite(rowIndex) ? rowIndex + 1 : 1
  const colNum = Number.isFinite(colIndex) ? colIndex + 1 : 1
  return `r${rowNum}c${colNum}`
}

export function effectiveCellName(child) {
  if (!child) {
    return defaultCellName(null, null)
  }
  const named = sanitizeCellName(child.cellName)
  if (named) {
    return named
  }
  return defaultCellName(child.row, child.col)
}

export function isAutoCellName(name, row, col) {
  return name === defaultCellName(row, col)
}

export function applyAutoCellName(child, row, col) {
  if (!child) {
    return child
  }
  if (child.cellNameCustom && child.cellName) {
    return child
  }
  child.cellName = defaultCellName(row, col)
  child.cellNameCustom = false
  return child
}

export function applyAutoCellNamesAfterSwap(
  movingChild,
  newRow,
  newCol,
  displacedChild,
  displacedRow,
  displacedCol
) {
  applyAutoCellName(movingChild, newRow, newCol)
  applyAutoCellName(displacedChild, displacedRow, displacedCol)
}

export function nextDynamicColumnRowUniqueName(data) {
  const used = new Set()
  ;(Array.isArray(data) ? data : []).forEach((item) => {
    if (item && item.element === 'DynamicColumnRow') {
      const name = sanitizeUniqueName(item.uniqueName)
      if (name) {
        used.add(name)
      }
    }
  })
  let i = 1
  let candidate = `DynamicColumnRow${i}`
  while (used.has(candidate)) {
    i += 1
    candidate = `DynamicColumnRow${i}`
  }
  return candidate
}

export function isUniqueNameTaken(data, uniqueName, exceptId) {
  const wanted = sanitizeUniqueName(uniqueName)
  if (!wanted) {
    return false
  }
  return (Array.isArray(data) ? data : []).some(
    (item) =>
      item &&
      item.element === 'DynamicColumnRow' &&
      item.id !== exceptId &&
      sanitizeUniqueName(item.uniqueName) === wanted
  )
}

/** True when another cell in the same Dynamic Column Row table already uses this name. */
export function isCellNameTaken(data, parentId, cellName, exceptId) {
  const wanted = sanitizeCellName(cellName)
  if (!wanted || !parentId) {
    return false
  }
  return (Array.isArray(data) ? data : []).some(
    (item) =>
      item &&
      item.parentId === parentId &&
      item.id !== exceptId &&
      effectiveCellName(item) === wanted
  )
}

export function templateTagPreview(tableUniqueName, cellName) {
  const table = sanitizeUniqueName(tableUniqueName) || 'DynamicColumnRow1'
  const cell = sanitizeCellName(cellName) || 'r1c1'
  return `#${table}_${cell}#`
}

/** Print fill-down tag: #WorkHistory_c1# (1-based column index). */
export function templateColumnTagPreview(tableUniqueName, col) {
  const table = sanitizeUniqueName(tableUniqueName) || 'DynamicColumnRow1'
  const colIndex = Number(col)
  const colNum = Number.isFinite(colIndex) ? colIndex + 1 : 1
  return `#${table}_c${colNum}#`
}
