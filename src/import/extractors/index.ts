import type { ExtractedText, FormImportAdapter, ImportContext } from '../types'
import { docxAdapter } from './docx'
import { detectFileKind } from './fileKind'
import { imageAdapter } from './ocr'
import { pdfAdapter } from './pdf'
import { sheetAdapter } from './sheets'

export async function extractPlainText(file: File, ctx: ImportContext = {}): Promise<ExtractedText> {
  ctx.onProgress?.({ step: 'reading', message: 'Reading text…', percent: 30 })
  const text = await file.text()
  return { kind: 'text', text, meta: { extractor: 'text' } }
}

export const textAdapter: FormImportAdapter = {
  name: 'built-in:text',
  accepts: (file) => detectFileKind(file) === 'text',
  extract: extractPlainText,
}

/** Built-in browser adapters, in matching order. */
export const builtInImportAdapters: FormImportAdapter[] = [
  pdfAdapter,
  docxAdapter,
  sheetAdapter,
  imageAdapter,
  textAdapter,
]

export { docxAdapter, sheetAdapter, pdfAdapter, imageAdapter, detectFileKind }
export { DEFAULT_IMPORT_ACCEPT } from './fileKind'
export { htmlToText } from './htmlToText'
export { sheetsToText } from './sheets'
export { textItemsToLines, widgetsToSchema } from './pdf'
export { ocrImages, DEFAULT_OCR_LANGUAGES, OcrDisabledError } from './ocr'
