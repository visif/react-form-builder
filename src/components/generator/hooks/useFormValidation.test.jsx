import React from 'react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FormProvider } from '../../../contexts/FormContext'
import { useFormValidation } from './useFormValidation'

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

  it('skips required fields in an empty section even when a field before it has a value', () => {
    const data = [
      { id: 'dd1', element: 'Dropdown', field_name: 'dropdown', label: 'Outside Label' },
      { id: 'sec1', element: 'Section', header: 'Placeholder Text' },
      {
        id: 'radio1',
        element: 'RadioButtons',
        field_name: 'radio',
        label: 'Placeholder Label',
        required: true,
      },
      {
        id: 'sig1',
        element: 'Signature2',
        field_name: 'sig',
        label: 'Placeholder Text',
        required: true,
      },
    ]
    const collectFormItems = () => [
      { id: 'dd1', element: 'Dropdown', value: 'option1' },
      { id: 'sec1', element: 'Section', value: null },
      { id: 'radio1', element: 'RadioButtons', value: [] },
      { id: 'sig1', element: 'Signature2', value: { isSigned: false } },
    ]

    const { result } = renderHook(() => useFormValidation({ data }, collectFormItems), {
      wrapper: createWrapper({
        dropdown: 'option1',
        radio: [],
        sig: { isSigned: false },
      }),
    })

    expect(result.current.validateForm()).toEqual([])
  })

  it('validates required fields once any input in that section is filled', () => {
    const data = [
      { id: 'sec1', element: 'Section', header: 'Placeholder Text' },
      {
        id: 'radio1',
        element: 'RadioButtons',
        field_name: 'radio',
        label: 'Placeholder Label',
        required: true,
      },
      {
        id: 'sig1',
        element: 'Signature2',
        field_name: 'sig',
        label: 'Placeholder Text',
        required: true,
      },
    ]
    const collectFormItems = () => [
      { id: 'sec1', element: 'Section', value: null },
      { id: 'radio1', element: 'RadioButtons', value: [{ key: 'opt1', value: 'Place holder option 1' }] },
      { id: 'sig1', element: 'Signature2', value: { isSigned: false } },
    ]

    const { result } = renderHook(() => useFormValidation({ data }, collectFormItems), {
      wrapper: createWrapper({
        radio: [{ key: 'opt1', value: 'Place holder option 1' }],
        sig: { isSigned: false },
      }),
    })

    expect(result.current.validateForm()).toEqual(['Placeholder Text is required!'])
  })

  it('does not treat an unsigned signature as filling the section', () => {
    const data = [
      { id: 'sec1', element: 'Section', header: 'Section' },
      {
        id: 'sig1',
        element: 'Signature2',
        field_name: 'sig',
        label: 'Placeholder Text',
        required: true,
      },
    ]
    const collectFormItems = () => [
      { id: 'sec1', element: 'Section', value: null },
      { id: 'sig1', element: 'Signature2', value: { isSigned: false } },
    ]

    const { result } = renderHook(() => useFormValidation({ data }, collectFormItems), {
      wrapper: createWrapper({
        sig: { isSigned: false },
      }),
    })

    expect(result.current.validateForm()).toEqual([])
  })
})
