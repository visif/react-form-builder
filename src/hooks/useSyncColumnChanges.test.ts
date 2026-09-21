import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useSyncColumnChanges from './useSyncColumnChanges'

type Item = {
  id: string
  element: string
  required?: boolean
  readOnly?: boolean
  label?: string
  row: number
  col: number
  parentId: string
}

const buildColumn = () => {
  // Mirrors FormRevID 690: one DatePicker per row in the same synced column,
  // where only some rows had `required: true`.
  const items: Item[] = [
    { id: 'r1c3', element: 'DatePicker', required: true, row: 0, col: 2, parentId: 'dcr' },
    { id: 'r2c3', element: 'DatePicker', required: false, row: 1, col: 2, parentId: 'dcr' },
    { id: 'r3c3', element: 'DatePicker', required: true, row: 2, col: 2, parentId: 'dcr' },
  ]
  const childItems = [
    [null, null, 'r1c3'],
    [null, null, 'r2c3'],
    [null, null, 'r3c3'],
  ]
  const getDataById = (id: string) => items.find((x) => x.id === id)
  return { items, childItems, getDataById }
}

describe('useSyncColumnChanges', () => {
  it('propagates required to sibling rows for DatePicker cells', () => {
    const { childItems, getDataById } = buildColumn()
    const updateElement = vi.fn()

    const { result } = renderHook(() =>
      useSyncColumnChanges(childItems as never, getDataById as never, updateElement)
    )

    act(() => {
      result.current(0, 2, 'DatePicker', { required: false })
    })

    const updates = updateElement.mock.calls.map((call) => call[0])
    expect(updates).toHaveLength(2)
    expect(updates.map((u: Item) => u.id).sort()).toEqual(['r2c3', 'r3c3'])
    updates.forEach((u: Item) => expect(u.required).toBe(false))
  })

  it('propagates readOnly to sibling rows for TextInput cells', () => {
    const { childItems, getDataById } = buildColumn()
    const updateElement = vi.fn()

    const { result } = renderHook(() =>
      useSyncColumnChanges(childItems as never, getDataById as never, updateElement)
    )

    act(() => {
      result.current(0, 2, 'DatePicker', { readOnly: true })
    })

    const updates = updateElement.mock.calls.map((call) => call[0])
    updates.forEach((u: Item) => expect(u.readOnly).toBe(true))
  })

  it('does not clobber required when changeData lacks the property', () => {
    const { childItems, getDataById } = buildColumn()
    const updateElement = vi.fn()

    const { result } = renderHook(() =>
      useSyncColumnChanges(childItems as never, getDataById as never, updateElement)
    )

    act(() => {
      result.current(0, 2, 'DatePicker', { label: 'New label' })
    })

    const updates = updateElement.mock.calls.map((call) => call[0])
    // r2c3 keeps its own flag, r3c3 keeps its own flag
    expect(updates.find((u: Item) => u.id === 'r2c3').required).toBe(false)
    expect(updates.find((u: Item) => u.id === 'r3c3').required).toBe(true)
  })

  it('ignores unsupported element types', () => {
    const { childItems, getDataById } = buildColumn()
    const updateElement = vi.fn()

    const { result } = renderHook(() =>
      useSyncColumnChanges(childItems as never, getDataById as never, updateElement)
    )

    act(() => {
      result.current(0, 2, 'Header', { required: true })
    })

    expect(updateElement).not.toHaveBeenCalled()
  })
})
