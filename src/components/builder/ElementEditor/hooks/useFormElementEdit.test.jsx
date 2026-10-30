import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useFormElementEdit } from './useFormElementEdit'

describe('useFormElementEdit updateElement', () => {
  it('writes edited table columns through to the parent element', () => {
    const element = {
      id: 'table-1',
      element: 'Table',
      label: 'Cost',
      columns: [{ key: 'c1', text: '<p>Time</p>', value: 'time', width: 1 }],
    }
    const updateElement = vi.fn()
    const { result } = renderHook(() =>
      useFormElementEdit({
        element,
        preview: { state: { data: [] } },
        updateElement,
      })
    )

    act(() => {
      result.current.updateElement({
        ...element,
        columns: [{ key: 'c1', text: '<p>Hours</p>', value: 'hours', width: 1 }],
      })
    })

    expect(updateElement).toHaveBeenCalled()
    const saved = updateElement.mock.calls.at(-1)[0]
    expect(saved.columns[0].text).toBe('<p>Hours</p>')
    expect(saved.label).toBe('Cost')
    expect(element.columns[0].text).toBe('<p>Hours</p>')
  })

  it('adopts the live cell name after the element moves inside a Dynamic Column Row', () => {
    const element = {
      id: 'sig',
      element: 'Signature2',
      parentId: 'table',
      row: 5,
      col: 2,
      cellName: 'r6c3',
      cellNameCustom: false,
    }
    const live = { ...element }
    const getDataById = (id) => (id === live.id ? live : null)
    const { result, rerender } = renderHook(
      ({ preview }) =>
        useFormElementEdit({
          element,
          preview,
          updateElement: vi.fn(),
        }),
      { initialProps: { preview: { getDataById, state: { data: [live] } } } }
    )

    expect(result.current.element.cellName).toBe('r6c3')

    act(() => {
      live.row = 1
      live.col = 2
      live.cellName = 'r2c3'
      live.cellNameCustom = false
    })
    rerender({ preview: { getDataById, state: { data: [live] } } })

    expect(result.current.element.cellName).toBe('r2c3')
    expect(result.current.element.row).toBe(1)
    expect(result.current.element.cellNameCustom).toBe(false)
  })
})
