/**
 * Convert simple document HTML (as produced by mammoth for DOCX, or returned
 * by a remote extractor) into the markdown-lite text understood by
 * `textToFormSchema`.
 */

// Word "Wingdings"/"Symbol" private-use glyphs commonly used for check boxes
const PUA_CHECKBOX: Record<string, string> = {
  '\uF06F': '☐',
  '\uF071': '☐',
  '\uF0A8': '☐',
  '\uF0A0': '☐',
  '\uF0FE': '☑',
  '\uF0FD': '☑',
  '\uF078': '☒',
  '\uF0A2': '○',
  '\uF06C': '●',
}

export const normalizeGlyphs = (text: string): string =>
  text.replace(/[\uE000-\uF8FF]/g, (ch) => PUA_CHECKBOX[ch] || '')

const collapse = (text: string): string => text.replace(/[ \t\u00a0]+/g, ' ').trim()

const UNDERLINE_BLANK = /^[\s\u00a0]{2,}$/

function inlineText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return normalizeGlyphs(node.textContent || '')
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return ''
  const el = node as HTMLElement
  const tag = el.tagName.toLowerCase()
  if (tag === 'br') return '\n'
  if (tag === 'img') return ''
  if (tag === 'input') {
    const type = (el.getAttribute('type') || '').toLowerCase()
    if (type === 'checkbox') return el.hasAttribute('checked') ? ' ☑ ' : ' ☐ '
    if (type === 'radio') return el.hasAttribute('checked') ? ' ● ' : ' ○ '
    return ' ______ '
  }
  const inner = Array.from(el.childNodes).map(inlineText).join('')
  // Underlined blank runs are fill-in fields in Word forms
  if ((tag === 'u' || /underline/.test(el.getAttribute('style') || '')) && UNDERLINE_BLANK.test(inner)) {
    return ' ______ '
  }
  return inner
}

function blockToLines(node: Node, out: string[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = collapse(normalizeGlyphs(node.textContent || ''))
    if (text) out.push(text)
    return
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return
  const el = node as HTMLElement
  const tag = el.tagName.toLowerCase()

  switch (tag) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const text = collapse(inlineText(el))
      if (text) out.push(`# ${text}`)
      return
    }
    case 'table': {
      const rows = Array.from(el.querySelectorAll('tr'))
      rows.forEach((tr) => {
        const cells = Array.from(tr.children)
          .filter((c) => ['td', 'th'].includes(c.tagName.toLowerCase()))
          .map((c) => collapse(inlineText(c).replace(/\n/g, ' ')))
        if (cells.length > 0) out.push(`| ${cells.join(' | ')} |`)
      })
      out.push('')
      return
    }
    case 'ul':
    case 'ol': {
      Array.from(el.children).forEach((li) => {
        const text = collapse(inlineText(li).replace(/\n/g, ' '))
        if (text) out.push(`- ${text}`)
      })
      return
    }
    case 'hr':
      out.push('------')
      return
    case 'p':
    case 'div':
    case 'li':
    case 'section':
    case 'article':
    case 'blockquote':
    case 'td':
    case 'th': {
      const hasBlockChildren = Array.from(el.children).some((c) =>
        ['p', 'div', 'table', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section'].includes(
          c.tagName.toLowerCase()
        )
      )
      if (hasBlockChildren) {
        Array.from(el.childNodes).forEach((child) => blockToLines(child, out))
        return
      }
      inlineText(el)
        .split('\n')
        .forEach((line) => out.push(collapse(line)))
      return
    }
    default: {
      if (el.children.length === 0) {
        const text = collapse(inlineText(el))
        if (text) out.push(text)
        return
      }
      Array.from(el.childNodes).forEach((child) => blockToLines(child, out))
    }
  }
}

export function htmlToText(html: string): string {
  if (typeof DOMParser === 'undefined') {
    // Non-browser fallback: strip tags
    return normalizeGlyphs(html.replace(/<[^>]+>/g, '\n')).replace(/\n{3,}/g, '\n\n')
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const out: string[] = []
  Array.from(doc.body.childNodes).forEach((node) => blockToLines(node, out))
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export default htmlToText
