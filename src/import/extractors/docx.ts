import type { ExtractedText, FormImportAdapter, ImportContext } from '../types'
import { detectFileKind } from './fileKind'
import { htmlToText } from './htmlToText'

type MammothModule = {
  convertToHtml: (
    input: { arrayBuffer: ArrayBuffer },
    options?: Record<string, unknown>
  ) => Promise<{ value: string; messages: unknown[] }>
}

async function loadMammoth(): Promise<MammothModule> {
  const mod = (await import('mammoth')) as unknown as MammothModule & { default?: MammothModule }
  return (mod.default && mod.default.convertToHtml ? mod.default : mod) as MammothModule
}

export async function extractDocx(file: File, ctx: ImportContext = {}): Promise<ExtractedText> {
  ctx.onProgress?.({ step: 'reading', message: 'Reading document…', percent: 10 })
  const arrayBuffer = await file.arrayBuffer()
  const mammoth = await loadMammoth()
  ctx.onProgress?.({ step: 'extracting', message: 'Extracting document structure…', percent: 40 })
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      ignoreEmptyParagraphs: false,
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Subtitle'] => h2:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        'u => u',
      ],
    }
  )
  const text = htmlToText(result.value)
  ctx.onProgress?.({ step: 'analyzing', message: 'Detecting fields…', percent: 80 })
  return { kind: 'text', text, meta: { extractor: 'docx', html: result.value } }
}

export const docxAdapter: FormImportAdapter = {
  name: 'built-in:docx',
  accepts: (file) => detectFileKind(file) === 'docx',
  extract: extractDocx,
}

export default docxAdapter
