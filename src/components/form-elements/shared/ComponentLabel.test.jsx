import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ComponentLabel from './ComponentLabel'

const buildChild = (overrides = {}) => ({
  id: 'child-1',
  element: 'TextInput',
  parentId: 'dcr-1',
  row: 0,
  col: 0,
  label: 'Employee Name',
  ...overrides,
})

const buildMutable = (parent) => ({
  getDataById: (id) => (id === parent.id ? parent : undefined),
})

describe('ComponentLabel in DynamicColumnRow', () => {
  it('hides the label by default when the parent DynamicColumnRow does not enable it', () => {
    const parent = { id: 'dcr-1', element: 'DynamicColumnRow' }
    const child = buildChild()

    const { container } = render(
      <ComponentLabel data={child} mutable={buildMutable(parent)} />
    )

    expect(screen.queryByText('Employee Name')).toBeNull()
    expect(container.textContent).toBe('')
  })

  it('shows the label when the parent DynamicColumnRow enables showDisplayLabel', () => {
    const parent = { id: 'dcr-1', element: 'DynamicColumnRow', showDisplayLabel: true }
    const child = buildChild()

    render(<ComponentLabel data={child} mutable={buildMutable(parent)} />)

    expect(screen.getByText('Employee Name')).toBeTruthy()
  })

  it('overrides the automatic hideLabel flag when the row enables showDisplayLabel', () => {
    const parent = { id: 'dcr-1', element: 'DynamicColumnRow', showDisplayLabel: true }
    const child = buildChild({ hideLabel: true })

    render(<ComponentLabel data={child} mutable={buildMutable(parent)} />)

    expect(screen.getByText('Employee Name')).toBeTruthy()
  })

  it('still hides the label when the element itself disables it', () => {
    const parent = { id: 'dcr-1', element: 'DynamicColumnRow', showDisplayLabel: true }
    const child = buildChild({ isShowLabel: false })

    const { container } = render(
      <ComponentLabel data={child} mutable={buildMutable(parent)} />
    )

    expect(screen.queryByText('Employee Name')).toBeNull()
    expect(container.textContent).toBe('')
  })

  it('keeps showing the label when the element opts in via displayLabelInColumn', () => {
    const parent = { id: 'dcr-1', element: 'DynamicColumnRow' }
    const child = buildChild({ displayLabelInColumn: true })

    render(<ComponentLabel data={child} mutable={buildMutable(parent)} />)

    expect(screen.getByText('Employee Name')).toBeTruthy()
  })

  it('resolves the parent via a direct getDataById prop (builder preview shape)', () => {
    const parent = { id: 'dcr-1', element: 'DynamicColumnRow', showDisplayLabel: true }
    const child = buildChild({ hideLabel: true })

    render(
      <ComponentLabel data={child} mutable getDataById={(id) => (id === parent.id ? parent : undefined)} />
    )

    expect(screen.getByText('Employee Name')).toBeTruthy()
  })

  it('hides the label via direct getDataById prop when the row does not enable it', () => {
    const parent = { id: 'dcr-1', element: 'DynamicColumnRow' }
    const child = buildChild({ hideLabel: true })

    const { container } = render(
      <ComponentLabel data={child} mutable getDataById={(id) => (id === parent.id ? parent : undefined)} />
    )

    expect(screen.queryByText('Employee Name')).toBeNull()
    expect(container.textContent).toBe('')
  })
})
