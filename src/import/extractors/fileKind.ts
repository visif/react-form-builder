export type ImportFileKind = 'pdf' | 'docx' | 'sheet' | 'image' | 'text' | 'unknown'

const EXT = (name: string): string => {
  const idx = name.lastIndexOf('.')
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : ''
}

export function detectFileKind(file: { name?: string; type?: string }): ImportFileKind {
  const ext = EXT(file.name || '')
  const mime = (file.type || '').toLowerCase()

  if (ext === 'pdf' || mime === 'application/pdf') return 'pdf'
  if (
    ext === 'docx' ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'docx'
  }
  if (
    ['xlsx', 'xlsm', 'xls', 'csv', 'ods', 'numbers'].includes(ext) ||
    mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mime === 'application/vnd.apple.numbers' ||
    mime === 'application/vnd.ms-excel' ||
    mime === 'text/csv'
  ) {
    return 'sheet'
  }
  if (
    ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif', 'tif', 'tiff'].includes(ext) ||
    mime.startsWith('image/')
  ) {
    return 'image'
  }
  if (['txt', 'md', 'markdown'].includes(ext) || mime.startsWith('text/')) return 'text'
  return 'unknown'
}

export const DEFAULT_IMPORT_ACCEPT =
  '.pdf,.docx,.xlsx,.xlsm,.xls,.csv,.ods,.numbers,.png,.jpg,.jpeg,.webp,.bmp,.tif,.tiff,.txt,.md'
