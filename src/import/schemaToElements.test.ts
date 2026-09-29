import { describe, expect, it } from 'vitest'

import { schemaToFormElements } from './schemaToElements'
import type { ImportedFormSchema } from './types'

describe('schemaToFormElements', () => {
  it('creates toolbar-equivalent elements for each field type', () => {
    const schema: ImportedFormSchema = {
      fields: [
        { type: 'header', label: 'My <Form>' },
        { type: 'text', label: 'Name', required: true },
        { type: 'date', label: 'Date' },
        { type: 'radio', label: 'Gender', options: ['Male', 'Female'] },
        { type: 'signature', label: 'Applicant' },
        { type: 'section', label: 'Part 2' },
      ],
    }
    const elements = schemaToFormElements(schema)
    expect(elements.map((e) => e.element)).toEqual([
      'Header',
      'TextInput',
      'DatePicker',
      'RadioButtons',
      'Signature2',
      'Section',
    ])
    expect(elements[0].content).toBe('My &lt;Form&gt;')
    expect(elements[1]).toMatchObject({ label: 'Name', required: true, canHaveAnswer: true })
    expect(String(elements[1].field_name)).toMatch(/^text_input_/)
    expect(elements[2].dateFormat).toBeDefined()
    expect(elements[3].options).toHaveLength(2)
    expect(elements[3].options?.[0]).toMatchObject({ value: '1', text: 'Male' })
    expect(String(elements[3].options?.[0].key)).toMatch(/^radiobuttons_option_/)
    expect(elements[4].position).toBe('Applicant')
    expect(elements[5].header).toBe('Part 2')
    // every element gets a unique id
    expect(new Set(elements.map((e) => e.id)).size).toBe(elements.length)
  })

  it('keeps placeholder options when a choice field has none', () => {
    const [dropdown] = schemaToFormElements({ fields: [{ type: 'dropdown', label: 'Province' }] })
    expect(dropdown.element).toBe('Dropdown')
    expect(dropdown.options?.length).toBeGreaterThan(0)
  })

  it('builds tables with columns and fixed row labels', () => {
    const [table] = schemaToFormElements({
      fields: [{ type: 'table', columns: ['Item', 'OK', 'NG'], rowLabels: ['Clean', 'Safe'] }],
    })
    expect(table.element).toBe('Table')
    expect((table.columns as Array<{ text: string }>).map((c) => c.text)).toEqual(['Item', 'OK', 'NG'])
    expect((table.rowLabels as Array<{ text: string }>).map((r) => r.text)).toEqual(['Clean', 'Safe'])
    expect(table.rows).toBe(2)
  })

  it('wraps row children in a column row with parent links appended last', () => {
    const elements = schemaToFormElements({
      fields: [
        {
          type: 'row',
          children: [
            { type: 'text', label: 'First' },
            { type: 'text', label: 'Last' },
            { type: 'number', label: 'Age' },
          ],
        },
        { type: 'textarea', label: 'Notes' },
      ],
    })
    const row = elements[0]
    expect(row.element).toBe('ThreeColumnRow')
    expect(row.isContainer).toBe(true)
    expect(elements[1].element).toBe('TextArea')

    const children = elements.slice(2)
    expect(children).toHaveLength(3)
    children.forEach((child, col) => {
      expect(child.parentId).toBe(row.id)
      expect(child.row).toBe(0)
      expect(child.col).toBe(col)
      expect(child.parentIndex).toBe(0)
    })
    expect(row.childItems).toEqual([children.map((c) => c.id)])
  })

  it('flattens a row with a single child', () => {
    const elements = schemaToFormElements({
      fields: [{ type: 'row', children: [{ type: 'text', label: 'Only' }] }],
    })
    expect(elements).toHaveLength(1)
    expect(elements[0].element).toBe('TextInput')
  })

  it('adds a description when the field carries one', () => {
    const [age] = schemaToFormElements({ fields: [{ type: 'number', label: 'อายุ', description: 'ปี' }] })
    expect(age).toMatchObject({ description: 'ปี', showDescription: true })
  })
})
