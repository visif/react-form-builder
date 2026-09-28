export const MIN_ROW_LABEL_COLUMN_WIDTH_PX = 48
export const MIN_RELATIVE_COLUMN_WIDTH = 0.2
/** Share used when a Dynamic Column Row revision has no column width. */
export const DEFAULT_RELATIVE_COLUMN_WIDTH = 1

export type ColumnWidthSource = {
  width?: string | number | null
}

/** Saved caption width in pixels, or null when the column uses the default share of 1. */
export const toRowLabelWidthPx = (width: unknown): number | null => {
  const value = Number(width)
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(value)
}

/**
 * Keep a dragged caption column inside the table.
 * `maxWidth` is the widest the caption may grow while leaving room for the data columns.
 */
export const clampRowLabelColumnWidth = (
  width: number,
  maxWidth: number,
  minWidth = MIN_ROW_LABEL_COLUMN_WIDTH_PX
): number => {
  const max = Math.max(minWidth, maxWidth)
  return Math.min(max, Math.max(minWidth, width))
}

const toPositiveWidth = (width: unknown): number => {
  const value = Number(width)
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_RELATIVE_COLUMN_WIDTH
}

/**
 * Fill in column widths that a revision left blank.
 * Mutates each column in place so the designer, editor, and saved form share one value.
 */
export const applyDefaultColumnWidths = <T extends ColumnWidthSource>(
  columns?: T[] | null
): T[] => {
  if (!Array.isArray(columns)) return []
  columns.forEach((column) => {
    if (!column) return
    const value = Number(column.width)
    if (!Number.isFinite(value) || value <= 0) {
      column.width = DEFAULT_RELATIVE_COLUMN_WIDTH
    }
  })
  return columns
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
 * Percent of the table for each data column.
 * When the row-name column has no saved pixel width, it takes one share so its width
 * does not follow the longest row name.
 */
export const getTableColumnPercents = (
  relativeWidths: number[],
  includeDefaultRowLabel = false
): { columns: number[]; rowLabel: number | null } => {
  const labelUnits = includeDefaultRowLabel ? DEFAULT_RELATIVE_COLUMN_WIDTH : 0
  const total = relativeWidths.reduce((sum, width) => sum + width, 0) + labelUnits
  if (!total) {
    return {
      columns: relativeWidths.map(() => 0),
      rowLabel: includeDefaultRowLabel ? 0 : null,
    }
  }
  return {
    columns: relativeWidths.map((width) => (width / total) * 100),
    rowLabel: includeDefaultRowLabel ? (labelUnits / total) * 100 : null,
  }
}

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
