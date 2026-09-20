import React from 'react'
import { render, screen } from '@testing-library/react'
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
})
