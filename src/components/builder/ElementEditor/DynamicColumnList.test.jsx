import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-quill-new', () => {
  function ReactQuill({ value, onChange, onBlur, placeholder }) {
    return (
      <textarea
        aria-label={placeholder || 'column-header'}
        value={value || ''}
        onChange={(event) => onChange(event.target.value, {}, 'user')}
        onBlur={onBlur}
      />
    )
  }

  return {
    default: ReactQuill,
    Quill: {
      import: () => ({ whitelist: [] }),
      register: () => {},
    },
  }
})

vi.mock('react-quill-new/dist/quill.snow.css', () => ({}))

import DynamicColumnList from './DynamicColumnList'

describe('DynamicColumnList', () => {
  it('saves a column header as soon as the header text changes', () => {
    const element = {
      id: 'table-1',
      element: 'Table',
      columns: [
        {
          key: 'c1',
          text: '<p>Time</p>',
          value: 'time',
          width: 1,
          isSync: true,
          required: false,
        },
      ],
    }
    const updateElement = vi.fn()

    render(
      <DynamicColumnList element={element} updateElement={updateElement} preview={{}} />
    )

    fireEvent.change(screen.getByLabelText('Column header text'), {
      target: { value: '<p>Hours</p>' },
    })

    expect(updateElement).toHaveBeenCalled()
    const saved = updateElement.mock.calls.at(-1)[0]
    expect(saved.columns[0].text).toBe('<p>Hours</p>')
    expect(saved.columns[0].value).toBe('hours')
    expect(element.columns[0].text).toBe('<p>Time</p>')
  })
})
