import type { FormElementData } from '../types/form'

/**
 * Intermediate, renderer-agnostic description of a form extracted from a
 * document. Adapters (built-in or consumer supplied) produce this; the
 * builder converts it into `FormElementData[]` with `schemaToFormElements`.
 */
export type ImportedFieldType =
  | 'header'
  | 'section'
  | 'paragraph'
  | 'label'
  | 'linebreak'
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'checkboxes'
  | 'radio'
  | 'rating'
  | 'signature'
  | 'fileupload'
  | 'imageupload'
  | 'camera'
  | 'table'
  /** Horizontal group of 2–4 fields rendered as a Two/Three/FourColumnRow */
  | 'row'

export type ImportedField = {
  type: ImportedFieldType
  /** Field label (inputs) or display text (header/paragraph/label/section) */
  label?: string
  required?: boolean
  /** Options for dropdown / checkboxes / radio */
  options?: string[]
  /** Table column headers */
  columns?: string[]
  /** Table fixed row labels (first column) */
  rowLabels?: string[]
  /** Table row count when there are no fixed row labels */
  rows?: number
  /** Children for `row` */
  children?: ImportedField[]
  /**
   * Multi-row layout for `row`: one array of cells per line (`null` = empty cell).
   * Takes precedence over `children`; `columns` become the column headers.
   */
  grid?: Array<Array<ImportedField | null>>
  /** Optional placeholder / help text */
  description?: string
  /** 0–1 confidence reported by the extractor (informational) */
  confidence?: number
  /** Raw source line the field came from (informational, shown in preview) */
  source?: string
}

export type ImportedFormSchema = {
  title?: string
  fields: ImportedField[]
  /** Free-form metadata from the extractor (page count, OCR engine, …) */
  meta?: Record<string, unknown>
}

/** Text lines with optional page grouping, as produced by text extractors. */
export type ExtractedText = {
  kind: 'text'
  /** Plain text; lines separated by `\n`, pages by `\f` (optional) */
  text: string
  meta?: Record<string, unknown>
}

/** Tabular data from spreadsheets: one 2-D grid per sheet. */
export type SheetMergeRange = { s: { r: number; c: number }; e: { r: number; c: number } }

export type ExtractedSheets = {
  kind: 'sheets'
  sheets: Array<{
    name: string
    /** Cell text, one array per row (padded to the sheet width) */
    rows: string[][]
    /** Merged ranges (0-based, inclusive) – used to tell titles from label/input pairs */
    merges?: SheetMergeRange[]
  }>
  meta?: Record<string, unknown>
}

/** Already structured schema (e.g. from an AI / Document Intelligence backend). */
export type ExtractedSchema = {
  kind: 'schema'
  schema: ImportedFormSchema
}

export type ExtractResult = ExtractedText | ExtractedSheets | ExtractedSchema

export type ImportProgress = {
  /** Stable step id */
  step: 'reading' | 'extracting' | 'ocr' | 'analyzing' | 'building' | 'done'
  /** Human readable status */
  message: string
  /** 0–100 when known */
  percent?: number
}

export type ImportContext = {
  onProgress?: (progress: ImportProgress) => void
  signal?: AbortSignal
  /** OCR options forwarded to the built-in image / scanned-PDF extractors */
  ocr?: OcrOptions
  /** PDF options forwarded to the built-in PDF extractor */
  pdf?: PdfOptions
}

export type OcrOptions = {
  /** Tesseract language codes, e.g. ['tha', 'eng']. Default: ['eng', 'tha'] */
  languages?: string[]
  /** Override tesseract.js worker / core / language data locations (defaults to CDN) */
  workerPath?: string
  corePath?: string
  langPath?: string
  /** Disable the built-in browser OCR (scanned PDFs / images then need a custom adapter) */
  disabled?: boolean
}

export type PdfOptions = {
  /** URL of `pdf.worker.min.mjs`. Defaults to the jsDelivr CDN for the installed pdfjs version */
  workerSrc?: string
  /** Render scale used when a page has to be OCR'd. Default 2 */
  ocrScale?: number
  /** Minimum characters per page before the page is treated as scanned and OCR'd. Default 40 */
  minTextCharsPerPage?: number
}

/**
 * Pluggable file → schema/text extractor. Consumers can supply adapters to
 * route files to their own OCR / AI service; built-in adapters handle
 * DOCX, XLSX/CSV, PDF and images in the browser.
 */
export type FormImportAdapter = {
  name: string
  /** Return true when this adapter can handle the file */
  accepts: (file: File) => boolean
  extract: (file: File, ctx: ImportContext) => Promise<ExtractResult | ImportedFormSchema | string>
}

export type FormImportConfig = {
  /** Custom adapters tried (in order) before the built-in ones */
  adapters?: FormImportAdapter[]
  /** Skip the built-in browser extractors entirely */
  disableBuiltInAdapters?: boolean
  ocr?: OcrOptions
  pdf?: PdfOptions
  /** Accepted file extensions / MIME types for the picker */
  accept?: string
  /** Max upload size in MB (default 25) */
  maxFileSizeMb?: number
  /**
   * Post-process hook. Return a new schema to override what the user will
   * preview, or nothing to keep the extracted one.
   */
  onSchemaExtracted?: (schema: ImportedFormSchema, file: File) => ImportedFormSchema | void
  /** Called with the generated elements right before they are applied to the canvas */
  onImported?: (elements: FormElementData[], schema: ImportedFormSchema, file: File) => void
}

export type ImportFormResult = {
  schema: ImportedFormSchema
  adapter: string
  elements: FormElementData[]
}
