/**
 * Unique names for Dynamic Column Row export tags: #tableName_cellName#
 */

function stripNameMarkup(text: unknown): string {
  if (text == null) {
    return ''
  }
  return `${text}`
    .replace(/<[^>]*>/g, ' ')
    .replace(/#/g, '')
    .replace(/&nbsp;/gi, ' ')
}

function collapseSeparators(text: string): string {
  return text.replace(/_+/g, '_').replace(/^_|_$/g, '')
}

/** Table unique names stay ASCII (template / export compatibility). */
export function sanitizeUniqueName(text: unknown): string {
  return collapseSeparators(stripNameMarkup(text).replace(/[^A-Za-z0-9]+/g, '_'))
}

/**
 * Cell unique names: keep letters/numbers from any language (incl. Thai);
 * strip # / HTML; turn other runs into _.
 */
export function sanitizeCellName(text: unknown): string {
  return collapseSeparators(stripNameMarkup(text).replace(/[^\p{L}\p{N}]+/gu, '_'))
}

export function defaultCellName(row: unknown, col: unknown): string {
  const rowIndex = Number(row)
  const colIndex = Number(col)
  const rowNum = Number.isFinite(rowIndex) ? rowIndex + 1 : 1
  const colNum = Number.isFinite(colIndex) ? colIndex + 1 : 1
  return `r${rowNum}c${colNum}`
}

type NamedChild = {
  id?: string
  cellName?: string | null
  cellNameCustom?: boolean
  row?: number
  col?: number
  parentId?: string
  element?: string
  uniqueName?: string
}

export function effectiveCellName(child: NamedChild | null | undefined): string {
  if (!child) {
    return defaultCellName(null, null)
  }
  const named = sanitizeCellName(child.cellName)
  if (named) {
    return named
  }
  return defaultCellName(child.row, child.col)
}

export function isAutoCellName(name: string, row: unknown, col: unknown): boolean {
  return name === defaultCellName(row, col)
}

/**
 * Keep an automatic r{row}c{col} name aligned with the cell the element now
 * occupies. A custom name is kept, except when it is still the previous
 * cell's coordinate name — that name belongs to the cell, so it follows the move.
 */
export function applyAutoCellName<T extends NamedChild>(
  child: T | null | undefined,
  row: number,
  col: number,
  previousRow?: unknown,
  previousCol?: unknown
): T | null | undefined {
  if (!child) {
    return child
  }
  const nextName = defaultCellName(row, col)
  const priorName = defaultCellName(
    previousRow !== undefined ? previousRow : child.row,
    previousCol !== undefined ? previousCol : child.col
  )
  const current = sanitizeCellName(child.cellName)
  const keepsCustomName =
    Boolean(child.cellNameCustom) &&
    Boolean(current) &&
    current !== priorName &&
    current !== nextName
  if (keepsCustomName) {
    return child
  }
  child.cellName = nextName
  child.cellNameCustom = false
  return child
}

export function applyAutoCellNamesAfterSwap(
  movingChild: NamedChild | null | undefined,
  newRow: number,
  newCol: number,
  displacedChild: NamedChild | null | undefined,
  displacedRow: number,
  displacedCol: number
): void {
  if (movingChild && displacedChild && movingChild === displacedChild) {
    applyAutoCellName(movingChild, newRow, newCol, displacedRow, displacedCol)
    return
  }
  applyAutoCellName(movingChild, newRow, newCol, displacedRow, displacedCol)
  applyAutoCellName(displacedChild, displacedRow, displacedCol, newRow, newCol)
}

/** First unused coordinate name, then r6c3_2, r6c3_3, … when that name is taken. */
export function nextFreeCellName(
  data: NamedChild[] | null | undefined,
  parentId: string | undefined,
  row: number,
  col: number,
  exceptId: string | undefined
): string {
  const base = defaultCellName(row, col)
  if (!isCellNameTaken(data, parentId, base, exceptId)) {
    return base
  }
  let suffix = 2
  let candidate = `${base}_${suffix}`
  while (isCellNameTaken(data, parentId, candidate, exceptId)) {
    suffix += 1
    candidate = `${base}_${suffix}`
  }
  return candidate
}

export function ensureUniqueAutoCellName(
  data: NamedChild[] | null | undefined,
  parentId: string | undefined,
  child: NamedChild | null | undefined,
  row: number,
  col: number
): void {
  if (!child || child.cellNameCustom) {
    return
  }
  if (!isCellNameTaken(data, parentId, child.cellName, child.id)) {
    return
  }
  child.cellName = nextFreeCellName(data, parentId, row, col, child.id)
  child.cellNameCustom = false
}

export function nextDynamicColumnRowUniqueName(data: NamedChild[] | null | undefined): string {
  const used = new Set<string>()
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

export function isUniqueNameTaken(
  data: NamedChild[] | null | undefined,
  uniqueName: unknown,
  exceptId: string | undefined
): boolean {
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
export function isCellNameTaken(
  data: NamedChild[] | null | undefined,
  parentId: string | undefined,
  cellName: unknown,
  exceptId: string | undefined
): boolean {
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

export function templateTagPreview(tableUniqueName: unknown, cellName: unknown): string {
  const table = sanitizeUniqueName(tableUniqueName) || 'DynamicColumnRow1'
  const cell = sanitizeCellName(cellName) || 'r1c1'
  return `#${table}_${cell}#`
}

/** Print fill-down tag: #WorkHistory_c1# (1-based column index). */
export function templateColumnTagPreview(tableUniqueName: unknown, col: unknown): string {
  const table = sanitizeUniqueName(tableUniqueName) || 'DynamicColumnRow1'
  const colIndex = Number(col)
  const colNum = Number.isFinite(colIndex) ? colIndex + 1 : 1
  return `#${table}_c${colNum}#`
}

type FormLinkLike = {
  uniqueName?: unknown
  label?: unknown
  field_name?: unknown
} | null

/**
 * SubForm tag prefix: uniqueName, then Display Label, then field_name.
 * Empty means the table is on the master form (no prefix).
 */
export function subFormName(formLink: FormLinkLike): string {
  if (!formLink) {
    return ''
  }
  const fromUnique = sanitizeCellName(formLink.uniqueName)
  if (fromUnique) {
    return fromUnique
  }
  const fromLabel = sanitizeCellName(formLink.label)
  if (fromLabel) {
    return fromLabel
  }
  return sanitizeCellName(formLink.field_name)
}

/** #SubFormName_table_cN# when a SubForm prefix is present; otherwise #table_cN#. */
export function templateSubFormColumnTagPreview(
  formLink: FormLinkLike,
  tableUniqueName: unknown,
  col: unknown
): string {
  const columnTag = templateColumnTagPreview(tableUniqueName, col)
  const prefix = subFormName(formLink)
  if (!prefix) {
    return columnTag
  }
  const body = columnTag.slice(1, -1)
  if (body === prefix || body.startsWith(`${prefix}_`)) {
    return columnTag
  }
  return `#${prefix}_${body}#`
}
