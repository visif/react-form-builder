const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const names = require('../lib/dynamic-column-row-names')

describe('dynamic-column-row-names', () => {
  it('sanitizes html, hash, and spaces', () => {
    assert.equal(names.sanitizeUniqueName('<p>Table #1 name</p>'), 'Table_1_name')
  })

  it('sanitizes cell names while keeping Thai and other letters', () => {
    assert.equal(names.sanitizeCellName('<p>จำนวน #1</p>'), 'จำนวน_1')
    assert.equal(names.sanitizeCellName('qty rate'), 'qty_rate')
    assert.equal(names.sanitizeCellName('###'), '')
  })

  it('builds default cell names from 0-based coordinates', () => {
    assert.equal(names.defaultCellName(0, 0), 'r1c1')
    assert.equal(names.defaultCellName(1, 2), 'r2c3')
  })

  it('allocates the next unused DynamicColumnRow unique name', () => {
    const data = [
      { element: 'DynamicColumnRow', uniqueName: 'DynamicColumnRow1' },
      { element: 'TextInput', uniqueName: 'DynamicColumnRow2' },
    ]
    assert.equal(names.nextDynamicColumnRowUniqueName(data), 'DynamicColumnRow2')
  })

  it('detects a duplicate table unique name', () => {
    const data = [
      { id: 'a', element: 'DynamicColumnRow', uniqueName: 'Inspection' },
      { id: 'b', element: 'DynamicColumnRow', uniqueName: 'Inspection' },
    ]
    assert.equal(names.isUniqueNameTaken(data, 'Inspection', 'a'), true)
    assert.equal(names.isUniqueNameTaken(data, 'Inspection', 'b'), true)
    assert.equal(names.isUniqueNameTaken(data, 'Other', 'a'), false)
  })

  it('detects a duplicate cell name within the same table only', () => {
    const data = [
      {
        id: 'c1',
        parentId: 't1',
        cellName: 'จำนวน',
        row: 0,
        col: 0,
      },
      {
        id: 'c2',
        parentId: 't1',
        cellName: 'จำนวน',
        row: 0,
        col: 1,
      },
      {
        id: 'c3',
        parentId: 't2',
        cellName: 'จำนวน',
        row: 0,
        col: 0,
      },
      {
        id: 'c4',
        parentId: 't1',
        cellName: null,
        row: 1,
        col: 0,
      },
    ]
    assert.equal(names.isCellNameTaken(data, 't1', 'จำนวน', 'c1'), true)
    assert.equal(names.isCellNameTaken(data, 't1', 'จำนวน', 'c2'), true)
    assert.equal(names.isCellNameTaken(data, 't2', 'จำนวน', 'c3'), false)
    assert.equal(names.isCellNameTaken(data, 't1', 'r2c1', 'c2'), true)
    assert.equal(names.isCellNameTaken(data, 't1', 'qty', 'c1'), false)
  })

  it('previews a template tag', () => {
    assert.equal(names.templateTagPreview('Inspection', 'qty'), '#Inspection_qty#')
    assert.equal(names.templateTagPreview('Inspection', 'จำนวน'), '#Inspection_จำนวน#')
  })

  it('refreshes auto cell names after a swap and keeps custom names', () => {
    const moving = { cellName: 'r1c1', cellNameCustom: false }
    const displaced = { cellName: 'qty', cellNameCustom: true }
    names.applyAutoCellNamesAfterSwap(moving, 0, 1, displaced, 0, 0)
    assert.equal(moving.cellName, 'r1c2')
    assert.equal(moving.cellNameCustom, false)
    assert.equal(displaced.cellName, 'qty')
    assert.equal(displaced.cellNameCustom, true)
  })

  it('assigns a coordinate name when the cell has no custom name', () => {
    const child = { cellName: 'r1c1', cellNameCustom: false }
    names.applyAutoCellName(child, 2, 0)
    assert.equal(child.cellName, 'r3c1')
  })
})
