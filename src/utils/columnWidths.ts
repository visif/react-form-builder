export const ROW_LABEL_HORIZONTAL_PADDING_PX = 24
export const MIN_RELATIVE_COLUMN_WIDTH = 0.2

export type ColumnWidthSource = {
  width?: string | number | null
}

export type RowLabelSource = {
  text?: string | null
}

/** Plain text from a row-label / header that may contain HTML. */
export const stripHtmlToText = (html?: string | null): string =>
  `${html || ''}`
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()

/** Longest visible row-label name, after stripping HTML. */
export const getMaxRowLabelTextLength = (rowLabels?: RowLabelSource[] | null): number =>
  (rowLabels || []).reduce((max, label) => {
    const length = stripHtmlToText(label?.text).length
    return Math.max(max, length)
  }, 0)

/**
 * CSS width that fits the longest row-label name.
 * Uses `ch` so the column grows with character count, plus cell padding.
 */
export const getRowLabelColumnCssWidth = (rowLabels?: RowLabelSource[] | null): string => {
  const maxLen = getMaxRowLabelTextLength(rowLabels)
  return `calc(${maxLen}ch + ${ROW_LABEL_HORIZONTAL_PADDING_PX}px)`
}

const toPositiveWidth = (width: unknown): number => {
  const value = Number(width)
  return Number.isFinite(value) && value > 0 ? value : 1
}

/**
 * Relative column widths for layout and mouse-resize.
 * Prefers `columns[].width` (Dynamic Column Row), then `colWidths`
 * (Two/Three/Four Column Row), then equal widths.
 */
export const getRelativeColumnWidths = (
  columns?: ColumnWidthSource[] | null,
  colWidths?: Array<string | number> | null,
  columnCount = 0
): number[] => {
  if (columns && columns.length > 0) {
    return columns.map((column) => toPositiveWidth(column?.width))
  }
  if (colWidths && colWidths.length > 0) {
    const widths = colWidths.map(toPositiveWidth)
    const count = columnCount || widths.length
    if (count > widths.length) {
      return [...widths, ...Array(count - widths.length).fill(1)]
    }
    return widths.slice(0, count)
  }
  return Array(Math.max(columnCount, 0)).fill(1)
}

export const roundRelativeWidth = (width: number): number => Math.round(width * 100) / 100

/**
 * Drag the border between `leftIndex` and the next column.
 * Width is transferred between the two so the table stays 100% wide.
 */
export const resizeAdjacentColumnWidths = (
  widths: number[],
  leftIndex: number,
  deltaUnits: number,
  minWidth = MIN_RELATIVE_COLUMN_WIDTH
): number[] => {
  const rightIndex = leftIndex + 1
  if (leftIndex < 0 || rightIndex >= widths.length) {
    return [...widths]
  }

  const next = widths.map(Number)
  let left = next[leftIndex] + deltaUnits
  let right = next[rightIndex] - deltaUnits

  if (left < minWidth) {
    right -= minWidth - left
    left = minWidth
  }
  if (right < minWidth) {
    left -= minWidth - right
    right = minWidth
  }

  next[leftIndex] = left
  next[rightIndex] = right
  return next
}
