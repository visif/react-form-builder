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
})
