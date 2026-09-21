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

export const getRelativeColumnWidths = (columns?: ColumnWidthSource[] | null): number[] =>
  (columns || []).map((column) => {
    const width = Number(column?.width)
    return Number.isFinite(width) && width > 0 ? width : 1
  })

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
