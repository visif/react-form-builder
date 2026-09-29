import type { ExtractedText, FormImportAdapter, ImportContext, OcrOptions } from '../types'
import { detectFileKind } from './fileKind'

export type OcrSource = File | Blob | HTMLCanvasElement | HTMLImageElement | string

type TesseractWorker = {
  setParameters: (params: Record<string, string>) => Promise<unknown>
  recognize: (
    image: OcrSource,
    options?: Record<string, unknown>,
    output?: Record<string, boolean>
  ) => Promise<{ data: { text: string } }>
  terminate: () => Promise<unknown>
}

type TesseractModule = {
  createWorker: (
    langs?: string | string[],
    oem?: number,
    options?: Record<string, unknown>
  ) => Promise<TesseractWorker>
}

export const DEFAULT_OCR_LANGUAGES = ['eng', 'tha']

async function loadTesseract(): Promise<TesseractModule> {
  const mod = (await import('tesseract.js')) as unknown as TesseractModule & { default?: TesseractModule }
  return (mod.default && mod.default.createWorker ? mod.default : mod) as TesseractModule
}

export class OcrDisabledError extends Error {
  constructor() {
    super('Built-in OCR is disabled. Provide a custom import adapter for images and scanned PDFs.')
    this.name = 'OcrDisabledError'
  }
}

/**
 * Run tesseract.js on one or more images and return the recognised text.
 * Worker, core and language data are fetched from the CDN unless overridden
 * through `ocr.workerPath` / `ocr.corePath` / `ocr.langPath`.
 */
export async function ocrImages(
  sources: OcrSource[],
  ctx: ImportContext = {},
  ocrOptions: OcrOptions = ctx.ocr || {}
): Promise<string[]> {
  if (ocrOptions.disabled) throw new OcrDisabledError()
  const { createWorker } = await loadTesseract()
  const langs = ocrOptions.languages && ocrOptions.languages.length > 0 ? ocrOptions.languages : DEFAULT_OCR_LANGUAGES

  const workerOptions: Record<string, unknown> = {
    logger: (m: { status?: string; progress?: number }) => {
      if (!ctx.onProgress) return
      const status = m.status || 'ocr'
      const pct = typeof m.progress === 'number' ? Math.round(m.progress * 100) : undefined
      if (status === 'recognizing text') {
        ctx.onProgress({ step: 'ocr', message: 'Recognising text…', percent: pct })
      } else if (/loading|initializ|download/i.test(status)) {
        ctx.onProgress({ step: 'ocr', message: `OCR engine: ${status}…`, percent: pct })
      }
    },
  }
  if (ocrOptions.workerPath) workerOptions.workerPath = ocrOptions.workerPath
  if (ocrOptions.corePath) workerOptions.corePath = ocrOptions.corePath
  if (ocrOptions.langPath) workerOptions.langPath = ocrOptions.langPath

  ctx.onProgress?.({ step: 'ocr', message: 'Starting OCR engine…' })
  const worker = await createWorker(langs, 1, workerOptions)
  try {
    await worker.setParameters({ preserve_interword_spaces: '1' })
    const results: string[] = []
    for (let i = 0; i < sources.length; i += 1) {
      if (ctx.signal?.aborted) throw new DOMException('Import cancelled', 'AbortError')
      ctx.onProgress?.({
        step: 'ocr',
        message: sources.length > 1 ? `Recognising page ${i + 1} of ${sources.length}…` : 'Recognising text…',
      })
      // eslint-disable-next-line no-await-in-loop
      const { data } = await worker.recognize(sources[i], {}, { text: true })
      results.push(data.text || '')
    }
    return results
  } finally {
    await worker.terminate()
  }
}

export async function extractImage(file: File, ctx: ImportContext = {}): Promise<ExtractedText> {
  ctx.onProgress?.({ step: 'reading', message: 'Loading image…', percent: 5 })
  const [text] = await ocrImages([file], ctx)
  ctx.onProgress?.({ step: 'analyzing', message: 'Detecting fields…', percent: 90 })
  return { kind: 'text', text, meta: { extractor: 'ocr', engine: 'tesseract.js' } }
}

export const imageAdapter: FormImportAdapter = {
  name: 'built-in:image-ocr',
  accepts: (file) => detectFileKind(file) === 'image',
  extract: extractImage,
}

export default imageAdapter
