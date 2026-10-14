import type {
  ExtractResult,
  FormImportAdapter,
  ImportContext,
  ImportedField,
  ImportedFormSchema,
} from '../types'
import { detectFileKind } from './fileKind'
import { normalizeGlyphs } from './htmlToText'
import { ocrImages } from './ocr'
import {
  annotateItemsWithShapes,
  collectShapes,
  dropDuplicatePages,
  type PageLine,
  type PdfTextItem,
  stripRunningLines,
} from './pdfLayout'

type TextItem = PdfTextItem

type PdfPage = {
  getTextContent: () => Promise<{ items: Array<TextItem | { type: string }> }>
  getAnnotations: () => Promise<Array<Record<string, unknown>>>
  getOperatorList: () => Promise<{ fnArray: number[]; argsArray: unknown[][] }>
  getViewport: (opts: { scale: number }) => { width: number; height: number }
  render: (params: Record<string, unknown>) => { promise: Promise<void> }
}

type PdfDocument = {
  numPages: number
  getPage: (n: number) => Promise<PdfPage>
  destroy?: () => Promise<void>
}

type PdfjsModule = {
  version: string
  OPS: Record<string, number>
  GlobalWorkerOptions: { workerSrc: string }
  getDocument: (params: Record<string, unknown>) => { promise: Promise<PdfDocument> }
}

async function loadPdfjs(workerSrc?: string): Promise<PdfjsModule> {
  const mod = (await import('pdfjs-dist')) as unknown as PdfjsModule & { default?: PdfjsModule }
  const pdfjs = (mod.default && mod.default.getDocument ? mod.default : mod) as PdfjsModule
  if (workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc
  } else if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
  }
  return pdfjs
}

/* -------------------------------------------------------------------------- */
/* Text layer → lines                                                          */
/* -------------------------------------------------------------------------- */

// Thai above/below vowels and tone marks take no horizontal advance of their own
const THAI_COMBINING = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g

/**
 * pdf.js reports width 0 for Thai syllables that end in a combining mark
 * ("รั", "ที่"), which would make the following glyph look like a new word.
 * Estimate the advance from the number of spacing characters instead.
 */
const estimateWidth = (str: string, size: number): number => {
  const spacing = str.replace(THAI_COMBINING, '').replace(/\s/g, '').length
  return Math.max(spacing, 1) * size * 0.6
}

export function textItemsToLines(items: TextItem[]): string[] {
  return textItemsToPageLines(items).map((l) => l.text)
}

/** Like `textItemsToLines`, keeping each line's baseline y (PDF space). */
export function textItemsToPageLines(items: TextItem[]): PageLine[] {
  // Whitespace-only items are dropped: pdf.js inserts them mid-syllable in Thai
  // text ("รั", " ", "บมอบงาน"), and word gaps are recovered from geometry below.
  const usable = items.filter(
    (it) => typeof it.str === 'string' && it.str.trim() !== '' && Array.isArray(it.transform)
  )
  if (usable.length === 0) return []

  type Line = { y: number; size: number; items: Array<{ x: number; end: number; str: string }> }
  const lines: Line[] = []

  usable.forEach((it) => {
    const x = it.transform[4]
    const y = it.transform[5]
    const size = Math.abs(it.transform[3]) || Math.abs(it.transform[0]) || 10
    const width = it.width || estimateWidth(it.str, size)
    const tolerance = Math.max(2, size * 0.45)
    let line = lines.find((l) => Math.abs(l.y - y) <= tolerance)
    if (!line) {
      line = { y, size, items: [] }
      lines.push(line)
    }
    line.items.push({ x, end: x + width, str: it.str })
  })

  lines.sort((a, b) => b.y - a.y) // PDF y grows upward

  return lines.map((line) => {
    line.items.sort((a, b) => a.x - b.x)
    const cells: string[] = []
    let current = ''
    let prevEnd: number | null = null
    line.items.forEach((seg) => {
      if (prevEnd !== null) {
        const gap = seg.x - prevEnd
        if (gap > line.size * 2.5) {
          // Wide gap → column boundary (preserve as separate cells for table detection)
          if (current.trim()) cells.push(normalizeGlyphs(current).replace(/[ \t]+/g, ' ').trim())
          current = seg.str
          prevEnd = seg.end
          return
        }
        if (gap > line.size * 0.15) current += ' '
      }
      current += seg.str
      prevEnd = seg.end
    })
    if (current.trim()) cells.push(normalizeGlyphs(current).replace(/[ \t]+/g, ' ').trim())

    // Multi-column PDF lines become markdown-lite table rows so textToFormSchema
    // can detect them. Single-cell lines stay plain text.
    const text = cells.length >= 2 ? `| ${cells.join(' | ')} |` : cells[0] || ''
    return { y: line.y, text }
  })
}

/* -------------------------------------------------------------------------- */
/* AcroForm widgets → schema                                                   */
/* -------------------------------------------------------------------------- */

type Widget = {
  page: number
  x: number
  y: number
  fieldName: string
  fieldType: string | null
  alternativeText?: string
  multiLine?: boolean
  checkBox?: boolean
  radioButton?: boolean
  buttonValue?: string | null
  combo?: boolean
  options?: Array<{ exportValue: string; displayValue: string }>
  required?: boolean
  maxLen?: number
}

const REQUIRED_FLAG = 2

const prettifyName = (name: string): string => {
  const last = name.split('.').pop() || name
  return last
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
}

export function widgetsToSchema(widgets: Widget[]): ImportedFormSchema {
  const ordered = [...widgets].sort((a, b) => a.page - b.page || b.y - a.y || a.x - b.x)
  const fields: ImportedField[] = []
  const radioGroups = new Map<string, ImportedField>()
  const checkboxGroups = new Map<string, ImportedField>()

  ordered.forEach((w) => {
    const label = (w.alternativeText || '').trim() || prettifyName(w.fieldName)
    if (w.fieldType === 'Btn') {
      if (w.radioButton) {
        const existing = radioGroups.get(w.fieldName)
        const option = String(w.buttonValue ?? '').trim() || `Option ${(existing?.options?.length || 0) + 1}`
        if (existing) {
          existing.options = [...(existing.options || []), option]
        } else {
          const field: ImportedField = { type: 'radio', label, options: [option], required: w.required }
          radioGroups.set(w.fieldName, field)
          fields.push(field)
        }
        return
      }
      if (w.checkBox) {
        // Group check boxes that share a parent name ("interests.sports" → "interests")
        const parent = w.fieldName.includes('.') ? w.fieldName.slice(0, w.fieldName.lastIndexOf('.')) : ''
        const option = (w.alternativeText || '').trim() || prettifyName(w.fieldName)
        if (parent) {
          const existing = checkboxGroups.get(parent)
          if (existing) {
            existing.options = [...(existing.options || []), option]
            return
          }
          const field: ImportedField = {
            type: 'checkboxes',
            label: prettifyName(parent),
            options: [option],
            required: w.required,
          }
          checkboxGroups.set(parent, field)
          fields.push(field)
          return
        }
        fields.push({ type: 'checkboxes', label, options: [option], required: w.required })
      }
      return
    }
    if (w.fieldType === 'Ch') {
      const options = (w.options || []).map((o) => o.displayValue || o.exportValue).filter(Boolean)
      fields.push({ type: 'dropdown', label, options, required: w.required })
      return
    }
    if (w.fieldType === 'Tx') {
      const type: ImportedField['type'] = w.multiLine
        ? 'textarea'
        : /date|วันที่/i.test(label)
          ? 'date'
          : /amount|qty|number|จำนวน|ราคา/i.test(label)
            ? 'number'
            : 'text'
      fields.push({ type, label, required: w.required })
      return
    }
    if (w.fieldType === 'Sig') {
      fields.push({ type: 'signature', label })
    }
  })

  return { fields, meta: { extractor: 'pdf-acroform', widgetCount: widgets.length } }
}

async function collectWidgets(doc: PdfDocument): Promise<Widget[]> {
  const widgets: Widget[] = []
  for (let p = 1; p <= doc.numPages; p += 1) {
    // eslint-disable-next-line no-await-in-loop
    const page = await doc.getPage(p)
    // eslint-disable-next-line no-await-in-loop
    const annotations = await page.getAnnotations()
    annotations.forEach((a) => {
      if (a.subtype !== 'Widget' || !a.fieldName) return
      if (a.hidden || a.pushButton) return
      const rect = (a.rect as number[]) || [0, 0, 0, 0]
      widgets.push({
        page: p,
        x: rect[0],
        y: rect[3],
        fieldName: String(a.fieldName),
        fieldType: (a.fieldType as string) || null,
        alternativeText: a.alternativeText as string,
        multiLine: Boolean(a.multiLine),
        checkBox: Boolean(a.checkBox),
        radioButton: Boolean(a.radioButton),
        buttonValue: a.buttonValue as string | null,
        combo: Boolean(a.combo),
        options: a.options as Widget['options'],
        // eslint-disable-next-line no-bitwise
        required: (Number(a.fieldFlags) & REQUIRED_FLAG) !== 0,
      })
    })
  }
  return widgets
}

/* -------------------------------------------------------------------------- */
/* Page rendering for OCR                                                      */
/* -------------------------------------------------------------------------- */

async function renderPageToCanvas(page: PdfPage, scale: number): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  const canvasContext = canvas.getContext('2d')
  await page.render({ canvas, canvasContext, viewport }).promise
  return canvas
}

/* -------------------------------------------------------------------------- */
/* Adapter                                                                     */
/* -------------------------------------------------------------------------- */

export async function extractPdf(file: File, ctx: ImportContext = {}): Promise<ExtractResult> {
  const pdfOptions = ctx.pdf || {}
  const minChars = pdfOptions.minTextCharsPerPage ?? 40

  ctx.onProgress?.({ step: 'reading', message: 'Reading PDF…', percent: 5 })
  const buffer = await file.arrayBuffer()
  const pdfjs = await loadPdfjs(pdfOptions.workerSrc)
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false }).promise

  try {
    // 1. Fillable PDF → use the form fields directly
    ctx.onProgress?.({ step: 'extracting', message: 'Looking for form fields…', percent: 15 })
    const widgets = await collectWidgets(doc)
    if (widgets.length >= 2) {
      const schema = widgetsToSchema(widgets)
      // Add the visible title (first text line of page 1) as a header
      const firstPage = await doc.getPage(1)
      const content = await firstPage.getTextContent()
      const [firstLine] = textItemsToLines(content.items as TextItem[]).filter(Boolean)
      if (firstLine && firstLine.length <= 90) {
        schema.title = firstLine
        schema.fields.unshift({ type: 'header', label: firstLine })
      }
      return { kind: 'schema', schema }
    }

    // 2. Text layer + drawn controls, page by page; OCR pages that have (almost) no text
    const pages: Array<{ height: number; lines: PageLine[]; strings: string[] }> = []
    const ocrTargets: Array<{ index: number; canvas: HTMLCanvasElement }> = []
    for (let p = 1; p <= doc.numPages; p += 1) {
      ctx.onProgress?.({
        step: 'extracting',
        message: `Extracting text from page ${p} of ${doc.numPages}…`,
        percent: 15 + Math.round((p / doc.numPages) * 50),
      })
      // eslint-disable-next-line no-await-in-loop
      const page = await doc.getPage(p)
      // eslint-disable-next-line no-await-in-loop
      const content = await page.getTextContent()
      const viewport = page.getViewport({ scale: 1 })
      const rawItems = (content.items as TextItem[]).filter((it) => typeof it.str === 'string')
      const strings = rawItems.map((it) => it.str).filter((s) => s.trim())
      let items = rawItems
      try {
        // eslint-disable-next-line no-await-in-loop
        const ops = await page.getOperatorList()
        items = annotateItemsWithShapes(rawItems, collectShapes(ops, pdfjs.OPS), viewport.width)
      } catch {
        // Drawn controls are a best-effort hint; fall back to the text layer
      }
      const chars = strings.join('').replace(/\s/g, '').length
      if (chars >= minChars) {
        pages.push({ height: viewport.height, lines: textItemsToPageLines(items), strings })
      } else {
        pages.push({ height: viewport.height, lines: [], strings: [] })
        if (!ctx.ocr?.disabled && typeof document !== 'undefined') {
          // eslint-disable-next-line no-await-in-loop
          const canvas = await renderPageToCanvas(page, pdfOptions.ocrScale ?? 2)
          ocrTargets.push({ index: p - 1, canvas })
        }
      }
    }

    const duplicates = dropDuplicatePages(pages.map((pg) => pg.strings))
    const pageTexts = stripRunningLines(pages).map((lines, i) => (duplicates.has(i) ? '' : lines.map((l) => l.text).join('\n')))

    let ocrPages = 0
    if (ocrTargets.length > 0) {
      const texts = await ocrImages(
        ocrTargets.map((t) => t.canvas),
        ctx
      )
      texts.forEach((text, i) => {
        pageTexts[ocrTargets[i].index] = text
      })
      ocrPages = ocrTargets.length
    }

    ctx.onProgress?.({ step: 'analyzing', message: 'Detecting fields…', percent: 90 })
    return {
      kind: 'text',
      text: pageTexts.filter((t) => t.trim()).join('\n\f\n'),
      meta: { extractor: 'pdf', pages: doc.numPages, ocrPages, duplicatePages: duplicates.size },
    }
  } finally {
    if (doc.destroy) await doc.destroy().catch(() => undefined)
  }
}

export const pdfAdapter: FormImportAdapter = {
  name: 'built-in:pdf',
  accepts: (file) => detectFileKind(file) === 'pdf',
  extract: extractPdf,
}

export default pdfAdapter
