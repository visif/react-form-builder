const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const {
  getParentElement,
  shouldHideColumnDisplayLabel,
} = require('../lib/form-elements/dynamic-column-display-label')

const child = (overrides = {}) => ({
  id: 'child-1',
  element: 'TextInput',
  parentId: 'dcr-1',
  row: 0,
  col: 0,
  label: 'Employee Name',
  ...overrides,
})

const lookup = (parent) => (id) => (id === parent.id ? parent : undefined)

describe('Dynamic Column Row display label', () => {
  it('hides the label by default when the parent DynamicColumnRow does not enable it', () => {
    const parent = { id: 'dcr-1', element: 'DynamicColumnRow' }
    const data = child()
    const parentElement = getParentElement({
      data,
      getDataById: lookup(parent),
    })

    assert.equal(shouldHideColumnDisplayLabel(data, parentElement), true)
  })

  it('shows the label when the parent DynamicColumnRow enables showDisplayLabel', () => {
    const parent = {
      id: 'dcr-1',
      element: 'DynamicColumnRow',
      showDisplayLabel: true,
    }
    const data = child()
    const parentElement = getParentElement({
      data,
      mutable: { getDataById: lookup(parent) },
    })

    assert.equal(shouldHideColumnDisplayLabel(data, parentElement), false)
  })

  it('overrides the automatic hideLabel flag when the row enables showDisplayLabel', () => {
    const parent = {
      id: 'dcr-1',
      element: 'DynamicColumnRow',
      showDisplayLabel: true,
    }
    const data = child({ hideLabel: true })
    const parentElement = getParentElement({
      data,
      getDataById: lookup(parent),
    })

    assert.equal(shouldHideColumnDisplayLabel(data, parentElement), false)
  })

  it('still hides the label when the element itself disables it', () => {
    const parent = {
      id: 'dcr-1',
      element: 'DynamicColumnRow',
      showDisplayLabel: true,
    }
    const data = child({ isShowLabel: false })
    const parentElement = getParentElement({
      data,
      getDataById: lookup(parent),
    })

    assert.equal(shouldHideColumnDisplayLabel(data, parentElement), true)
  })

  it('keeps showing the label when the element opts in via displayLabelInColumn', () => {
    const parent = { id: 'dcr-1', element: 'DynamicColumnRow' }
    const data = child({ displayLabelInColumn: true })
    const parentElement = getParentElement({
      data,
      getDataById: lookup(parent),
    })

    assert.equal(shouldHideColumnDisplayLabel(data, parentElement), false)
  })
})
