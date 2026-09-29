/**
 * Heuristic converter from extracted document text to an ImportedFormSchema.
 *
 * Input is plain text (one line per visual line) optionally carrying a few
 * markdown-lite markers that the built-in extractors emit:
 *   - `# Heading`            → header
 *   - `| a | b | c |`        → table row (consecutive rows form one table)
 *   - `- [ ] option`         → checkbox option
 *   - `\f`                   → page separator (ignored)
 *
 * The rules are tuned for typical Thai / English paper forms: dotted or
 * underscored fill-in lines, ☐ / ( ) option glyphs, "Label:" prompts and
 * numbered questions.
 */
import type { ImportedField, ImportedFieldType, ImportedFormSchema } from './types'

/* -------------------------------------------------------------------------- */
/* Regular expressions                                                         */
/* -------------------------------------------------------------------------- */

// Fill-in blanks: ______ , ........ , … , (. . . .) , ------- (5+ to avoid list dashes)
const FILL_RUN = /(?:_{3,}|\.{3,}|…+|(?:\.\s){3,}\.?|-{5,}|—{2,})/g

// Option glyphs
const CHECKBOX_GLYPH = /(?:[☐☑☒■□▢▣◻◼✓✔]|\[\s{0,2}[xX✓✔]?\s{0,2}\])/g
const RADIO_GLYPH = /(?:[○●◯◉⚪⚫]|\(\s{0,3}[xX✓✔]?\s{0,3}\))/g
const OPTION_GLYPH = new RegExp(`${CHECKBOX_GLYPH.source}|${RADIO_GLYPH.source}`, 'g')

const TABLE_ROW = /^\s*\|.*\|\s*$/
const MARKDOWN_HEADING = /^\s*#{1,6}\s+(.+?)\s*$/
const PLAIN_BULLET = /^\s*[-*•▪◦‣]\s+/
const LEADING_NUMBER = /^\s*(?:ข้อ(?:ที่)?\s*)?\(?\d{1,3}(?:\.\d{1,2})*[.)]?\s*/
const SEPARATOR_LINE = /^[\s\-_=─━═~*]{6,}$/
const PAGE_NUMBER = /^\s*(?:หน้า|page|p\.)\s*\d+(?:\s*(?:\/|of|จาก)\s*\d+)?\s*$/i
const SECTION_HEADING =
  /^\s*(?:ส่วนที่|ตอนที่|หมวดที่|หมวด|ส่วน|part|section|ตอน|บทที่|chapter)\s*[\dIVX๐-๙]+/i
const INSTRUCTION = /^\s*(?:กรุณา|โปรด|คำชี้แจง|คำอธิบาย|หมายเหตุ\s*[:：]|please|note\s*[:：]|instructions?\s*[:：])/i
const YES_NO = /^(?:ใช่|ไม่ใช่|yes|no|มี|ไม่มี|ผ่าน|ไม่ผ่าน)$/i

/* Type inference keyword lists (checked in priority order) */
const KEYWORDS: Array<[ImportedFieldType, RegExp]> = [
  ['signature', /ลงชื่อ|ลงนาม|ลายมือชื่อ|ลายเซ็น|เซ็นชื่อ|ผู้อนุมัติ|ผู้ตรวจสอบ|signature|signed\s*by|sign\s*here|approved\s*by|reviewed\s*by/i],
  ['date', /วันที่|วัน\s*\/\s*เดือน\s*\/\s*ปี|ว\s*\/\s*ด\s*\/\s*ป|วันเกิด|วัน\s*เดือน\s*ปี|ลงวันที่|เมื่อวันที่|กำหนดส่ง|\bdate\b|\bdob\b|birth|deadline|due\s*on/i],
  ['imageupload', /รูปถ่าย|รูปภาพ|ภาพถ่าย|\bphoto|\bpicture|\bimage/i],
  ['fileupload', /เอกสารแนบ|แนบไฟล์|ไฟล์แนบ|แนบเอกสาร|สิ่งที่ส่งมาด้วย|attach|upload|\bfile\b/i],
  ['rating', /คะแนน|ระดับความพึงพอใจ|ความพึงพอใจ|\brating\b|\brate\b|satisfaction|ให้ดาว/i],
  ['textarea', /หมายเหตุ|รายละเอียด|ที่อยู่|เหตุผล|ข้อเสนอแนะ|ความคิดเห็น|อธิบาย|ข้อคิดเห็น|สาเหตุ|remarks?|notes?|comments?|description|address|reason|details?|explain|feedback|suggestions?|justification/i],
  ['number', /จำนวน|ยอดรวม|ยอดเงิน|ราคา|จำนวนเงิน|บาท|อายุ|น้ำหนัก|ส่วนสูง|ร้อยละ|เปอร์เซ็นต์|\bage\b|amount|\bqty\b|quantity|price|\btotal\b|\bcount\b|weight|height|percent|\bno\.\s*of\b|number\s*of/i],
  ['dropdown', /จังหวัด|ประเทศ|คำนำหน้า|คำนำหน้าชื่อ|province|country|prefix|\bselect\b|\bchoose\b|โปรดเลือก|กรุณาเลือก/i],
]

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const normalize = (raw: string): string =>
  raw
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[：]/g, ':')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\t/g, '  ')

const cleanLabel = (text: string): string =>
  text
    .replace(/[\s:：\-–]+$/g, '')
    .replace(/^[\s:：\-–]+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

const stripRequired = (label: string): { label: string; required: boolean } => {
  const required = /\*/.test(label) || /\(\s*(?:required|จำเป็น|บังคับ)\s*\)/i.test(label)
  const clean = cleanLabel(
    label.replace(/\*/g, '').replace(/\(\s*(?:required|จำเป็น|บังคับ|optional|ถ้ามี)\s*\)/gi, '')
  )
  return { label: clean, required }
}

const isPunctuationOnly = (text: string): boolean => /^[\s\p{P}\p{S}]*$/u.test(text)

const hasThai = (text: string): boolean => /[\u0E00-\u0E7F]/.test(text)

/** Rough visual width: Thai has no word spaces, so count characters generously. */
const textLength = (text: string): number => text.replace(/\s+/g, ' ').trim().length

const inferInputType = (label: string): ImportedFieldType => {
  const found = KEYWORDS.find(([, re]) => re.test(label))
  return found ? found[0] : 'text'
}

const uniqueOptions = (options: string[]): string[] => {
  const seen = new Set<string>()
  return options
    .map((o) => cleanLabel(o.replace(/\*/g, '')))
    .filter((o) => o.length > 0 && !isPunctuationOnly(o))
    .filter((o) => {
      const key = o.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

/* -------------------------------------------------------------------------- */
/* Line tokenizer                                                              */
/* -------------------------------------------------------------------------- */

type Token =
  | { kind: 'blank' }
  | { kind: 'heading'; text: string }
  | { kind: 'table-row'; cells: string[] }
  | { kind: 'separator' }
  | { kind: 'options'; label: string; options: string[]; radio: boolean; raw: string }
  | { kind: 'bullet'; text: string; raw: string }
  | { kind: 'fields'; fields: ImportedField[]; leadingLabelMissing: boolean; raw: string }
  | { kind: 'prompt'; label: string; raw: string } // "Label:" with nothing after
  | { kind: 'text'; text: string; raw: string }

function splitOptionsLine(line: string): { label: string; options: string[]; radio: boolean } | null {
  const glyphs = [...line.matchAll(OPTION_GLYPH)]
  if (glyphs.length === 0) return null

  const firstIdx = glyphs[0].index ?? 0
  const labelPart = line.slice(0, firstIdx)
  const radioCount = glyphs.filter((g) => new RegExp(RADIO_GLYPH.source).test(g[0])).length
  const radio = radioCount > glyphs.length / 2

  const options: string[] = []
  glyphs.forEach((g, i) => {
    const start = (g.index ?? 0) + g[0].length
    const end = i + 1 < glyphs.length ? glyphs[i + 1].index ?? line.length : line.length
    options.push(line.slice(start, end).replace(FILL_RUN, ' ').trim())
  })

  return { label: cleanLabel(labelPart), options: uniqueOptions(options), radio }
}

function splitFillLine(line: string): { fields: ImportedField[]; leadingLabelMissing: boolean } | null {
  const runs = [...line.matchAll(FILL_RUN)]
  if (runs.length === 0) return null

  const segments: Array<{ label: string; suffix: string }> = []
  let cursor = 0
  runs.forEach((run, i) => {
    const start = run.index ?? 0
    const label = line.slice(cursor, start)
    cursor = start + run[0].length
    const isLast = i === runs.length - 1
    const suffix = isLast ? line.slice(cursor) : ''
    segments.push({ label, suffix })
  })

  // Merge runs that are only separated by punctuation ("...../...../.....")
  const merged: Array<{ label: string; suffix: string }> = []
  segments.forEach((seg) => {
    const trimmed = seg.label.trim()
    if (merged.length > 0 && (trimmed === '' || isPunctuationOnly(trimmed))) {
      merged[merged.length - 1].suffix = seg.suffix
      return
    }
    merged.push({ label: trimmed, suffix: seg.suffix })
  })

  const leadingLabelMissing = merged.length > 0 && merged[0].label === ''

  const fields: ImportedField[] = merged.map((seg) => {
    const { label, required } = stripRequired(seg.label)
    const suffix = cleanLabel(seg.suffix.replace(/[()]/g, ' '))
    const type: ImportedFieldType = label ? inferInputType(`${label} ${suffix}`) : 'text'
    const field: ImportedField = { type, label, source: line }
    if (required) field.required = true
    if (suffix && !isPunctuationOnly(suffix) && suffix.length <= 20) {
      field.description = suffix
    }
    return field
  })

  return { fields, leadingLabelMissing }
}

function splitInlineChoices(value: string): string[] | null {
  // "ชาย / หญิง", "Yes, No, N/A"
  const parts = value
    .split(/\s*(?:\/|,|;|\|)\s*/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length < 2 || parts.length > 8) return null
  if (parts.some((p) => textLength(p) > 30)) return null
  return uniqueOptions(parts)
}

function tokenize(line: string): Token {
  const trimmed = line.trim()
  if (!trimmed) return { kind: 'blank' }
  if (PAGE_NUMBER.test(trimmed)) return { kind: 'blank' }
  if (TABLE_ROW.test(trimmed)) {
    const cells = trimmed
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim())
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return { kind: 'blank' } // markdown separator row
    return { kind: 'table-row', cells }
  }
  if (SEPARATOR_LINE.test(trimmed)) return { kind: 'separator' }

  const heading = trimmed.match(MARKDOWN_HEADING)
  if (heading) return { kind: 'heading', text: cleanLabel(heading[1]) }

  const opts = splitOptionsLine(trimmed)
  if (opts && opts.options.length > 0) {
    return { kind: 'options', ...opts, raw: trimmed }
  }

  const fill = splitFillLine(trimmed)
  if (fill && fill.fields.length > 0) {
    return { kind: 'fields', ...fill, raw: trimmed }
  }

  if (PLAIN_BULLET.test(trimmed)) {
    return { kind: 'bullet', text: cleanLabel(trimmed.replace(PLAIN_BULLET, '')), raw: trimmed }
  }

  // "Label:" or "Label: value"
  const colonIdx = trimmed.indexOf(':')
  if (colonIdx > 0 && colonIdx < trimmed.length) {
    const key = trimmed.slice(0, colonIdx)
    const value = trimmed.slice(colonIdx + 1).trim()
    if (textLength(key) <= 60 && !INSTRUCTION.test(trimmed)) {
      if (!value) return { kind: 'prompt', label: key, raw: trimmed }
      const choices = splitInlineChoices(value)
      if (choices && choices.length >= 2 && choices.length <= 8) {
        const radio = choices.length <= 4 || choices.every((c) => YES_NO.test(c))
        return { kind: 'options', label: cleanLabel(key), options: choices, radio, raw: trimmed }
      }
      if (textLength(value) <= 40) {
        // A sample value (pre-filled form) – keep the field, drop the value
        const { label, required } = stripRequired(key)
        const field: ImportedField = { type: inferInputType(label), label, source: trimmed }
        if (required) field.required = true
        return { kind: 'fields', fields: [field], leadingLabelMissing: false, raw: trimmed }
      }
    }
  }

  return { kind: 'text', text: trimmed, raw: trimmed }
}

/* -------------------------------------------------------------------------- */
/* Assembler                                                                   */
/* -------------------------------------------------------------------------- */

const wrapRow = (fields: ImportedField[], source: string): ImportedField => {
  if (fields.length <= 1) return fields[0]
  if (fields.length > 4) {
    return { type: 'row', children: fields.slice(0, 4), source }
  }
  return { type: 'row', children: fields, source }
}

function buildTable(rows: string[][], source: string): ImportedField | null {
  const width = Math.max(...rows.map((r) => r.length))
  if (width < 2) return null
  const padded = rows.map((r) => [...r, ...Array(width - r.length).fill('')])
  const header = padded[0].map((c, i) => c || `Column ${i + 1}`)
  const body = padded.slice(1)

  // Fixed row labels: first column filled, the rest (mostly) empty
  const fillOnly = new RegExp(`^\\s*(?:${FILL_RUN.source})\\s*$`)
  const hasRowLabels =
    body.length > 0 &&
    body.every((r) => r[0] && r.slice(1).every((c) => !c || isPunctuationOnly(c) || fillOnly.test(c)))

  const field: ImportedField = {
    type: 'table',
    label: '',
    columns: header,
    source,
  }
  if (hasRowLabels) {
    field.rowLabels = body.map((r) => r[0])
  } else {
    field.rows = Math.max(1, body.length || 3)
  }
  return field
}

export type TextToSchemaOptions = {
  /** Use the first short line as the form title / Header (default true) */
  detectTitle?: boolean
}

export function textToFormSchema(rawText: string, options: TextToSchemaOptions = {}): ImportedFormSchema {
  const { detectTitle = true } = options
  const lines = normalize(rawText)
    .split(/\f|\n/)
    .map((l) => l.replace(/\s+$/, ''))

  const tokens = lines.map(tokenize)
  const fields: ImportedField[] = []
  let title: string | undefined

  // Pending "Label:" or short standalone text that may label the next line
  let pending: { label: string; required: boolean; raw: string } | null = null
  let optionGroup: { label: string; options: string[]; radio: boolean; source: string } | null = null
  let bulletGroup: { items: string[]; source: string } | null = null
  let tableRows: string[][] | null = null
  let tableSource = ''
  let sawContent = false

  const flushPending = () => {
    if (!pending) return
    const { label, required } = stripRequired(pending.label)
    if (label) {
      // A prompt with nothing after it → assume a text input
      const field: ImportedField = { type: inferInputType(label), label, source: pending.raw }
      if (required) field.required = true
      fields.push(field)
    }
    pending = null
  }

  const takePendingLabel = (): { label: string; required: boolean } | null => {
    if (!pending) return null
    const result = stripRequired(pending.label)
    pending = null
    return result
  }

  const flushOptions = () => {
    if (!optionGroup) return
    const { label, options, radio, source } = optionGroup
    optionGroup = null
    if (options.length === 0) return
    const { label: clean, required } = stripRequired(label)
    const field: ImportedField = {
      type: radio ? 'radio' : 'checkboxes',
      label: clean || 'Options',
      options,
      source,
    }
    if (required) field.required = true
    fields.push(field)
  }

  const flushBullets = () => {
    if (!bulletGroup) return
    const { items, source } = bulletGroup
    bulletGroup = null
    if (items.length >= 2 && items.every((i) => textLength(i) <= 60)) {
      const taken = takePendingLabel()
      const field: ImportedField = {
        type: 'checkboxes',
        label: taken?.label || 'Options',
        options: uniqueOptions(items),
        source,
      }
      if (taken?.required) field.required = true
      fields.push(field)
    } else {
      flushPending()
      items.forEach((i) => fields.push({ type: 'label', label: i, source }))
    }
  }

  const flushTable = () => {
    if (!tableRows) return
    const rows = tableRows
    tableRows = null
    const table = buildTable(rows, tableSource)
    if (table) {
      const taken = takePendingLabel()
      if (taken?.label) table.label = taken.label
      fields.push(table)
    }
  }

  const flushAll = () => {
    flushOptions()
    flushBullets()
    flushTable()
    flushPending()
  }

  tokens.forEach((token) => {
    if (token.kind !== 'table-row') flushTable()
    if (token.kind !== 'bullet') flushBullets()

    switch (token.kind) {
      case 'blank':
        flushOptions()
        // A blank line ends a pending prompt → it becomes a text input
        flushPending()
        break

      case 'separator':
        flushAll()
        if (fields.length > 0 && fields[fields.length - 1].type !== 'linebreak') {
          fields.push({ type: 'linebreak' })
        }
        break

      case 'heading':
        flushAll()
        if (!sawContent && detectTitle && !title) {
          title = token.text
          fields.push({ type: 'header', label: token.text, source: token.text })
        } else if (SECTION_HEADING.test(token.text)) {
          fields.push({ type: 'section', label: token.text, source: token.text })
        } else {
          fields.push({ type: 'header', label: token.text, source: token.text })
        }
        sawContent = true
        break

      case 'table-row':
        flushOptions()
        if (!tableRows) {
          tableRows = []
          tableSource = token.cells.join(' | ')
        }
        tableRows.push(token.cells)
        sawContent = true
        break

      case 'options': {
        sawContent = true
        if (token.label) {
          // New labelled group: "เพศ ( ) ชาย ( ) หญิง"
          flushOptions()
          flushPending()
          optionGroup = { label: token.label, options: [...token.options], radio: token.radio, source: token.raw }
        } else if (optionGroup) {
          // Continuation of the current group
          optionGroup.options = uniqueOptions([...optionGroup.options, ...token.options])
          if (token.radio !== optionGroup.radio) optionGroup.radio = false
        } else {
          const taken = takePendingLabel()
          optionGroup = {
            label: taken?.label || '',
            options: [...token.options],
            radio: token.radio,
            source: token.raw,
          }
          if (taken?.required) optionGroup.label = `${optionGroup.label}*`
        }
        break
      }

      case 'bullet':
        flushOptions()
        if (!bulletGroup) bulletGroup = { items: [], source: token.raw }
        bulletGroup.items.push(token.text)
        sawContent = true
        break

      case 'fields': {
        flushOptions()
        sawContent = true
        const list = token.fields.map((f) => ({ ...f }))
        if (token.leadingLabelMissing) {
          const taken = takePendingLabel()
          if (taken?.label) {
            list[0].label = taken.label
            list[0].type = inferInputType(`${taken.label} ${list[0].description || ''}`)
            if (taken.required) list[0].required = true
          } else if (fields.length > 0 && fields[fields.length - 1].type === 'label') {
            // Previous standalone text line was the label
            const prev = fields.pop() as ImportedField
            list[0].label = prev.label || ''
            list[0].type = inferInputType(list[0].label)
          }
        } else {
          flushPending()
        }
        list.forEach((f, i) => {
          if (!f.label) f.label = `Field ${fields.length + i + 1}`
        })
        fields.push(wrapRow(list, token.raw))
        break
      }

      case 'prompt':
        flushOptions()
        flushPending()
        sawContent = true
        pending = { label: token.label, required: false, raw: token.raw }
        break

      case 'text': {
        flushOptions()
        const { text } = token
        if (isPunctuationOnly(text) || textLength(text) < 2) break

        if (!sawContent && detectTitle && !title && textLength(text) <= 90) {
          flushPending()
          title = text
          fields.push({ type: 'header', label: text, source: text })
          sawContent = true
          break
        }
        sawContent = true

        if (SECTION_HEADING.test(text)) {
          flushPending()
          fields.push({ type: 'section', label: cleanLabel(text), source: text })
          break
        }

        if (INSTRUCTION.test(text) || textLength(text) > 110) {
          flushPending()
          fields.push({ type: 'paragraph', label: text, source: text })
          break
        }

        // Numbered question with no blank → treat as prompt for the next line
        if (LEADING_NUMBER.test(text) && textLength(text) <= 80) {
          flushPending()
          pending = { label: text, required: false, raw: text }
          break
        }

        // Ends with "?" → question prompt
        if (/[?？]$/.test(text)) {
          flushPending()
          pending = { label: text.replace(/[?？]$/, '').trim(), required: false, raw: text }
          break
        }

        // Short standalone text: keep as a Label; may be adopted by the next line
        flushPending()
        fields.push({ type: 'label', label: text, source: text })
        break
      }
      default:
        break
    }
  })

  flushAll()

  // Drop trailing / leading line breaks
  while (fields.length && fields[fields.length - 1].type === 'linebreak') fields.pop()
  while (fields.length && fields[0].type === 'linebreak') fields.shift()

  return { title, fields }
}

/** Expose glyph regexes for extractors that need to preserve them. */
export const IMPORT_TEXT_PATTERNS = {
  FILL_RUN,
  CHECKBOX_GLYPH,
  RADIO_GLYPH,
  hasThai,
}

export default textToFormSchema
