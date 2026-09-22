import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Dropdown, { filterDropdownOption } from './Dropdown'

if (typeof window.ResizeObserver !== 'function') {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      addEventListener: () => {},
      removeListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

const dropdownData = {
  field_name: 'dropdown_1',
  isShowLabel: true,
  label: 'Country',
  options: [
    { value: 'th', text: 'Thailand' },
    { value: 'vn', text: 'Vietnam' },
    { value: 'sg', text: 'Singapore' },
  ],
}

describe('filterDropdownOption', () => {
  it('matches option labels case-insensitively', () => {
    expect(filterDropdownOption('thai', { value: 'th', label: 'Thailand' })).toBe(true)
    expect(filterDropdownOption('VIET', { value: 'vn', label: 'Vietnam' })).toBe(true)
    expect(filterDropdownOption('japan', { value: 'th', label: 'Thailand' })).toBe(false)
  })

  it('matches option values and ignores surrounding spaces', () => {
    expect(filterDropdownOption('  SG  ', { value: 'sg', label: 'Singapore' })).toBe(true)
    expect(filterDropdownOption('', { value: 'th', label: 'Thailand' })).toBe(true)
  })
})

describe('Dropdown', () => {
  it('renders a searchable combobox for online form fill', () => {
    render(<Dropdown mutable data={dropdownData} defaultValue="" />)

    const combobox = screen.getByRole('combobox')
    expect(combobox).toBeTruthy()
    expect(combobox).not.toHaveAttribute('readonly')
    expect(combobox.closest('.rfb-dropdown-select')).toBeTruthy()
  })

  it('hides the current selection and placeholder while typing', () => {
    render(<Dropdown mutable data={dropdownData} defaultValue="th" />)

    const combobox = screen.getByRole('combobox')
    fireEvent.change(combobox, { target: { value: 'viet' } })

    const select = combobox.closest('.rfb-dropdown-select')
    expect(select).toHaveClass('rfb-dropdown-searching')
    expect(combobox).toHaveValue('viet')
    expect(select.querySelector('.ant-select-selection-placeholder')).toBeNull()
  })

  it('allows clearing the selected value with backspace', () => {
    render(<Dropdown mutable data={dropdownData} defaultValue="th" />)

    const combobox = screen.getByRole('combobox')
    fireEvent.keyDown(combobox, { key: 'Backspace' })

    expect(combobox.closest('.ant-select')).not.toHaveClass('ant-select-disabled')
    expect(screen.getByText('Please Select')).toBeTruthy()
  })
})
