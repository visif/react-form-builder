import { describe, expect, it } from 'vitest'

import { mergeEditorElementUpdate } from './mergeEditorElementUpdate'

const tableElement = {
  id: 'table-1',
  element: 'Table',
  label: 'Cost',
  columns: [{ key: 'c1', text: '<p>Time</p>', value: 'time', width: 1 }],
}

describe('mergeEditorElementUpdate', () => {
  it('keeps column header text from the column editor', () => {
    const current = { ...tableElement, label: 'Updated label' }
    const incoming = {
      ...tableElement,
      columns: [{ key: 'c1', text: '<p>Hours</p>', value: 'hours', width: 1 }],
    }

    const merged = mergeEditorElementUpdate(current, incoming)

    expect(merged.label).toBe('Updated label')
    expect(merged.columns[0].text).toBe('<p>Hours</p>')
    expect(merged.columns[0].value).toBe('hours')
  })

  it('ignores blur events so they do not replace the element', () => {
    const blurEvent = { nativeEvent: {}, target: {}, type: 'blur' }

    expect(mergeEditorElementUpdate(tableElement, blurEvent)).toBe(tableElement)
  })
})
