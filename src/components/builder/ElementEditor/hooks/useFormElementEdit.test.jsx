import React from 'react'
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import FormElementsEdit from '../FormElementsEdit'
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

  it('switches between Checkboxes and Multiple Choice and vice versa in FormElementsEdit', () => {
    const element = {
      id: 'choice-1',
      element: 'Checkboxes',
      text: 'Checkboxes',
      field_name: 'checkboxes_1',
      label: 'Select options',
      canHaveAnswer: true,
      canHaveInfo: true,
      options: [
        { key: 'k1', text: 'Option A', value: '1' },
        { key: 'k2', text: 'Option B', value: '2' },
      ],
    }
    let liveData = [element]
    const updateElement = vi.fn((updated) => {
      liveData = [updated]
    })
    const preview = {
      getDataById: (id) => liveData.find((item) => item.id === id),
      state: { data: liveData },
      updateElement,
    }

    render(
      <FormElementsEdit
        element={element}
        preview={preview}
        updateElement={updateElement}
        manualEditModeOff={vi.fn()}
      />
    )

    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Checkboxes')
    const toggleBtn = screen.getByTestId('switch-choice-element-type')
    expect(toggleBtn.textContent).toContain('Change to Multiple Choice')

    fireEvent.click(toggleBtn)

    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Multiple Choice')
    expect(screen.getByTestId('switch-choice-element-type').textContent).toContain(
      'Change to Checkboxes'
    )
    expect(updateElement).toHaveBeenCalledTimes(1)
    expect(updateElement.mock.calls[0][0].element).toBe('RadioButtons')
    expect(updateElement.mock.calls[0][0].options).toHaveLength(2)

    fireEvent.click(screen.getByTestId('switch-choice-element-type'))

    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Checkboxes')
    expect(screen.getByTestId('switch-choice-element-type').textContent).toContain(
      'Change to Multiple Choice'
    )
    expect(updateElement).toHaveBeenCalledTimes(2)
    expect(updateElement.mock.calls[1][0].element).toBe('Checkboxes')
  })

  it('hides the choice-switch button for non-choice elements like Dropdown or TextInput', () => {
    const dropdown = {
      id: 'dd-1',
      element: 'Dropdown',
      text: 'Dropdown',
      field_name: 'dropdown_1',
      label: 'Department',
      options: [{ key: 'd1', text: 'QA', value: '1' }],
    }
    render(
      <FormElementsEdit
        element={dropdown}
        preview={{ state: { data: [dropdown] } }}
        updateElement={vi.fn()}
        manualEditModeOff={vi.fn()}
      />
    )
    expect(screen.queryByTestId('switch-choice-element-type')).toBeNull()
  })
})
