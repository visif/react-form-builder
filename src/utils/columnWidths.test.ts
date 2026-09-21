import { describe, expect, it } from 'vitest'

import {
  getMaxRowLabelTextLength,
  getRelativeColumnWidths,
  getRowLabelColumnCssWidth,
  resizeAdjacentColumnWidths,
  roundRelativeWidth,
  ROW_LABEL_HORIZONTAL_PADDING_PX,
} from './columnWidths'

describe('columnWidths', () => {
  describe('getMaxRowLabelTextLength', () => {
    it('uses the longest visible row-label name', () => {
      expect(
        getMaxRowLabelTextLength([
          { text: 'A' },
          { text: 'Very Long Row Label Name' },
          { text: 'Mid' },
        ])
      ).toBe('Very Long Row Label Name'.length)
    })

    it('strips HTML before measuring', () => {
      expect(
        getMaxRowLabelTextLength([{ text: '<p><strong>Hours</strong></p>' }, { text: 'Qty' }])
      ).toBe('Hours'.length)
    })

    it('returns 0 when there are no labels', () => {
      expect(getMaxRowLabelTextLength([])).toBe(0)
      expect(getMaxRowLabelTextLength(null)).toBe(0)
    })
  })

  describe('getRowLabelColumnCssWidth', () => {
    it('fits the longest label with cell padding', () => {
      const labels = [{ text: 'Short' }, { text: 'LongestLabel' }]
      expect(getRowLabelColumnCssWidth(labels)).toBe(
        `calc(${'LongestLabel'.length}ch + ${ROW_LABEL_HORIZONTAL_PADDING_PX}px)`
      )
    })
  })

  describe('getRelativeColumnWidths', () => {
    it('falls back to 1 for missing or invalid widths', () => {
      expect(getRelativeColumnWidths([{ width: 2 }, { width: '0' }, {}, { width: '3' }])).toEqual([
        2, 1, 1, 3,
      ])
    })

    it('uses colWidths when columns are not defined', () => {
      expect(getRelativeColumnWidths(undefined, [1.5, 0.5], 2)).toEqual([1.5, 0.5])
    })

    it('pads equal widths when only a column count is known', () => {
      expect(getRelativeColumnWidths(undefined, undefined, 3)).toEqual([1, 1, 1])
    })
  })

  describe('resizeAdjacentColumnWidths', () => {
    it('moves width from the right column to the left when dragging right', () => {
      expect(resizeAdjacentColumnWidths([1, 1, 1], 0, 0.4)).toEqual([1.4, 0.6, 1])
    })

    it('does not shrink a column below the minimum', () => {
      const [left, right] = resizeAdjacentColumnWidths([1, 1], 0, 5, 0.2)
      expect(left).toBeCloseTo(1.8)
      expect(right).toBe(0.2)
    })

    it('is a no-op for the last column', () => {
      expect(resizeAdjacentColumnWidths([1, 1], 1, 0.5)).toEqual([1, 1])
    })
  })

  describe('roundRelativeWidth', () => {
    it('rounds to two decimal places', () => {
      expect(roundRelativeWidth(1.234)).toBe(1.23)
      expect(roundRelativeWidth(0.2)).toBe(0.2)
    })
  })
})
