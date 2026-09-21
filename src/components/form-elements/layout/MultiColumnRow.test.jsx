import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DynamicColumnRow, FourColumnRow, ThreeColumnRow, TwoColumnRow } from './MultiColumnRow'
import { getRowLabelColumnCssWidth } from '../../../utils/columnWidths'

const longLabel = 'Overtime Working Hours'
const shortLabel = 'Qty'

const buildData = (overrides = {}) => ({
  id: 'dcr-1',
  element: 'DynamicColumnRow',
  rows: 2,
  columns: [
    { key: 'c1', text: 'Column1', width: 1 },
    { key: 'c2', text: 'Column2', width: 1 },
    { key: 'c3', text: 'Column3', width: 1 },
  ],
  rowLabels: [
    { text: shortLabel, value: 'qty' },
    { text: longLabel, value: 'overtime' },
  ],
  childItems: [
    [null, null, null],
    [null, null, null],
  ],
  isContainer: true,
  ...overrides,
})

const emptyControls = [
  [<div key="r0c0" />, <div key="r0c1" />, <div key="r0c2" />],
  [<div key="r1c0" />, <div key="r1c1" />, <div key="r1c2" />],
]

describe('DynamicColumnRow layout', () => {
  it('sizes the row-label column to the longest row label name', () => {
    const data = buildData()
    const { container } = render(
      <DynamicColumnRow data={data} controls={emptyControls} mutable />
    )

    const expected = getRowLabelColumnCssWidth(data.rowLabels)
    const header = container.querySelector('.rfb-table-row-header-cell')
    const labels = container.querySelectorAll('.rfb-table-row-label')

    expect(header.style.width).toBe(expected)
    expect(header.style.minWidth).toBe(expected)
    expect(labels[0].style.width).toBe(expected)
    expect(labels[1].textContent).toContain(longLabel)
  })

  it('shows mouse resize handles in builder edit mode', () => {
    render(
      <DynamicColumnRow
        data={buildData()}
        controls={emptyControls}
        preview
        updateElement={() => {}}
      />
    )

    expect(screen.getAllByRole('button', { name: /Resize column/ })).toHaveLength(2)
    expect(screen.getByLabelText('Resize column 1')).toBeTruthy()
  })

  it('shows mouse resize handles when the builder passes editModeOn', () => {
    render(
      <DynamicColumnRow
        data={buildData()}
        controls={emptyControls}
        editModeOn={() => {}}
        updateElement={() => {}}
      />
    )

    expect(screen.getAllByRole('button', { name: /Resize column/ })).toHaveLength(2)
  })

  it('does not show resize handles when filling out the form', () => {
    render(<DynamicColumnRow data={buildData()} controls={emptyControls} mutable />)

    expect(screen.queryByRole('button', { name: /Resize column/ })).toBeNull()
  })

  it('persists column widths after a mouse drag in edit mode', () => {
    const updateElement = vi.fn()
    const data = buildData()
    const { container } = render(
      <DynamicColumnRow
        data={data}
        controls={emptyControls}
        preview
        updateElement={updateElement}
      />
    )

    const table = container.querySelector('.rfb-multicolumn-table')
    Object.defineProperty(table, 'clientWidth', { configurable: true, value: 600 })

    const handle = screen.getByLabelText('Resize column 1')
    fireEvent.pointerDown(handle, { clientX: 200 })
    fireEvent.pointerMove(window, { clientX: 280 })
    fireEvent.pointerUp(window)

    expect(updateElement).toHaveBeenCalledTimes(1)
    const updated = updateElement.mock.calls[0][0]
    expect(updated.columns[0].width).toBeGreaterThan(updated.columns[1].width)
    expect(updated.columns[2].width).toBe(1)
    expect(updated.dirty).toBe(true)
  })
})

const buildFixedRow = (element, columnCount) => ({
  id: `${element}-1`,
  element,
  childItems: [Array(columnCount).fill(null)],
  isContainer: true,
})

const fixedControls = (columnCount) => [
  Array.from({ length: columnCount }, (_, i) => <div key={`c${i}`} />),
]

describe('fixed column rows', () => {
  it.each([
    ['TwoColumnRow', TwoColumnRow, 2, 1],
    ['ThreeColumnRow', ThreeColumnRow, 3, 2],
    ['FourColumnRow', FourColumnRow, 4, 3],
  ])('shows mouse resize handles on %s in edit mode', (element, Component, columnCount, handleCount) => {
    render(
      <Component
        data={buildFixedRow(element, columnCount)}
        controls={fixedControls(columnCount)}
        preview
        updateElement={() => {}}
      />
    )

    expect(screen.getAllByRole('button', { name: /Resize column/ })).toHaveLength(handleCount)
  })

  it('does not show resize handles on TwoColumnRow when filling out the form', () => {
    render(
      <TwoColumnRow
        data={buildFixedRow('TwoColumnRow', 2)}
        controls={fixedControls(2)}
        mutable
      />
    )

    expect(screen.queryByRole('button', { name: /Resize column/ })).toBeNull()
  })

  it('persists TwoColumnRow colWidths after a mouse drag in edit mode', () => {
    const updateElement = vi.fn()
    const data = buildFixedRow('TwoColumnRow', 2)
    const { container } = render(
      <TwoColumnRow data={data} controls={fixedControls(2)} preview updateElement={updateElement} />
    )

    const table = container.querySelector('.rfb-multicolumn-table')
    Object.defineProperty(table, 'clientWidth', { configurable: true, value: 400 })

    fireEvent.pointerDown(screen.getByLabelText('Resize column 1'), { clientX: 200 })
    fireEvent.pointerMove(window, { clientX: 260 })
    fireEvent.pointerUp(window)

    expect(updateElement).toHaveBeenCalledTimes(1)
    const updated = updateElement.mock.calls[0][0]
    expect(updated.colWidths[0]).toBeGreaterThan(updated.colWidths[1])
    expect(updated.dirty).toBe(true)
  })
})
