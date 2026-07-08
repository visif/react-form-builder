import React from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getSimpleElement, renderFormElement } from './formElementRenderer'

describe('formElementRenderer', () => {
  it('returns null when item is missing', () => {
    expect(renderFormElement(null, {}, {}, {})).toBeNull()
  })

  it('renders simple display elements', () => {
    const item = {
      id: 'header-1',
      element: 'Header',
      text: 'Section title',
    }

    const { container } = render(getSimpleElement(item))
    expect(container.querySelector('.rfb-item')).toBeTruthy()
  })

  it('routes TextInput through the input element path', () => {
    const item = {
      id: 'text-1',
      element: 'TextInput',
      field_name: 'text_field',
      label: 'Name',
    }

    const element = renderFormElement(
      item,
      { read_only: false },
      {},
      {
        handleChange: () => {},
        getDefaultValue: () => '',
        getEditor: () => true,
        optionsDefaultValue: () => [],
        getDataById: () => null,
        formContext: { getAllVariables: () => ({}) },
      }
    )

    const { container } = render(element)
    expect(container.querySelector('input')).toBeTruthy()
  })
})
