/* eslint-disable no-continue */
import { IMPORT_TEXT_PATTERNS } from '../textToSchema'
import type { ExtractedSheets, FormImportAdapter, ImportContext, SheetMergeRange } from '../types'
import { detectFileKind } from './fileKind'
import { normalizeGlyphs } from './htmlToText'

type XlsxModule = {
  read: (data: ArrayBuffer | Uint8Array, opts: Record<string, unknown>) => {
    SheetNames: string[]
    Sheets: Record<string, Record<string, unknown>>
  }
  utils: {
    sheet_to_json: (sheet: unknown, opts: Record<string, unknown>) => unknown[]
  }
}

async function loadXlsx(): Promise<XlsxModule> {
  const mod = (await import('xlsx')) as unknown as XlsxModule & { default?: XlsxModule }
  return (mod.default && mod.default.read ? mod.default : mod) as XlsxModule
}

const cleanCell = (c: unknown): string => normalizeGlyphs(String(c ?? '')).replace(/\s+/g, ' ').trim()

const filledCells = (row: string[]): string[] => row.filter((c) => c)

const OPTION_GLYPH = new RegExp(
  `${IMPORT_TEXT_PATTERNS.CHECKBOX_GLYPH.source}|${IMPORT_TEXT_PATTERNS.RADIO_GLYPH.source}`
)
const FILL_ONLY = new RegExp(`^\\s*(?:${IMPORT_TEXT_PATTERNS.FILL_RUN.source})\\s*$`)

const isMergedAcrossColumns = (merges: SheetMergeRange[], r: number, c: number): boolean =>
  merges.some((m) => m.s.r <= r && r <= m.e.r && m.s.c <= c && c <= m.e.c && m.e.c > m.s.c)

const KEY_CELL = /[:：]\s*$/

/** "SPECIFICATIONS & ITEMIZED QUOTATION" – spreadsheet templates mark headings with caps. */
const isHeadingText = (text: string): boolean => {
  const letters = text.replace(/[^A-Za-z]/g, '')
  return (
    letters.length >= 4 &&
    letters === letters.toUpperCase() &&
    text.length <= 80 &&
    !KEY_CELL.test(text) &&
    !FILL_ONLY.test(text)
  )
}

const filledIndexes = (row: string[]): number[] =>
  row.reduce<number[]>((acc, c, idx) => (c ? [...acc, idx] : acc), [])

/** "Label:" cells each followed by a sample value (or nothing): a pre-filled form row. */
const isKeyValueRow = (row: string[]): boolean => {
  const idx = filledIndexes(row)
  if (idx.length === 0 || !KEY_CELL.test(row[idx[0]]) || row[idx[0]].length > 60) return false
  const keys = idx.filter((i) => KEY_CELL.test(row[i])).length
  return keys * 2 >= idx.length || !row[idx[0] + 1]
}

/** "Name: | Jane | Date: | 2026-01-01" → "Name ______ Date ______" (sample values dropped). */
const keyValueText = (row: string[], from = 0, to = row.length): string =>
  row
    .slice(from, to)
    .filter((c) => KEY_CELL.test(c))
    .map((c) => `${c.replace(KEY_CELL, '').trim()} ______`)
    .join(' ')

const keyColumns = (row: string[]): number[] => filledIndexes(row).filter((i) => KEY_CELL.test(row[i]))

/** Side-by-side label blocks → `| Label ______ | Label ______ |` rows (optional heading row). */
const pushFieldGrid = (out: string[], headings: string[] | null, block: string[][], starts: number[]) => {
  if (headings) out.push(`| ${headings.join(' | ')} |`)
  block.forEach((r) => {
    out.push(`| ${starts.map((s, k) => keyValueText(r, s, starts[k + 1])).join(' | ')} |`)
  })
  out.push('')
}

/**
 * Convert spreadsheet grids into markdown-lite text:
 *  - a header row with ≥2 filled cells followed by rows that also have ≥2
 *    filled cells (or, for wide headers, rows with only a first-column label)
 *    becomes a `| a | b |` table
 *  - a single row with several short labels becomes `label ____ label ____`
 *  - a lone label with empty cells to its right (and not merged across
 *    columns) becomes `label ____`; merged / lone cells stay plain lines
 */
export function sheetsToText(sheets: ExtractedSheets['sheets']): string {
  const out: string[] = []

  sheets.forEach((sheet, sheetIndex) => {
    const merges = sheet.merges || []
    const rows = sheet.rows.map((r) => r.map(cleanCell))
    if (rows.every((r) => filledCells(r).length === 0)) return
    if (sheets.length > 1 && sheetIndex > 0) out.push('', '------', `# ${sheet.name}`)

    let sawContent = false
    let i = 0
    while (i < rows.length) {
      const row = rows[i]
      const filled = filledCells(row)

      if (filled.length === 0) {
        out.push('')
        i += 1
        continue
      }

      if (filled.length === 1 && isHeadingText(filled[0])) {
        out.push(`## ${filled[0]}`)
        sawContent = true
        i += 1
        continue
      }

      if (filled.length <= 4 && filled.every(isHeadingText)) {
        // Side-by-side sections ("Buyer details | Vendor details"): left block, then right.
        // Without label rows below, a caps row is more likely a table header.
        const starts = filledIndexes(row)
        let j = i + 1
        while (j < rows.length && isKeyValueRow(rows[j])) j += 1
        if (j > i + 1) {
          pushFieldGrid(out, filled, rows.slice(i + 1, j), starts)
          sawContent = true
          i = j
          continue
        }
      }

      if (isKeyValueRow(row)) {
        // Rows with labels in the same columns keep their side-by-side layout
        const starts = keyColumns(row)
        let j = i + 1
        while (
          starts.length >= 2 &&
          j < rows.length &&
          isKeyValueRow(rows[j]) &&
          keyColumns(rows[j]).join() === starts.join()
        ) {
          j += 1
        }
        if (starts.length >= 2) pushFieldGrid(out, null, rows.slice(i, j), starts)
        else out.push(keyValueText(row))
        sawContent = true
        i = j
        continue
      }

      if (filled.length >= 2 && !row.some((c) => OPTION_GLYPH.test(c))) {
        // Look ahead for a table block
        let j = i + 1
        while (j < rows.length) {
          const next = rows[j]
          const nextFilled = filledCells(next)
          if (next.some((c) => OPTION_GLYPH.test(c)) || isKeyValueRow(next)) break
          if (nextFilled.length >= 2) {
            j += 1
            continue
          }
          if (nextFilled.length === 1 && next[0] && filled.length >= 3) {
            j += 1 // row label under a wide header (rating grid)
            continue
          }
          break
        }
        const block = rows.slice(i, j)
        const multiRows = block.filter((r) => filledCells(r).length >= 2).length
        const isTable = multiRows >= 2 || (filled.length >= 3 && block.length >= 3)
        if (isTable) {
          const lastFilledCol = Math.max(
            ...block.map((r) => r.reduce((acc, c, idx) => (c ? idx : acc), -1))
          )
          const cols = lastFilledCol + 1
          block.forEach((r) => {
            const cells = Array.from({ length: cols }, (_, idx) => r[idx] || '')
            out.push(`| ${cells.join(' | ')} |`)
          })
          out.push('')
          sawContent = true
          i = j
          continue
        }
      }

      if (filled.length === 1) {
        const col = row.findIndex((c) => c)
        const text = row[col]
        const hasCellsToTheRight = row.length > col + 1
        const merged = isMergedAcrossColumns(merges, i, col)
        const looksLikeLabel = text.length <= 60 && !/[.。!?]$/.test(text) && !FILL_ONLY.test(text)
        if (sawContent && hasCellsToTheRight && !merged && looksLikeLabel && !OPTION_GLYPH.test(text)) {
          out.push(`${text} ______`)
        } else {
          out.push(text)
        }
        sawContent = true
        i += 1
        continue
      }

      // Several cells on one row: labels with blanks or inline options
      sawContent = true
      const hasOptions = row.some((c) => OPTION_GLYPH.test(c))
      if (hasOptions) {
        out.push(row.filter(Boolean).join(' '))
      } else {
        const parts: string[] = []
        row.forEach((cell, idx) => {
          if (!cell) return
          const next = row[idx + 1]
          const nextIsBlank = next === undefined || next === '' || FILL_ONLY.test(next)
          if (FILL_ONLY.test(cell)) {
            parts.push('______')
          } else if (nextIsBlank) {
            parts.push(`${cell} ______`)
          } else {
            parts.push(cell)
          }
        })
        out.push(parts.join(' '))
      }
      i += 1
    }
  })

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export async function extractSheets(file: File, ctx: ImportContext = {}): Promise<ExtractedSheets> {
  ctx.onProgress?.({ step: 'reading', message: 'Reading spreadsheet…', percent: 10 })
  const buffer = await file.arrayBuffer()
  const XLSX = await loadXlsx()
  ctx.onProgress?.({ step: 'extracting', message: 'Reading sheets…', percent: 40 })
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array', cellText: true })
  const sheets = workbook.SheetNames.map((name) => {
    const ws = workbook.Sheets[name]
    const rows = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      raw: false,
      defval: '',
      blankrows: true,
    }) as unknown[][]
    return {
      name,
      rows: rows.map((r) => r.map((c) => String(c ?? ''))),
      merges: (ws['!merges'] as SheetMergeRange[] | undefined) || [],
    }
  })
  ctx.onProgress?.({ step: 'analyzing', message: 'Detecting fields…', percent: 80 })
  return { kind: 'sheets', sheets, meta: { extractor: 'sheets', sheetCount: sheets.length } }
}

export const sheetAdapter: FormImportAdapter = {
  name: 'built-in:sheets',
  accepts: (file) => detectFileKind(file) === 'sheet',
  extract: extractSheets,
}

export default sheetAdapter
