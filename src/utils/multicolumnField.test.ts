import { describe, expect, it } from 'vitest'

import {
  getPickerPopupContainer,
  isInteractiveMulticolumnField,
  isMulticolumnChild,
} from './multicolumnField'

describe('multicolumnField', () => {
  describe('isMulticolumnChild', () => {
    it('returns true when parentId, row, and col are set', () => {
      expect(isMulticolumnChild({ parentId: 'p1', row: 0, col: 1 })).toBe(true)
    })

    it('returns false when any multicolumn marker is missing', () => {
      expect(isMulticolumnChild({ parentId: 'p1', row: 0 })).toBe(false)
      expect(isMulticolumnChild({ row: 0, col: 1 })).toBe(false)
      expect(isMulticolumnChild(null)).toBe(false)
    })
  })

  describe('isInteractiveMulticolumnField', () => {
    it('returns true for interactive field types', () => {
      expect(isInteractiveMulticolumnField('DatePicker')).toBe(true)
      expect(isInteractiveMulticolumnField('Dropdown')).toBe(true)
    })

    it('returns false for non-interactive field types', () => {
      expect(isInteractiveMulticolumnField('TextInput')).toBe(false)
      expect(isInteractiveMulticolumnField('Header')).toBe(false)
    })
  })

  describe('getPickerPopupContainer', () => {
    it('returns document.body', () => {
      expect(getPickerPopupContainer()).toBe(document.body)
    })
  })
})
