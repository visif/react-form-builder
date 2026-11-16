import { describe, expect, it } from 'vitest'

import {
  buildSwitchedChoiceElement,
  getOppositeChoiceElementType,
  isSwitchableChoiceElement,
  resolveChoiceElementTitle,
} from './switchChoiceElementType'

describe('switchChoiceElementType', () => {
  it('identifies only Checkboxes and RadioButtons as switchable', () => {
    expect(isSwitchableChoiceElement('Checkboxes')).toBe(true)
    expect(isSwitchableChoiceElement('RadioButtons')).toBe(true)
    expect(isSwitchableChoiceElement('Dropdown')).toBe(false)
    expect(isSwitchableChoiceElement('TextInput')).toBe(false)
    expect(getOppositeChoiceElementType('Checkboxes')).toBe('RadioButtons')
    expect(getOppositeChoiceElementType('RadioButtons')).toBe('Checkboxes')
    expect(getOppositeChoiceElementType('Dropdown')).toBeNull()
  })

  it('converts Checkboxes to RadioButtons while preserving id, placement, options, and clamping multi-selection', () => {
    const current = {
      id: 'chk-1',
      element: 'Checkboxes',
      text: 'Checkboxes',
      field_name: 'checkboxes_abc',
      label: '<p>Incident Type</p>',
      required: true,
      inline: true,
      parentId: 'row-1',
      row: 0,
      col: 1,
      value: [
        { key: 'o1', value: '1', info: '' },
        { key: 'o2', value: '2', info: '' },
      ],
      options: [
        { key: 'o1', text: 'OPD', value: '1', checked: true, selected: true, info: true },
        { key: 'o2', text: 'IPD', value: '2', checked: true, selected: true },
      ],
    }

    const switched = buildSwitchedChoiceElement(current, current)
    expect(switched.id).toBe('chk-1')
    expect(switched.element).toBe('RadioButtons')
    expect(switched.text).toBe('Multiple Choice')
    expect(switched.field_name).toBe('checkboxes_abc')
    expect(switched.label).toBe('<p>Incident Type</p>')
    expect(switched.required).toBe(true)
    expect(switched.inline).toBe(true)
    expect(switched.parentId).toBe('row-1')
    expect(switched.col).toBe(1)
    expect(switched.formularKey).toBe('')
    expect(switched.value).toHaveLength(1)
    expect(switched.options).toEqual([
      { key: 'o1', text: 'OPD', value: '1', checked: true, selected: true, info: true },
      { key: 'o2', text: 'IPD', value: '2', checked: false, selected: false },
    ])
  })

  it('converts RadioButtons back to Checkboxes and uses localized toolbar titles when provided', () => {
    const toolbarItems = [
      { key: 'Checkboxes', name: 'หลายตัวเลือก' },
      { key: 'RadioButtons', name: 'เลือกตัวเลือกเดียว' },
    ]
    expect(resolveChoiceElementTitle('Checkboxes', toolbarItems)).toBe('หลายตัวเลือก')
    expect(resolveChoiceElementTitle('RadioButtons', toolbarItems)).toBe('เลือกตัวเลือกเดียว')

    const current = {
      id: 'rad-1',
      element: 'RadioButtons',
      text: 'เลือกตัวเลือกเดียว',
      field_name: 'radiobuttons_xyz',
      label: '<p>Severity</p>',
      formularKey: '',
      options: [{ key: 'a', text: 'Level A', value: 'A' }],
    }
    const liveWithAddedOption = {
      ...current,
      options: [
        { key: 'a', text: 'Level A', value: 'A' },
        { key: 'b', text: 'Level B', value: 'B' },
      ],
    }

    const switched = buildSwitchedChoiceElement(current, liveWithAddedOption, toolbarItems)
    expect(switched.element).toBe('Checkboxes')
    expect(switched.text).toBe('หลายตัวเลือก')
    expect(switched.label).toBe('<p>Severity</p>')
    expect('formularKey' in switched).toBe(false)
    expect(switched.options.map((o) => o.text)).toEqual(['Level A', 'Level B'])
  })
})
