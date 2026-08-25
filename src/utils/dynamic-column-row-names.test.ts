import { describe, expect, it } from 'vitest'

import {
  applyAutoCellName,
  applyAutoCellNamesAfterSwap,
  defaultCellName,
  isCellNameTaken,
  isUniqueNameTaken,
  nextDynamicColumnRowUniqueName,
  sanitizeCellName,
  sanitizeUniqueName,
  templateTagPreview,
} from './dynamic-column-row-names'

describe('dynamic-column-row-names', () => {
  it('sanitizes html, hash, and spaces', () => {
    expect(sanitizeUniqueName('<p>Table #1 name</p>')).toBe('Table_1_name')
  })

  it('sanitizes cell names while keeping Thai and other letters', () => {
    expect(sanitizeCellName('<p>จำนวน #1</p>')).toBe('จำนวน_1')
    expect(sanitizeCellName('qty rate')).toBe('qty_rate')
    expect(sanitizeCellName('###')).toBe('')
  })

  it('builds default cell names from 0-based coordinates', () => {
    expect(defaultCellName(0, 0)).toBe('r1c1')
    expect(defaultCellName(1, 2)).toBe('r2c3')
  })

  it('allocates the next unused DynamicColumnRow unique name', () => {
    const data = [
      { element: 'DynamicColumnRow', uniqueName: 'DynamicColumnRow1' },
      { element: 'TextInput', uniqueName: 'DynamicColumnRow2' },
    ]
    expect(nextDynamicColumnRowUniqueName(data)).toBe('DynamicColumnRow2')
  })

  it('detects a duplicate table unique name', () => {
    const data = [
      { id: 'a', element: 'DynamicColumnRow', uniqueName: 'Inspection' },
      { id: 'b', element: 'DynamicColumnRow', uniqueName: 'Inspection' },
    ]
    expect(isUniqueNameTaken(data, 'Inspection', 'a')).toBe(true)
    expect(isUniqueNameTaken(data, 'Inspection', 'b')).toBe(true)
    expect(isUniqueNameTaken(data, 'Other', 'a')).toBe(false)
  })

  it('detects a duplicate cell name within the same table only', () => {
    const data = [
      { id: 'c1', parentId: 't1', cellName: 'จำนวน', row: 0, col: 0 },
      { id: 'c2', parentId: 't1', cellName: 'จำนวน', row: 0, col: 1 },
      { id: 'c3', parentId: 't2', cellName: 'จำนวน', row: 0, col: 0 },
      { id: 'c4', parentId: 't1', cellName: null, row: 1, col: 0 },
    ]
    expect(isCellNameTaken(data, 't1', 'จำนวน', 'c1')).toBe(true)
    expect(isCellNameTaken(data, 't1', 'จำนวน', 'c2')).toBe(true)
    expect(isCellNameTaken(data, 't2', 'จำนวน', 'c3')).toBe(false)
    expect(isCellNameTaken(data, 't1', 'r2c1', 'c2')).toBe(true)
    expect(isCellNameTaken(data, 't1', 'qty', 'c1')).toBe(false)
  })

  it('previews a template tag', () => {
    expect(templateTagPreview('Inspection', 'qty')).toBe('#Inspection_qty#')
    expect(templateTagPreview('Inspection', 'จำนวน')).toBe('#Inspection_จำนวน#')
  })

  it('refreshes auto cell names after a swap and keeps custom names', () => {
    const moving = { cellName: 'r1c1', cellNameCustom: false }
    const displaced = { cellName: 'qty', cellNameCustom: true }
    applyAutoCellNamesAfterSwap(moving, 0, 1, displaced, 0, 0)
    expect(moving.cellName).toBe('r1c2')
    expect(moving.cellNameCustom).toBe(false)
    expect(displaced.cellName).toBe('qty')
    expect(displaced.cellNameCustom).toBe(true)
  })

  it('assigns a coordinate name when the cell has no custom name', () => {
    const child = { cellName: 'r1c1', cellNameCustom: false }
    applyAutoCellName(child, 2, 0)
    expect(child.cellName).toBe('r3c1')
  })
})
