/**
 * Unique names for Dynamic Column Row export tags: #tableName_cellName#
 */

export function sanitizeUniqueName(text) {
  if (text == null) {
    return ''
  }
  const stripped = `${text}`
    .replace(/<[^>]*>/g, ' ')
    .replace(/#/g, '')
    .replace(/&nbsp;/gi, ' ')
  return stripped
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

export function defaultCellName(row, col) {
  const rowIndex = Number(row)
  const colIndex = Number(col)
  const rowNum = Number.isFinite(rowIndex) ? rowIndex + 1 : 1
  const colNum = Number.isFinite(colIndex) ? colIndex + 1 : 1
  return `r${rowNum}c${colNum}`
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

export function templateTagPreview(tableUniqueName, cellName) {
  const table = sanitizeUniqueName(tableUniqueName) || 'DynamicColumnRow1'
  const cell = sanitizeUniqueName(cellName) || 'r1c1'
  return `#${table}_${cell}#`
}
