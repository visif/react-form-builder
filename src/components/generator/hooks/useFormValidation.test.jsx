import React from 'react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FormProvider } from '../../../contexts/FormContext'
import { resolveActiveCollectedItems, useFormValidation } from './useFormValidation'

const createWrapper = (initialValues = {}) => {
  const Wrapper = ({ children }) => (
    <FormProvider initialValues={initialValues}>{children}</FormProvider>
  )
  return Wrapper
}

describe('useFormValidation', () => {
  const baseHookArgs = [{ data: [] }, () => []]

  it('marks empty required text fields as invalid', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ name_field: '' }),
    })

    expect(
      result.current.isInvalid({
        required: true,
        field_name: 'name_field',
        element: 'TextInput',
      })
    ).toBe(true)
  })

  it('accepts populated required text fields', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ name_field: 'Ada' }),
    })

    expect(
      result.current.isInvalid({
        required: true,
        field_name: 'name_field',
        element: 'TextInput',
      })
    ).toBe(false)
  })

  it('marks empty required checkbox groups as invalid', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ choices: [] }),
    })

    expect(
      result.current.isInvalid({
        required: true,
        field_name: 'choices',
        element: 'Checkboxes',
      })
    ).toBe(true)
  })

  it('does not require a read-only field from a previous section', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ previous_field: '' }),
    })

    expect(
      result.current.isInvalid({
        required: true,
        readOnly: true,
        field_name: 'previous_field',
        element: 'TextInput',
      })
    ).toBe(false)
  })

  it('ignores optional fields', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ optional_field: '' }),
    })

    expect(
      result.current.isInvalid({
        required: false,
        field_name: 'optional_field',
        element: 'TextInput',
      })
    ).toBe(false)
  })

  it('checks correctness from FormContext values', () => {
    const { result } = renderHook(() => useFormValidation(...baseHookArgs), {
      wrapper: createWrapper({ answer_field: 'wrong' }),
    })

    expect(
      result.current.isIncorrect({
        canHaveAnswer: true,
        field_name: 'answer_field',
        element: 'TextInput',
        correct: 'right',
      })
    ).toBe(true)

    expect(
      result.current.isIncorrect({
        canHaveAnswer: true,
        field_name: 'answer_field',
        element: 'TextInput',
        correct: 'wrong',
      })
    ).toBe(false)
  })
})

describe('resolveActiveCollectedItems', () => {
  const items = [
    { id: 's1', element: 'Section' },
    { id: 'creative', element: 'TextInput', value: 'done' },
    { id: 's2', element: 'Section' },
    { id: 'manager', element: 'RadioButtons', value: [{ key: 'approve' }] },
    { id: 's3', element: 'Section' },
    { id: 'later', element: 'TextInput', value: '' },
  ]
  const dataById = new Map([
    ['creative', { id: 'creative', readOnly: true, required: true }],
    ['manager', { id: 'manager', required: true }],
    ['later', { id: 'later', readOnly: true, required: true }],
  ])

  it('validates only the current filled section, not the previous one', () => {
    const active = resolveActiveCollectedItems(items, dataById)
    expect(active.map((item) => item.id)).toEqual(['manager'])
  })

  it('checks required fields only in sections the user filled when the description matches none', () => {
    const items = [
      { id: 's1', element: 'Section' },
      { id: 'qa', element: 'TextInput', value: 'checked' },
      { id: 'qa_required', element: 'TextInput', value: '' },
      { id: 's2', element: 'Section' },
      { id: 'md', element: 'RadioButtons', value: [] },
      { id: 'md_sign', element: 'Signature2', value: { isSigned: false } },
    ]
    const dataById = new Map([
      ['qa', { id: 'qa', field_name: 'qa_note' }],
      ['qa_required', { id: 'qa_required', field_name: 'qa_required', required: true }],
      ['md', { id: 'md', field_name: 'md_decision', required: true }],
      ['md_sign', { id: 'md_sign', field_name: 'md_sign', required: true }],
    ])
    const active = resolveActiveCollectedItems(items, dataById, {
      filledSectionOnly: true,
      originalValues: { qa_note: '', qa_required: '', md_decision: [], md_sign: { isSigned: false } },
    })
    expect(active.map((item) => item.id)).toEqual(['qa', 'qa_required'])
  })

  it('does not require other sections when the user has not filled one in', () => {
    const items = [
      { id: 's1', element: 'Section' },
      { id: 'qa', element: 'TextInput', value: '' },
      { id: 's2', element: 'Section' },
      { id: 'md', element: 'RadioButtons', value: [] },
    ]
    const dataById = new Map([
      ['qa', { id: 'qa', field_name: 'qa_note', required: true }],
      ['md', { id: 'md', field_name: 'md_decision', required: true }],
    ])
    const active = resolveActiveCollectedItems(items, dataById, {
      filledSectionOnly: true,
      originalValues: {},
    })
    expect(active).toEqual([])
  })

  it('ignores a section whose saved answers did not change', () => {
    const items = [
      { id: 's1', element: 'Section' },
      { id: 'qa', element: 'TextInput', value: 'already' },
      { id: 's2', element: 'Section' },
      { id: 'md', element: 'TextInput', value: '' },
    ]
    const dataById = new Map([
      ['qa', { id: 'qa', field_name: 'qa_note', required: true }],
      ['md', { id: 'md', field_name: 'md_decision', required: true }],
    ])
    const active = resolveActiveCollectedItems(items, dataById, {
      filledSectionOnly: true,
      originalValues: { qa_note: 'already' },
    })
    expect(active).toEqual([])
  })

  it('ignores a filled previous section when those fields are read-only', () => {
    const onlyPreviousFilled = [
      { id: 's1', element: 'Section' },
      { id: 'creative', element: 'TextInput', value: 'from sibling' },
      { id: 's2', element: 'Section' },
      { id: 'manager', element: 'RadioButtons', value: [] },
    ]
    const active = resolveActiveCollectedItems(onlyPreviousFilled, dataById)
    expect(active.map((item) => item.id)).toEqual(['manager'])
  })
})
