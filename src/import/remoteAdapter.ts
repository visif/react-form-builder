/**
 * Adapters that delegate extraction to consumer code or a backend service
 * (e.g. Azure Document Intelligence, an LLM with vision, or a custom OCR API).
 */
import { detectFileKind, type ImportFileKind } from './extractors/fileKind'
import type { ExtractResult, FormImportAdapter, ImportContext, ImportedFormSchema } from './types'

export type RemoteImportResponse =
  | ImportedFormSchema
  | ExtractResult
  | { schema: ImportedFormSchema }
  | { fields: ImportedFormSchema['fields']; title?: string }
  | { text: string }
  | { markdown: string }
  | { html: string }
  | string

export type RemoteImportAdapterOptions = {
  /** Endpoint that receives the file as multipart/form-data and returns JSON or text */
  url: string
  name?: string
  method?: string
  headers?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>)
  /** Multipart field name for the file (default "file") */
  fieldName?: string
  /** Extra multipart fields */
  extraFields?: Record<string, string> | ((file: File) => Record<string, string>)
  /** Limit which files this adapter handles (default: all) */
  accepts?: (file: File) => boolean
  /** Only handle these kinds (alternative to `accepts`) */
  kinds?: ImportFileKind[]
  /** `fetch` implementation override */
  fetch?: typeof fetch
  /** Map an arbitrary JSON response to something the importer understands */
  parseResponse?: (json: unknown, response: Response) => RemoteImportResponse | Promise<RemoteImportResponse>
}

/** Normalise the flexible remote response shape to an ExtractResult. */
export function normalizeRemoteResponse(payload: RemoteImportResponse): ExtractResult {
  if (typeof payload === 'string') return { kind: 'text', text: payload }
  if (!payload || typeof payload !== 'object') {
    throw new Error('Import service returned an empty response')
  }
  const obj = payload as Record<string, unknown>
  if (obj.kind === 'text' || obj.kind === 'sheets' || obj.kind === 'schema') {
    return payload as ExtractResult
  }
  if (obj.schema && typeof obj.schema === 'object') {
    return { kind: 'schema', schema: obj.schema as ImportedFormSchema }
  }
  if (Array.isArray(obj.fields)) {
    return {
      kind: 'schema',
      schema: { title: obj.title as string | undefined, fields: obj.fields as ImportedFormSchema['fields'] },
    }
  }
  if (typeof obj.text === 'string') return { kind: 'text', text: obj.text }
  if (typeof obj.markdown === 'string') return { kind: 'text', text: obj.markdown }
  if (typeof obj.html === 'string') {
    return { kind: 'text', text: obj.html, meta: { html: true } }
  }
  throw new Error('Import service response did not contain schema, fields, text, markdown or html')
}

export function createRemoteImportAdapter(options: RemoteImportAdapterOptions): FormImportAdapter {
  const {
    url,
    name = 'remote',
    method = 'POST',
    fieldName = 'file',
    kinds,
    accepts,
    parseResponse,
  } = options
  const doFetch = options.fetch || ((...args: Parameters<typeof fetch>) => fetch(...args))

  return {
    name,
    accepts: (file) => {
      if (accepts) return accepts(file)
      if (kinds && kinds.length > 0) return kinds.includes(detectFileKind(file))
      return true
    },
    extract: async (file: File, ctx: ImportContext) => {
      ctx.onProgress?.({ step: 'extracting', message: 'Uploading to import service…', percent: 20 })
      const body = new FormData()
      body.append(fieldName, file, file.name)
      const extra =
        typeof options.extraFields === 'function' ? options.extraFields(file) : options.extraFields || {}
      Object.entries(extra).forEach(([k, v]) => body.append(k, v))

      const headers = typeof options.headers === 'function' ? await options.headers() : options.headers || {}
      const response = await doFetch(url, { method, headers, body, signal: ctx.signal })
      if (!response.ok) {
        throw new Error(`Import service responded with ${response.status} ${response.statusText}`.trim())
      }
      ctx.onProgress?.({ step: 'analyzing', message: 'Processing service response…', percent: 80 })
      const contentType = response.headers.get('content-type') || ''
      const payload: unknown = contentType.includes('application/json')
        ? await response.json()
        : await response.text()
      const mapped = parseResponse ? await parseResponse(payload, response) : (payload as RemoteImportResponse)
      return normalizeRemoteResponse(mapped)
    },
  }
}

/** Wrap a plain async function as an adapter. */
export function createFunctionImportAdapter(
  name: string,
  extract: (file: File, ctx: ImportContext) => Promise<RemoteImportResponse>,
  accepts: (file: File) => boolean = () => true
): FormImportAdapter {
  return {
    name,
    accepts,
    extract: async (file, ctx) => normalizeRemoteResponse(await extract(file, ctx)),
  }
}
