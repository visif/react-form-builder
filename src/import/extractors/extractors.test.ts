import { describe, expect, it, vi } from 'vitest'

import { normalizeExtractResult } from '../importFormFromFile'
import { createRemoteImportAdapter, normalizeRemoteResponse } from '../remoteAdapter'
import { detectFileKind } from './fileKind'
import { htmlToText } from './htmlToText'
import { textItemsToLines, widgetsToSchema } from './pdf'
import { sheetsToText } from './sheets'

describe('detectFileKind', () => {
  it('detects by extension and mime type', () => {
    expect(detectFileKind({ name: 'a.PDF', type: '' })).toBe('pdf')
    expect(detectFileKind({ name: 'a.docx', type: '' })).toBe('docx')
    expect(detectFileKind({ name: 'a.xlsx', type: '' })).toBe('sheet')
    expect(detectFileKind({ name: 'a.csv', type: 'text/csv' })).toBe('sheet')
    expect(detectFileKind({ name: 'RFQ.numbers', type: '' })).toBe('sheet')
    expect(detectFileKind({ name: 'scan', type: 'image/png' })).toBe('image')
    expect(detectFileKind({ name: 'a.md', type: '' })).toBe('text')
    expect(detectFileKind({ name: 'a.zip', type: 'application/zip' })).toBe('unknown')
  })
})

describe('htmlToText (DOCX)', () => {
  it('converts headings, paragraphs, tables, lists and underlined blanks', () => {
    const html = `
      <h1>Leave Request</h1>
      <p>Name: <u>        </u></p>
      <p>Type \uF06F Sick \uF06F Vacation</p>
      <table><tr><th>Date</th><th>Hours</th></tr><tr><td>Mon</td><td></td></tr></table>
      <ul><li>Option A</li><li>Option B</li></ul>
    `
    const text = htmlToText(html)
    expect(text).toContain('# Leave Request')
    expect(text).toContain('Name: ______')
    expect(text).toContain('Type ☐ Sick ☐ Vacation')
    expect(text).toContain('| Date | Hours |')
    expect(text).toContain('| Mon |  |')
    expect(text).toContain('- Option A')
  })

  it('feeds textToFormSchema through normalizeExtractResult with html meta', () => {
    const schema = normalizeExtractResult({
      kind: 'text',
      text: '<h1>Title</h1><p>Age: <u>   </u></p>',
      meta: { html: true },
    })
    expect(schema.fields[0]).toMatchObject({ type: 'header', label: 'Title' })
    expect(schema.fields[1]).toMatchObject({ type: 'number', label: 'Age' })
  })
})

describe('sheetsToText (pre-filled template)', () => {
  it('splits side-by-side sections, drops sample values and ends tables at summary rows', () => {
    const rows = [
      ['REQUEST FOR QUOTATION (RFQ)', '', '', ''],
      ['1. BUYER DETAILS', '', '2. VENDOR DETAILS', ''],
      ['Company Name:', 'Acme Inc.', 'Vendor Name:', 'Apex Ltd.'],
      ['Date Issued:', '2026-10-01', 'Valid Until:', '[ Vendor to Fill ]'],
      ['3. ITEMS', '', '', ''],
      ['Item #', 'Description', 'Qty', 'Total Price ($)'],
      ['1', 'Workstation', '15', '27750'],
      ['2', 'Monitor', '30', '11400'],
      ['Subtotal:', '', '', '39150'],
      ['Tax (7%):', '', '', '2740.5'],
      ['5. SIGNATURE', '', '', ''],
      ['Authorized Name:', '[ Printed Name ]', 'Signature:', ''],
    ]
    const text = sheetsToText([{ name: 'RFQ', rows }])
    expect(text.split('\n')).toEqual([
      '## REQUEST FOR QUOTATION (RFQ)',
      '| 1. BUYER DETAILS | 2. VENDOR DETAILS |',
      '| Company Name ______ | Vendor Name ______ |',
      '| Date Issued ______ | Valid Until ______ |',
      '',
      '## 3. ITEMS',
      '| Item # | Description | Qty | Total Price ($) |',
      '| 1 | Workstation | 15 | 27750 |',
      '| 2 | Monitor | 30 | 11400 |',
      '',
      'Subtotal ______',
      'Tax (7%) ______',
      '## 5. SIGNATURE',
      '| Authorized Name ______ | Signature ______ |',
    ])

    const schema = normalizeExtractResult({ kind: 'sheets', sheets: [{ name: 'RFQ', rows }] })
    expect(schema.fields.map((f) => `${f.type}:${f.label ?? ''}`)).toEqual([
      'header:REQUEST FOR QUOTATION (RFQ)',
      'row:',
      'section:3. ITEMS',
      'table:',
      'number:Subtotal',
      'number:Tax (7%)',
      'section:5. SIGNATURE',
      'row:',
    ])
    const details = schema.fields[1]
    expect(details.columns).toEqual(['1. BUYER DETAILS', '2. VENDOR DETAILS'])
    expect(details.grid?.map((line) => line.map((c) => `${c?.type}:${c?.label}`))).toEqual([
      ['text:Company Name', 'text:Vendor Name'],
      ['date:Date Issued', 'date:Valid Until'],
    ])
    expect(schema.fields[schema.fields.length - 1].children?.map((c) => c.type)).toEqual(['text', 'signature'])
  })
})

describe('sheetsToText (XLSX)', () => {
  it('renders titles, label/blank pairs, option rows and table blocks', () => {
    const text = sheetsToText([
      {
        name: 'Sheet1',
        rows: [
          ['แบบประเมิน', '', ''],
          ['', '', ''],
          ['ชื่อ', '', 'แผนก', ''],
          ['เพศ', '☐ ชาย', '☐ หญิง'],
          ['รายการ', 'ดี', 'พอใช้', 'ปรับปรุง'],
          ['ความสะอาด', '', '', ''],
          ['ความรวดเร็ว', '', '', ''],
        ],
      },
    ])
    const lines = text.split('\n')
    expect(lines[0]).toBe('แบบประเมิน')
    expect(text).toContain('ชื่อ ______ แผนก ______')
    expect(text).toContain('เพศ ☐ ชาย ☐ หญิง')
    expect(text).toContain('| รายการ | ดี | พอใช้ | ปรับปรุง |')
    expect(text).toContain('| ความสะอาด |  |  |  |')

    const schema = normalizeExtractResult({ kind: 'sheets', sheets: [{ name: 'Sheet1', rows: [] }] })
    expect(schema.fields).toEqual([])
  })

  it('produces a full schema from a sheet', () => {
    const schema = normalizeExtractResult({
      kind: 'sheets',
      sheets: [
        {
          name: 'Form',
          rows: [
            ['Visitor Log'],
            ['Name', ''],
            ['Company', ''],
            ['Purpose', '( ) Meeting', '( ) Delivery'],
          ],
        },
      ],
    })
    expect(schema.fields.map((f) => f.type)).toEqual(['header', 'text', 'text', 'radio'])
    expect(schema.fields[3].options).toEqual(['Meeting', 'Delivery'])
  })
})

describe('PDF helpers', () => {
  it('groups text items into lines by y and orders by x', () => {
    const item = (str: string, x: number, y: number, size = 10) => ({
      str,
      transform: [size, 0, 0, size, x, y],
      width: str.length * size * 0.5,
    })
    const lines = textItemsToLines([
      item('Address', 40, 700),
      item('Name', 40, 720),
      item('.............', 80, 720),
      item('Date', 300, 720),
      item('....', 330, 720.5),
    ])
    // Wide X gaps become markdown table cells so column structure survives
    expect(lines[0]).toMatch(/^\| Name \.+ \| Date \.+ \|$/)
    expect(lines[1]).toBe('Address')
  })

  it('emits multi-row pipe tables from aligned PDF columns', () => {
    const item = (str: string, x: number, y: number, size = 10) => ({
      str,
      transform: [size, 0, 0, size, x, y],
      width: Math.max(str.length, 1) * size * 0.5,
    })
    const lines = textItemsToLines([
      item('รายการ', 40, 700),
      item('ดี', 200, 700),
      item('พอใช้', 320, 700),
      item('ความสะอาด', 40, 680),
      item('ความรวดเร็ว', 40, 660),
    ])
    expect(lines[0]).toBe('| รายการ | ดี | พอใช้ |')
    expect(lines[1]).toBe('ความสะอาด')
    expect(lines[2]).toBe('ความรวดเร็ว')

    const schema = normalizeExtractResult({ kind: 'text', text: ['แบบประเมิน', ...lines].join('\n') })
    expect(schema.fields[1]).toMatchObject({
      type: 'table',
      columns: ['รายการ', 'ดี', 'พอใช้'],
      rowLabels: ['ความสะอาด', 'ความรวดเร็ว'],
    })
  })

  it('joins Thai syllables that pdf.js splits with zero widths and stray spaces', () => {
    const item = (str: string, x: number, width: number, size = 24) => ({
      str,
      transform: [size, 0, 0, size, x, 780],
      width,
    })
    const lines = textItemsToLines([
      item('ใบ', 56.7, 28.9),
      item('รั', 85.6, 0),
      item(' ', 85.6, 0.48),
      item('บมอบงาน', 97.1, 98.7),
    ])
    expect(lines).toEqual(['ใบรับมอบงาน'])
  })

  it('builds a schema from AcroForm widgets', () => {
    const schema = widgetsToSchema([
      { page: 1, x: 10, y: 700, fieldName: 'applicant.full_name', fieldType: 'Tx', alternativeText: 'Full name' },
      { page: 1, x: 10, y: 680, fieldName: 'remarks', fieldType: 'Tx', multiLine: true },
      { page: 1, x: 10, y: 660, fieldName: 'gender', fieldType: 'Btn', radioButton: true, buttonValue: 'M' },
      { page: 1, x: 60, y: 660, fieldName: 'gender', fieldType: 'Btn', radioButton: true, buttonValue: 'F' },
      { page: 1, x: 10, y: 640, fieldName: 'interests.sports', fieldType: 'Btn', checkBox: true },
      { page: 1, x: 60, y: 640, fieldName: 'interests.music', fieldType: 'Btn', checkBox: true },
      {
        page: 1,
        x: 10,
        y: 620,
        fieldName: 'country',
        fieldType: 'Ch',
        options: [{ exportValue: 'th', displayValue: 'Thailand' }],
        required: true,
      },
      { page: 2, x: 10, y: 700, fieldName: 'sig', fieldType: 'Sig' },
    ])
    expect(schema.fields).toEqual([
      expect.objectContaining({ type: 'text', label: 'Full name' }),
      expect.objectContaining({ type: 'textarea', label: 'remarks' }),
      expect.objectContaining({ type: 'radio', label: 'gender', options: ['M', 'F'] }),
      expect.objectContaining({ type: 'checkboxes', label: 'interests', options: ['sports', 'music'] }),
      expect.objectContaining({ type: 'dropdown', label: 'country', options: ['Thailand'], required: true }),
      expect.objectContaining({ type: 'signature', label: 'sig' }),
    ])
  })
})

describe('remote adapter', () => {
  it('normalises the flexible response shapes', () => {
    expect(normalizeRemoteResponse('Name: ____')).toEqual({ kind: 'text', text: 'Name: ____' })
    expect(normalizeRemoteResponse({ markdown: '# Hi' })).toEqual({ kind: 'text', text: '# Hi' })
    expect(normalizeRemoteResponse({ fields: [{ type: 'text', label: 'A' }] })).toEqual({
      kind: 'schema',
      schema: { title: undefined, fields: [{ type: 'text', label: 'A' }] },
    })
    expect(normalizeRemoteResponse({ schema: { fields: [] } })).toEqual({ kind: 'schema', schema: { fields: [] } })
    expect(() => normalizeRemoteResponse({ nope: 1 } as never)).toThrow()
  })

  it('posts the file as multipart form data and parses JSON', async () => {
    const fetchMock = vi.fn(async (url: string, init: NonNullable<Parameters<typeof fetch>[1]>) => {
      expect(url).toBe('/api/import')
      expect(init.method).toBe('POST')
      expect(init.body).toBeInstanceOf(FormData)
      expect((init.body as FormData).get('document')).toBeInstanceOf(File)
      expect((init.body as FormData).get('lang')).toBe('th')
      return new Response(JSON.stringify({ fields: [{ type: 'date', label: 'When' }] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    })
    const adapter = createRemoteImportAdapter({
      url: '/api/import',
      fieldName: 'document',
      extraFields: { lang: 'th' },
      kinds: ['image', 'pdf'],
      fetch: fetchMock as unknown as typeof fetch,
    })
    const file = new File(['x'], 'scan.png', { type: 'image/png' })
    expect(adapter.accepts(file)).toBe(true)
    expect(adapter.accepts(new File(['x'], 'a.docx'))).toBe(false)

    const result = await adapter.extract(file, {})
    expect(result).toEqual({ kind: 'schema', schema: { title: undefined, fields: [{ type: 'date', label: 'When' }] } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('surfaces HTTP errors', async () => {
    const adapter = createRemoteImportAdapter({
      url: '/api/import',
      fetch: (async () => new Response('nope', { status: 500, statusText: 'Server Error' })) as unknown as typeof fetch,
    })
    await expect(adapter.extract(new File(['x'], 'a.pdf'), {})).rejects.toThrow(/500/)
  })
})
