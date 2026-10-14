/* eslint-disable no-continue */
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
const MARKDOWN_HEADING = /^\s*(#{1,6})\s+(.+?)\s*$/
const PLAIN_BULLET = /^\s*[-*•▪◦‣]\s+/
// "1." / "1)" / "(1)" / "2.1" / "ข้อ 3" – a bare number ("107/315 ถนน…") is not a question
const LEADING_NUMBER = /^\s*(?:ข้อ(?:ที่)?\s*\d{1,3}|\(?\d{1,3}(?:\.\d{1,2})+\.?|\(?\d{1,3}[.)])(?:\s|$)/
const SEPARATOR_LINE = /^[\s\-_=─━═~*]{6,}$/
const PAGE_NUMBER = /^\s*(?:หน้า|page|p\.)\s*\d+(?:\s*(?:\/|of|จาก)\s*\d+)?\s*$/i
const SECTION_HEADING =
  /^\s*(?:ส่วนที่|ตอนที่|หมวดที่|หมวด|ส่วน|part|section|ตอน|บทที่|chapter)\s*[\dIVX๐-๙]+/i
const INSTRUCTION = /^\s*(?:กรุณา|โปรด|คำชี้แจง|คำอธิบาย|หมายเหตุ\s*[:：]|please|note\s*[:：]|instructions?\s*[:：])/i
// Placeholder text shown inside an empty control (printed / screenshotted web forms)
const SELECT_PLACEHOLDER =
  /^(?:please\s+select|select(?:\s+(?:one|an?\s+option))?|choose(?:\s+one)?|-{1,2}\s*(?:select|choose)[^-]*-{1,2}|กรุณาเลือก|โปรดเลือก|เลือก)\s*(?:\.{3}|…)?\s*[▾▼⌄]?$/i
const DATE_PLACEHOLDER =
  /^(?:dd|mm|yyyy|วว|ดด|ปปปป)(?:\s*[/.-]\s*(?:dd|mm|yyyy|yy|วว|ดด|ปปปป|ปป)){2}$|^yyyy-mm-dd$|^select\s+date$|^เลือกวันที่$/i
const YES_NO = /^(?:ใช่|ไม่ใช่|yes|no|มี|ไม่มี|ผ่าน|ไม่ผ่าน)$/i

/* Type inference keyword lists (checked in priority order) */
const KEYWORDS: Array<[ImportedFieldType, RegExp]> = [
  ['signature', /ลงชื่อ|ลงนาม|ลายมือชื่อ|ลายเซ็น|เซ็นชื่อ|ผู้อนุมัติ|ผู้ตรวจสอบ|signature|signed\s*by|sign\s*here|approved\s*by|reviewed\s*by/i],
  ['date', /วันที่|วัน\s*\/\s*เดือน\s*\/\s*ปี|ว\s*\/\s*ด\s*\/\s*ป|วันเกิด|วัน\s*เดือน\s*ปี|ลงวันที่|เมื่อวันที่|กำหนดส่ง|วันหมดอายุ|\bdate\b|\bdob\b|birth|deadline|due\s*on|valid\s*until|expir(?:y|es|ation)/i],
  ['imageupload', /รูปถ่าย|รูปภาพ|ภาพถ่าย|\bphoto|\bpicture|\bimage/i],
  ['fileupload', /เอกสารแนบ|แนบไฟล์|ไฟล์แนบ|แนบเอกสาร|สิ่งที่ส่งมาด้วย|attach|upload|\bfile\b/i],
  ['rating', /คะแนน|ระดับความพึงพอใจ|ความพึงพอใจ|\brating\b|\brate\b|satisfaction|ให้ดาว/i],
  ['textarea', /หมายเหตุ|รายละเอียด|ที่อยู่|เหตุผล|ข้อเสนอแนะ|ความคิดเห็น|อธิบาย|ข้อคิดเห็น|สาเหตุ|remarks?|notes?|comments?|description|address|reason|details?|explain|feedback|suggestions?|justification/i],
  ['number', /จำนวน|ยอดรวม|ยอดเงิน|ราคา|จำนวนเงิน|บาท|อายุ|น้ำหนัก|ส่วนสูง|ร้อยละ|เปอร์เซ็นต์|ภาษี|\bage\b|amount|\bqty\b|quantity|price|\btotal\b|subtotal|\btax\b|\(\s*[$฿€£¥]\s*\)|\(\s*\d+(?:\.\d+)?\s*%\s*\)|\bcount\b|weight|height|percent|\bno\.\s*of\b|number\s*of/i],
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

/** FILL_RUN / OPTION_GLYPH are global (used with matchAll); never call .test on them directly. */
const hasFillRun = (text: string): boolean => new RegExp(FILL_RUN.source).test(text)
const hasOptionGlyph = (text: string): boolean => new RegExp(OPTION_GLYPH.source).test(text)

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
  | { kind: 'heading'; text: string; level: number }
  | { kind: 'table-row'; cells: string[] }
  | { kind: 'separator' }
  | { kind: 'options'; label: string; options: string[]; radio: boolean; raw: string }
  | { kind: 'bullet'; text: string; raw: string }
  | { kind: 'fields'; fields: ImportedField[]; leadingLabelMissing: boolean; raw: string }
  | { kind: 'prompt'; label: string; raw: string } // "Label:" with nothing after
  | { kind: 'placeholder'; as: 'dropdown' | 'date'; raw: string } // "Please Select", "dd/mm/yyyy"
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

/** Parse a markdown / pipe / space-aligned table row into cells, or null. */
function parseTableCells(line: string): string[] | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  if (TABLE_ROW.test(trimmed)) {
    const cells = trimmed
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim())
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return null // markdown separator row
    return cells
  }

  // "A | B | C" without outer pipes
  if (trimmed.includes('|') && !hasOptionGlyph(trimmed) && !hasFillRun(trimmed)) {
    const cells = trimmed.split('|').map((c) => c.trim())
    if (cells.filter((c) => c.length > 0).length >= 2) return cells
  }

  return null
}

/**
 * Split a line into columns by tabs / 2+ spaces. Returns null when the line
 * does not look like a tabular row (options, fill-in blanks, single cell…).
 */
function splitAlignedCells(line: string): string[] | null {
  const trimmed = line.replace(/\s+$/, '')
  if (!trimmed.trim()) return null
  if (hasOptionGlyph(trimmed) || hasFillRun(trimmed)) return null
  if (MARKDOWN_HEADING.test(trimmed) || SEPARATOR_LINE.test(trimmed)) return null
  if (INSTRUCTION.test(trimmed) || PAGE_NUMBER.test(trimmed)) return null

  const pipe = parseTableCells(trimmed)
  if (pipe) return pipe

  if (!/\t|\s{2,}/.test(trimmed)) return null
  const cells = trimmed
    .split(/\t+|\s{2,}/)
    .map((c) => c.trim())
    .filter((c, idx, arr) => c.length > 0 || (idx > 0 && idx < arr.length - 1))
  if (cells.filter((c) => c).length < 2) return null
  return cells
}

const toPipeRow = (cells: string[]): string => `| ${cells.join(' | ')} |`

const MAX_CELL_CONTINUATION_LINES = 60

/**
 * Turn consecutive space-aligned / pipe-separated lines into markdown table
 * rows so PDF / OCR / plain-text grids become `table` fields.
 */
export function promoteAlignedTables(lines: string[]): string[] {
  const out: string[] = []
  let i = 0
  while (i < lines.length) {
    const headerCells = splitAlignedCells(lines[i])
    if (!headerCells || headerCells.filter((c) => c).length < 2) {
      out.push(lines[i])
      i += 1
      continue
    }

    const block: string[][] = [headerCells]
    let j = i + 1
    while (j < lines.length) {
      const raw = lines[j]
      if (!raw.trim()) break
      const cells = splitAlignedCells(raw)
      // Accept body rows even when only the first column is filled (fixed row labels)
      if (cells && cells.length >= 2) {
        block.push(cells)
        j += 1
        continue
      }
      // Already a markdown/pipe row but too narrow – stop the block
      if (TABLE_ROW.test(raw.trim()) || (raw.includes('|') && !hasOptionGlyph(raw))) {
        break
      }
      // Single short label under a wide header → fixed row label (rating grids)
      const label = raw.trim()
      if (
        headerCells.filter((c) => c).length >= 3 &&
        label.length > 0 &&
        label.length <= 60 &&
        !hasFillRun(label) &&
        !hasOptionGlyph(label) &&
        !MARKDOWN_HEADING.test(label) &&
        !INSTRUCTION.test(label) &&
        !/[?？]$/.test(label)
      ) {
        block.push([label, ...Array(headerCells.length - 1).fill('')])
        j += 1
        continue
      }
      // Wrapped text inside a cell: plain lines sandwiched between rows of the
      // same table ("Work item | 90,000", bullet details…, "Total | 100,000")
      if (block.length >= 2) {
        let k = j
        while (
          k < lines.length &&
          k - j < MAX_CELL_CONTINUATION_LINES &&
          lines[k].trim() &&
          !lines[k].includes('|') &&
          !hasFillRun(lines[k]) &&
          !hasOptionGlyph(lines[k]) &&
          !MARKDOWN_HEADING.test(lines[k])
        ) {
          k += 1
        }
        const next = k > j && k < lines.length ? splitAlignedCells(lines[k]) : null
        if (next && next.length === headerCells.length) {
          const last = block[block.length - 1]
          const extra = lines.slice(j, k).map((l) => l.trim()).join(' ')
          last[0] = [last[0], extra].filter(Boolean).join(' ')
          j = k
          continue
        }
      }
      break
    }

    const multiRows = block.filter((r) => r.filter((c) => c).length >= 2).length
    const isTable = multiRows >= 2 || (headerCells.filter((c) => c).length >= 3 && block.length >= 3)
    if (isTable) {
      const width = Math.max(...block.map((r) => r.length), headerCells.length)
      block.forEach((r) => {
        const padded = [...r, ...Array(Math.max(0, width - r.length)).fill('')]
        out.push(toPipeRow(padded.slice(0, width)))
      })
      i = j
      continue
    }

    out.push(lines[i])
    i += 1
  }
  return out
}

function tokenize(line: string): Token {
  const trimmed = line.trim()
  if (!trimmed) return { kind: 'blank' }
  if (PAGE_NUMBER.test(trimmed)) return { kind: 'blank' }
  const tableCells = parseTableCells(trimmed)
  if (tableCells) {
    return { kind: 'table-row', cells: tableCells }
  }
  if (SEPARATOR_LINE.test(trimmed)) return { kind: 'separator' }

  const heading = trimmed.match(MARKDOWN_HEADING)
  if (heading) return { kind: 'heading', text: cleanLabel(heading[2]), level: heading[1].length }

  if (SELECT_PLACEHOLDER.test(trimmed)) return { kind: 'placeholder', as: 'dropdown', raw: trimmed }
  if (DATE_PLACEHOLDER.test(trimmed)) return { kind: 'placeholder', as: 'date', raw: trimmed }

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
      if (textLength(value) <= 40 || textLength(key) <= 30) {
        // A sample value (pre-filled form) – keep the field, drop the value.
        // Long answers ("ที่อยู่: 107/315 …") become multi-line inputs.
        const { label, required } = stripRequired(key)
        let type = inferInputType(label)
        if (type === 'text' && textLength(value) > 40) type = 'textarea'
        const field: ImportedField = { type, label, source: trimmed }
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
  // Need at least a header + one body row; a lone multi-column line is usually
  // side-by-side fields (e.g. "Name ____  Date ____"), not a table.
  if (rows.length < 2) return null
  const width = Math.max(...rows.map((r) => r.length))
  if (width < 2) return null
  const padded = rows.map((r) => [...r, ...Array(width - r.length).fill('')])
  const header = padded[0].map((c, i) => c || `Column ${i + 1}`)
  const body = padded.slice(1)

  // Fixed row labels: first column filled, the rest (mostly) empty
  const fillOnly = new RegExp(`^\\s*(?:${FILL_RUN.source})\\s*$`)
  const isBlank = (c: string) => !c || isPunctuationOnly(c) || fillOnly.test(c)
  const hasRowLabels =
    body.length > 0 && body.every((r) => !isBlank(r[0]) && r.slice(1).every(isBlank))

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

/**
 * A grid whose cells are all "Label ______" is a side-by-side layout of inputs
 * (e.g. buyer details | vendor details), not a data table. An optional first
 * row without blanks gives the column headings.
 */
function buildFieldGrid(rows: string[][], source: string): ImportedField | null {
  const width = Math.max(...rows.map((r) => r.length))
  if (width < 2 || width > 4) return null
  const cellField = (cell: string): ImportedField | null => {
    const fill = splitFillLine(cell)
    if (!fill || fill.leadingLabelMissing || fill.fields.length !== 1 || !fill.fields[0].label) return null
    return fill.fields[0]
  }
  const first = rows[0].map((c) => c.trim())
  const hasHeader = first.some(Boolean) && !first.some(hasFillRun)
  const body = hasHeader ? rows.slice(1) : rows
  if (body.length < (hasHeader ? 1 : 2)) return null

  const grid: Array<Array<ImportedField | null>> = []
  const ok = body.every((r) => {
    const cells = Array.from({ length: width }, (_, i) => (r[i] || '').trim())
    const line = cells.map((c) => (c ? cellField(c) : null))
    if (cells.some((c, i) => c && !line[i]) || line.every((f) => !f)) return false
    grid.push(line)
    return true
  })
  if (!ok) return null

  const field: ImportedField = { type: 'row', grid, source }
  if (hasHeader) field.columns = Array.from({ length: width }, (_, i) => cleanLabel(first[i] || ''))
  return field
}

/** Turn a single multi-column line into inputs / a column row. */
function fieldsFromTableRow(cells: string[], source: string): ImportedField[] {
  const list: ImportedField[] = []
  cells.forEach((cell) => {
    const text = cell.trim()
    if (!text) return
    const fill = splitFillLine(text)
    if (fill && fill.fields.length > 0) {
      fill.fields.forEach((f) => {
        if (!f.label) f.label = `Field ${list.length + 1}`
        list.push(f)
      })
      return
    }
    const { label, required } = stripRequired(text)
    if (!label || isPunctuationOnly(label)) return
    const field: ImportedField = { type: inferInputType(label), label, source }
    if (required) field.required = true
    list.push(field)
  })
  return list
}

export type TextToSchemaOptions = {
  /** Use the first short line as the form title / Header (default true) */
  detectTitle?: boolean
}

export function textToFormSchema(rawText: string, options: TextToSchemaOptions = {}): ImportedFormSchema {
  const { detectTitle = true } = options
  const rawLines = normalize(rawText)
    .split(/\f|\n/)
    .map((l) => l.replace(/\s+$/, ''))
  // Promote space-aligned grids (PDF / OCR / plain text) to markdown table rows
  // before tokenising so they become Table fields instead of loose labels.
  const lines = promoteAlignedTables(rawLines)

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

  /** Adopt the standalone Label line directly above as a field label. */
  const takeLabelField = (): { label: string; required: boolean } | null => {
    const prev = fields[fields.length - 1]
    if (!prev || prev.type !== 'label' || !prev.label || textLength(prev.label) > 80) return null
    fields.pop()
    const result = stripRequired(prev.label)
    return result.label ? result : null
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
    const grid = buildFieldGrid(rows, tableSource)
    if (grid) {
      flushPending()
      fields.push(grid)
      return
    }
    const table = buildTable(rows, tableSource)
    if (table) {
      const taken = takePendingLabel()
      const prev = fields[fields.length - 1]
      if (taken?.label) {
        table.label = taken.label
      } else if (prev?.type === 'label' && prev.label && textLength(prev.label) <= 60) {
        // A caption line right above the grid ("รายละเอียดงาน") names the table
        fields.pop()
        table.label = prev.label
      }
      fields.push(table)
      return
    }
    // Lone multi-column line → side-by-side fields, not a 1-row table
    if (rows.length === 1) {
      const list = fieldsFromTableRow(rows[0], tableSource)
      if (list.length > 0) {
        flushPending()
        fields.push(wrapRow(list, tableSource))
      }
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
        } else if (token.level >= 2 || SECTION_HEADING.test(token.text)) {
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
          // Options on their own lines take the question above as their label
          const taken = takePendingLabel() || takeLabelField()
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

      case 'placeholder': {
        flushOptions()
        sawContent = true
        const taken = takePendingLabel() || takeLabelField()
        if (taken?.label) {
          const field: ImportedField = { type: token.as, label: taken.label, source: token.raw }
          if (taken.required) field.required = true
          fields.push(field)
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
          } else {
            // Previous standalone text line was the label
            const prev = takeLabelField()
            if (prev) {
              list[0].label = prev.label
              list[0].type = inferInputType(prev.label)
              if (prev.required) list[0].required = true
            }
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

        // "Name *" – a required marker means this is a field label, even when the
        // input itself was not captured (e.g. borderless inputs in a print)
        if (/\*\s*$/.test(text) && textLength(text) <= 80) {
          flushPending()
          pending = { label: text, required: false, raw: text }
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
