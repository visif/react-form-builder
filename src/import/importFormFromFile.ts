import type { FormElementData } from '../types/form'
import { builtInImportAdapters } from './extractors'
import { htmlToText } from './extractors/htmlToText'
import { sheetsToText } from './extractors/sheets'
import { schemaToFormElements } from './schemaToElements'
import { textToFormSchema } from './textToSchema'
import type {
  ExtractResult,
  FormImportAdapter,
  FormImportConfig,
  ImportContext,
  ImportFormResult,
  ImportedFormSchema,
} from './types'

export class UnsupportedImportFileError extends Error {
  constructor(file: File) {
    super(`No import adapter can handle "${file.name}" (${file.type || 'unknown type'})`)
    this.name = 'UnsupportedImportFileError'
  }
}

const isSchema = (value: unknown): value is ImportedFormSchema =>
  Boolean(value) && typeof value === 'object' && Array.isArray((value as ImportedFormSchema).fields)

/** Turn whatever an adapter returned into a schema. */
export function normalizeExtractResult(raw: ExtractResult | ImportedFormSchema | string): ImportedFormSchema {
  if (typeof raw === 'string') return textToFormSchema(raw)
  if (isSchema(raw)) return raw
  const result = raw as ExtractResult
  switch (result.kind) {
    case 'schema':
      return { ...result.schema, meta: { ...(result.schema.meta || {}) } }
    case 'sheets': {
      const schema = textToFormSchema(sheetsToText(result.sheets))
      return { ...schema, meta: { ...(result.meta || {}), ...(schema.meta || {}) } }
    }
    case 'text': {
      const text = result.meta?.html ? htmlToText(result.text) : result.text
      const schema = textToFormSchema(text)
      return { ...schema, meta: { ...(result.meta || {}), ...(schema.meta || {}) } }
    }
    default:
      throw new Error('Adapter returned an unknown result shape')
  }
}

export function resolveImportAdapters(config: FormImportConfig = {}): FormImportAdapter[] {
  return [...(config.adapters || []), ...(config.disableBuiltInAdapters ? [] : builtInImportAdapters)]
}

export function findImportAdapter(file: File, config: FormImportConfig = {}): FormImportAdapter | undefined {
  return resolveImportAdapters(config).find((adapter) => {
    try {
      return adapter.accepts(file)
    } catch {
      return false
    }
  })
}

/**
 * Extract a form schema from a file using the first adapter that accepts it.
 */
export async function extractFormSchema(
  file: File,
  config: FormImportConfig = {},
  ctx: Omit<ImportContext, 'ocr' | 'pdf'> = {}
): Promise<{ schema: ImportedFormSchema; adapter: string }> {
  const adapter = findImportAdapter(file, config)
  if (!adapter) throw new UnsupportedImportFileError(file)

  const context: ImportContext = { ...ctx, ocr: config.ocr, pdf: config.pdf }
  const raw = await adapter.extract(file, context)
  let schema = normalizeExtractResult(raw)
  if (!schema.title) {
    const header = schema.fields.find((f) => f.type === 'header')
    if (header?.label) schema.title = header.label
  }
  schema.meta = { ...(schema.meta || {}), adapter: adapter.name, fileName: file.name, fileType: file.type }
  if (config.onSchemaExtracted) {
    const replaced = config.onSchemaExtracted(schema, file)
    if (replaced && isSchema(replaced)) schema = replaced
  }
  return { schema, adapter: adapter.name }
}

/**
 * Full pipeline: file → schema → builder elements.
 */
export async function importFormFromFile(
  file: File,
  config: FormImportConfig = {},
  ctx: Omit<ImportContext, 'ocr' | 'pdf'> & { existingData?: FormElementData[] } = {}
): Promise<ImportFormResult> {
  const { existingData, ...rest } = ctx
  const { schema, adapter } = await extractFormSchema(file, config, rest)
  rest.onProgress?.({ step: 'building', message: 'Building form elements…', percent: 95 })
  const elements = schemaToFormElements(schema, { existingData })
  rest.onProgress?.({ step: 'done', message: 'Done', percent: 100 })
  return { schema, adapter, elements }
}

export default importFormFromFile
