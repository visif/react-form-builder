import { describe, expect, it } from 'vitest'

import { textToFormSchema } from './textToSchema'

describe('textToFormSchema', () => {
  it('uses the first short line as the title header', () => {
    const schema = textToFormSchema('แบบฟอร์มขอลาพักผ่อน\n\nชื่อ-นามสกุล ....................')
    expect(schema.title).toBe('แบบฟอร์มขอลาพักผ่อน')
    expect(schema.fields[0]).toMatchObject({ type: 'header', label: 'แบบฟอร์มขอลาพักผ่อน' })
  })

  it('turns dotted / underscored blanks into inputs with inferred types', () => {
    const schema = textToFormSchema(
      [
        'ใบสมัครงาน',
        'ชื่อ-นามสกุล ...........................................',
        'วันเกิด ......../......../........',
        'อายุ ........ ปี',
        'ที่อยู่ปัจจุบัน ______________________________',
        'Email: ____________________',
        'ลงชื่อ .......................... ผู้สมัคร',
      ].join('\n')
    )
    const [, name, dob, age, address, email, sign] = schema.fields
    expect(name).toMatchObject({ type: 'text', label: 'ชื่อ-นามสกุล' })
    expect(dob).toMatchObject({ type: 'date', label: 'วันเกิด' })
    expect(age).toMatchObject({ type: 'number', label: 'อายุ', description: 'ปี' })
    expect(address).toMatchObject({ type: 'textarea', label: 'ที่อยู่ปัจจุบัน' })
    expect(email).toMatchObject({ type: 'text', label: 'Email' })
    expect(sign).toMatchObject({ type: 'signature', label: 'ลงชื่อ' })
  })

  it('groups several blanks on one line into a column row', () => {
    const schema = textToFormSchema('Form\nFirst name ________ Last name ________ Age ____')
    const row = schema.fields[1]
    expect(row.type).toBe('row')
    expect(row.children?.map((c) => c.label)).toEqual(['First name', 'Last name', 'Age'])
    expect(row.children?.[2].type).toBe('number')
  })

  it('detects checkbox and radio option groups, inline and multi-line', () => {
    const schema = textToFormSchema(
      [
        'Survey',
        'เพศ ( ) ชาย ( ) หญิง',
        'ความสนใจ:',
        '☐ เทคโนโลยี',
        '☐ กีฬา',
        '☐ ดนตรี',
        '',
        'Status: Active / Inactive / Pending',
      ].join('\n')
    )
    const [, gender, interests, status] = schema.fields
    expect(gender).toMatchObject({ type: 'radio', label: 'เพศ', options: ['ชาย', 'หญิง'] })
    expect(interests).toMatchObject({
      type: 'checkboxes',
      label: 'ความสนใจ',
      options: ['เทคโนโลยี', 'กีฬา', 'ดนตรี'],
    })
    expect(status).toMatchObject({ type: 'radio', label: 'Status', options: ['Active', 'Inactive', 'Pending'] })
  })

  it('treats "Label:" prompts followed by blank lines as text inputs', () => {
    const schema = textToFormSchema('Title\nDepartment:\n\nPosition:\nNotes:')
    expect(schema.fields.slice(1)).toEqual([
      expect.objectContaining({ type: 'text', label: 'Department' }),
      expect.objectContaining({ type: 'text', label: 'Position' }),
      expect.objectContaining({ type: 'textarea', label: 'Notes' }),
    ])
  })

  it('lets a pending prompt label the following fill line', () => {
    const schema = textToFormSchema('Title\n1. ชื่อผู้ขอ\n..........................')
    expect(schema.fields[1]).toMatchObject({ type: 'text', label: '1. ชื่อผู้ขอ' })
  })

  it('marks fields with * as required', () => {
    const schema = textToFormSchema('Title\nPhone *: __________')
    expect(schema.fields[1]).toMatchObject({ type: 'text', label: 'Phone', required: true })
  })

  it('builds tables from pipe rows, with fixed row labels when only the first column is filled', () => {
    const schema = textToFormSchema(
      ['Checklist', '| รายการ | ผ่าน | ไม่ผ่าน |', '| ความสะอาด |  |  |', '| ความปลอดภัย |  |  |'].join('\n')
    )
    expect(schema.fields[1]).toMatchObject({
      type: 'table',
      columns: ['รายการ', 'ผ่าน', 'ไม่ผ่าน'],
      rowLabels: ['ความสะอาด', 'ความปลอดภัย'],
    })
  })

  it('builds free-row tables when body cells contain data', () => {
    const schema = textToFormSchema(
      ['Order', '| Item | Qty | Price |', '| Pen | 2 | 10 |', '| Book | 1 | 100 |'].join('\n')
    )
    expect(schema.fields[1]).toMatchObject({ type: 'table', columns: ['Item', 'Qty', 'Price'], rows: 2 })
    expect(schema.fields[1].rowLabels).toBeUndefined()
  })

  it('detects space-aligned grids (PDF / OCR style) as tables', () => {
    const schema = textToFormSchema(
      [
        'แบบประเมิน',
        'รายการ   ดี   พอใช้   ปรับปรุง',
        'ความสะอาด',
        'ความรวดเร็ว',
        'ความสุภาพ',
      ].join('\n')
    )
    expect(schema.fields[1]).toMatchObject({
      type: 'table',
      columns: ['รายการ', 'ดี', 'พอใช้', 'ปรับปรุง'],
      rowLabels: ['ความสะอาด', 'ความรวดเร็ว', 'ความสุภาพ'],
    })
  })

  it('detects pipe rows without outer pipes', () => {
    const schema = textToFormSchema(['Grid', 'Item | Qty | Price', 'Pen | 2 | 10', 'Book | 1 | 100'].join('\n'))
    expect(schema.fields[1]).toMatchObject({ type: 'table', columns: ['Item', 'Qty', 'Price'], rows: 2 })
  })

  it('keeps wrapped cell text inside the table and uses the caption above as its label', () => {
    const schema = textToFormSchema(
      [
        'ใบรับมอบงาน',
        'รายละเอียดงาน',
        '| ลักษณะงาน | ค่าจ้าง |',
        '| Developed and fixed Visiforge DC 5.0 | 90,000 |',
        '• VDC-1043 Online Form: Bold text cannot be displayed',
        '• VDC-929 Questionaire form can only be selected the first row',
        'but not the other row.',
        '| • Weekly Meeting | 10,000 |',
        '| ยอดรวม | 100,000 |',
        'ลงชื่อ',
        '………………………………',
      ].join('\n')
    )
    expect(schema.fields.map((f) => f.type)).toEqual(['header', 'table', 'signature'])
    expect(schema.fields[1]).toMatchObject({ label: 'รายละเอียดงาน', columns: ['ลักษณะงาน', 'ค่าจ้าง'], rows: 3 })
  })

  it('keeps pre-filled "Label: value" lines as inputs, long values as multi-line', () => {
    const schema = textToFormSchema(
      [
        'Title',
        'ชื่อผู้ว่าจ้าง: บริษัท วิสิฟอร์จ จำกัด',
        'ที่อยู่: 107/315 เจริญกรุง 65 แขวงยานนาวา เขตสาทร กรุงเทพมหานคร 10120',
        '107/315 เจริญกรุง 65 แขวงยานนาวา',
      ].join('\n')
    )
    expect(schema.fields.slice(1)).toEqual([
      expect.objectContaining({ type: 'text', label: 'ชื่อผู้ว่าจ้าง' }),
      expect.objectContaining({ type: 'textarea', label: 'ที่อยู่' }),
      // A street number is not a numbered question
      expect.objectContaining({ type: 'label' }),
    ])
  })

  it('does not treat a single multi-column fill line as a table', () => {
    const schema = textToFormSchema('Form\n| Name ............. | Date .... |')
    expect(schema.fields.map((f) => f.type)).not.toContain('table')
    expect(schema.fields[1].type).toBe('row')
  })

  it('maps headings, sections, paragraphs and separators', () => {
    const schema = textToFormSchema(
      [
        '# Employee Onboarding',
        'ส่วนที่ 1 ข้อมูลทั่วไป',
        'กรุณากรอกข้อมูลให้ครบถ้วนและตรวจสอบความถูกต้องก่อนส่งแบบฟอร์ม',
        '--------------------',
        'Name: ______',
        'หน้า 1/2',
      ].join('\n')
    )
    expect(schema.fields.map((f) => f.type)).toEqual(['header', 'section', 'paragraph', 'linebreak', 'text'])
    expect(schema.title).toBe('Employee Onboarding')
  })

  it('reads printed web-form controls: option lists, placeholders, required labels, empty grids', () => {
    const schema = textToFormSchema(
      [
        'Test Form',
        'Section 1',
        'Radio *',
        '○ Option 1',
        '○ Option 2',
        'Dropdown 1',
        'Please Select',
        'Text Input *',
        'Start date',
        'dd/mm/yyyy',
        '| Column1 | Column2 |',
        '| ______ | ______ |',
        '| ______ | ______ |',
      ].join('\n')
    )
    expect(schema.fields.slice(1)).toEqual([
      expect.objectContaining({ type: 'section', label: 'Section 1' }),
      expect.objectContaining({ type: 'radio', label: 'Radio', required: true, options: ['Option 1', 'Option 2'] }),
      expect.objectContaining({ type: 'dropdown', label: 'Dropdown 1' }),
      expect.objectContaining({ type: 'text', label: 'Text Input', required: true }),
      expect.objectContaining({ type: 'date', label: 'Start date' }),
      expect.objectContaining({ type: 'table', columns: ['Column1', 'Column2'], rows: 2 }),
    ])
  })

  it('returns no fields for empty input', () => {
    expect(textToFormSchema('').fields).toEqual([])
    expect(textToFormSchema('\n\n   \n').fields).toEqual([])
  })
})
