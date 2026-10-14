/**
 * Vector-graphics helpers for PDFs printed from web forms.
 *
 * Browsers print radio buttons, check boxes, input boxes and table grids as
 * paths, not text, so the text layer alone loses them. These helpers read the
 * page operator list, classify the shapes and turn them into synthetic text
 * items (`○`, `☐`, `______`, `*`) that the text heuristics already understand.
 */

export type PdfTextItem = {
  str: string
  transform: number[]
  width?: number
  height?: number
  hasEOL?: boolean
}

/** Axis-aligned shape bounds in PDF user space (y grows upward). */
export type PdfShape = {
  x0: number
  y0: number
  x1: number
  y1: number
  curves: number
  lines: number
  /** Painted with a stroke (outline) */
  stroked: boolean
  fill: string
  stroke: string
}

type OperatorList = { fnArray: number[]; argsArray: unknown[][] }

type Matrix = [number, number, number, number, number, number]

const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0]

const multiply = (m: Matrix, t: number[]): Matrix => [
  m[0] * t[0] + m[2] * t[1],
  m[1] * t[0] + m[3] * t[1],
  m[0] * t[2] + m[2] * t[3],
  m[1] * t[2] + m[3] * t[3],
  m[0] * t[4] + m[2] * t[5] + m[4],
  m[1] * t[4] + m[3] * t[5] + m[5],
]

const apply = (m: Matrix, x: number, y: number): [number, number] => [
  m[0] * x + m[2] * y + m[4],
  m[1] * x + m[3] * y + m[5],
]

// pdf.js DrawOPS path encoding
const MOVE_TO = 0
const LINE_TO = 1
const CURVE_TO = 2
const QUAD_TO = 3

function countSegments(path: ArrayLike<number> | undefined): { curves: number; lines: number } {
  let curves = 0
  let lines = 0
  if (!path) return { curves, lines }
  let k = 0
  while (k < path.length) {
    const code = path[k]
    if (code === MOVE_TO) {
      k += 3
    } else if (code === LINE_TO) {
      lines += 1
      k += 3
    } else if (code === CURVE_TO) {
      curves += 1
      k += 7
    } else if (code === QUAD_TO) {
      curves += 1
      k += 5
    } else {
      k += 1
    }
  }
  return { curves, lines }
}

const colorOf = (arg: unknown): string => (typeof arg === 'string' ? arg.toLowerCase() : '')

/**
 * Walk a pdf.js operator list and return every painted path with its bounds
 * in page space. Clip-only paths are ignored.
 */
export function collectShapes(ops: OperatorList, OPS: Record<string, number>): PdfShape[] {
  const shapes: PdfShape[] = []
  const stack: Array<{ ctm: Matrix; fill: string; stroke: string }> = []
  let ctm: Matrix = IDENTITY
  let fill = ''
  let stroke = ''
  const strokeOps = new Set([OPS.stroke, OPS.closeStroke])
  const paintOps = new Set(
    [
      OPS.stroke,
      OPS.closeStroke,
      OPS.fill,
      OPS.eoFill,
      OPS.fillStroke,
      OPS.eoFillStroke,
      OPS.closeFillStroke,
      OPS.closeEOFillStroke,
    ].filter((n) => typeof n === 'number')
  )

  ops.fnArray.forEach((fn, i) => {
    const args = ops.argsArray[i] || []
    switch (fn) {
      case OPS.save:
        stack.push({ ctm, fill, stroke })
        break
      case OPS.restore: {
        const prev = stack.pop()
        if (prev) ({ ctm, fill, stroke } = prev)
        break
      }
      case OPS.transform:
        ctm = multiply(ctm, args as number[])
        break
      case OPS.setFillRGBColor:
        fill = colorOf(args[0])
        break
      case OPS.setStrokeRGBColor:
        stroke = colorOf(args[0])
        break
      case OPS.constructPath: {
        const [paint, data, minMax] = args as [number, Array<ArrayLike<number>>, ArrayLike<number>]
        if (!paintOps.has(paint) || !minMax || minMax.length < 4) break
        const corners = [
          apply(ctm, minMax[0], minMax[1]),
          apply(ctm, minMax[2], minMax[3]),
          apply(ctm, minMax[0], minMax[3]),
          apply(ctm, minMax[2], minMax[1]),
        ]
        const xs = corners.map((c) => c[0])
        const ys = corners.map((c) => c[1])
        shapes.push({
          x0: Math.min(...xs),
          y0: Math.min(...ys),
          x1: Math.max(...xs),
          y1: Math.max(...ys),
          ...countSegments(data?.[0]),
          stroked: strokeOps.has(paint),
          fill,
          stroke,
        })
        break
      }
      default:
        break
    }
  })
  return shapes
}

/* -------------------------------------------------------------------------- */
/* Classification                                                              */
/* -------------------------------------------------------------------------- */

const WHITE = new Set(['#ffffff', '#fff', 'white'])

const width = (s: PdfShape) => s.x1 - s.x0
const height = (s: PdfShape) => s.y1 - s.y0

/** Painted so it is visible on a white page (white fills are backgrounds). */
const isVisible = (s: PdfShape) => (s.stroked ? !WHITE.has(s.stroke) : !WHITE.has(s.fill))

const isSmallSquare = (s: PdfShape) => {
  const w = width(s)
  const h = height(s)
  return w >= 6 && w <= 20 && h >= 6 && h <= 20 && Math.abs(w - h) <= 1.5
}

/** Radio button: small round shape made only of curves. */
export const isRadioShape = (s: PdfShape) => isSmallSquare(s) && s.curves >= 4 && s.lines === 0 && isVisible(s)

/** Check box: small square outline (optionally with rounded corners). */
export const isCheckboxShape = (s: PdfShape) =>
  isSmallSquare(s) && s.lines >= 3 && s.lines <= 4 && s.curves <= 8 && isVisible(s)

/** Input / select / date box: a visible, reasonably wide, single-line-ish box. */
export const isInputBox = (s: PdfShape, pageWidth: number) => {
  const w = width(s)
  const h = height(s)
  return w >= 40 && w <= pageWidth * 0.95 && h >= 14 && h <= 120 && isVisible(s) && s.lines + s.curves >= 3
}

const isHorizontalRule = (s: PdfShape) => height(s) <= 1.5 && width(s) >= 15
const isVerticalRule = (s: PdfShape) => width(s) <= 1.5 && height(s) >= 8

const same = (a: PdfShape, b: PdfShape, tol = 1.5) =>
  Math.abs(a.x0 - b.x0) <= tol &&
  Math.abs(a.x1 - b.x1) <= tol &&
  Math.abs(a.y0 - b.y0) <= tol &&
  Math.abs(a.y1 - b.y1) <= tol

/** Browsers paint many controls twice (background + border) – keep the visible one. */
const dedupe = (shapes: PdfShape[]): PdfShape[] => {
  const out: PdfShape[] = []
  shapes.forEach((s) => {
    const idx = out.findIndex((o) => same(o, s))
    if (idx < 0) out.push(s)
    else if (!isVisible(out[idx]) && isVisible(s)) out[idx] = s
  })
  return out
}

type Cell = { x0: number; y0: number; x1: number; y1: number }

const cluster = (values: number[], tol = 2): number[] => {
  const sorted = [...values].sort((a, b) => a - b)
  const out: number[] = []
  sorted.forEach((v) => {
    if (out.length === 0 || v - out[out.length - 1] > tol) out.push(v)
  })
  return out
}

/** Table cells formed by thin horizontal / vertical rules. */
export function gridCells(shapes: PdfShape[]): Cell[] {
  const hRules = shapes.filter(isHorizontalRule).map((s) => ({ y: (s.y0 + s.y1) / 2, x0: s.x0, x1: s.x1 }))
  const vRules = shapes.filter(isVerticalRule).map((s) => ({ x: (s.x0 + s.x1) / 2, y0: s.y0, y1: s.y1 }))
  if (hRules.length < 2 || vRules.length < 2) return []

  const xs = cluster(vRules.map((v) => v.x))
  const ys = cluster(hRules.map((h) => h.y))
  const coversV = (x: number, yLow: number, yHigh: number) =>
    vRules.some((v) => Math.abs(v.x - x) <= 2 && v.y0 <= yLow + 2 && v.y1 >= yHigh - 2)
  const coversH = (y: number, xLow: number, xHigh: number) =>
    hRules.some((h) => Math.abs(h.y - y) <= 2 && h.x0 <= xLow + 2 && h.x1 >= xHigh - 2)

  const cells: Cell[] = []
  for (let yi = 0; yi + 1 < ys.length; yi += 1) {
    const yLow = ys[yi]
    const yHigh = ys[yi + 1]
    const h = yHigh - yLow
    if (h >= 8 && h <= 120) {
      for (let xi = 0; xi + 1 < xs.length; xi += 1) {
        const xLow = xs[xi]
        const xHigh = xs[xi + 1]
        if (
          xHigh - xLow >= 15 &&
          coversV(xLow, yLow, yHigh) &&
          coversV(xHigh, yLow, yHigh) &&
          coversH(yLow, xLow, xHigh) &&
          coversH(yHigh, xLow, xHigh)
        ) {
          cells.push({ x0: xLow, y0: yLow, x1: xHigh, y1: yHigh })
        }
      }
    }
  }
  return cells
}

/* -------------------------------------------------------------------------- */
/* Annotation                                                                  */
/* -------------------------------------------------------------------------- */

const REQUIRED_BADGE = /^(?:required|จำเป็น|บังคับ|\*)$/i

const itemSize = (it: PdfTextItem) => Math.abs(it.transform[3]) || Math.abs(it.transform[0]) || 10
const itemWidth = (it: PdfTextItem) => it.width || it.str.length * itemSize(it) * 0.5
const itemCenter = (it: PdfTextItem): [number, number] => [
  it.transform[4] + itemWidth(it) / 2,
  it.transform[5] + itemSize(it) * 0.35,
]

const inside = (box: Cell, [x, y]: [number, number], pad = 1) =>
  x >= box.x0 - pad && x <= box.x1 + pad && y >= box.y0 - pad && y <= box.y1 + pad

const synthetic = (str: string, x: number, y: number, size: number): PdfTextItem => ({
  str,
  transform: [size, 0, 0, size, x, y],
  width: str.length * size * 0.5,
})

/** Place a glyph on the baseline of the label text right of `shape`, if any. */
function optionGlyph(shape: PdfShape, glyph: string, items: PdfTextItem[]): PdfTextItem {
  const cy = (shape.y0 + shape.y1) / 2
  const label = items
    .filter((it) => {
      const [, iy] = itemCenter(it)
      const x = it.transform[4]
      return Math.abs(iy - cy) <= Math.max(6, height(shape)) && x >= shape.x1 - 1 && x - shape.x1 <= 40
    })
    .sort((a, b) => a.transform[4] - b.transform[4])[0]
  const size = label ? itemSize(label) : height(shape)
  const y = label ? label.transform[5] : shape.y0 + height(shape) * 0.2
  return synthetic(glyph, shape.x0, y, size)
}

/**
 * Return the page's text items plus synthetic items describing its controls:
 *  - `○` / `☐` in front of radio / check box options
 *  - `______` inside empty input boxes and empty table cells
 *  - `*` instead of a "Required" badge
 */
export function annotateItemsWithShapes(
  items: PdfTextItem[],
  rawShapes: PdfShape[],
  pageWidth: number
): PdfTextItem[] {
  const shapes = dedupe(rawShapes)
  const textItems = items.filter((it) => typeof it.str === 'string' && it.str.trim() && Array.isArray(it.transform))
  const out: PdfTextItem[] = [...items]
  const injected: Cell[] = []

  shapes.forEach((s) => {
    if (isRadioShape(s)) out.push(optionGlyph(s, '○', textItems))
    else if (isCheckboxShape(s)) out.push(optionGlyph(s, '☐', textItems))
  })

  const addBlank = (box: Cell) => {
    if (injected.some((b) => inside(box, [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2], 0))) return
    injected.push(box)
    const size = Math.min(10, (box.y1 - box.y0) * 0.5)
    out.push(synthetic('______', box.x0 + 3, box.y0 + (box.y1 - box.y0 - size) / 2, size))
  }

  shapes.forEach((s) => {
    const contents = textItems.filter((it) => inside(s, itemCenter(it)))
    // Small pill around a "Required" tag → required marker on the label
    if (contents.length === 1 && REQUIRED_BADGE.test(contents[0].str.trim()) && width(s) <= 90 && height(s) <= 24) {
      const idx = out.indexOf(contents[0])
      if (idx >= 0) out[idx] = { ...contents[0], str: '*' }
      return
    }
    // Empty box → fill-in blank; boxes with a placeholder keep their text
    if (isInputBox(s, pageWidth) && contents.length === 0) addBlank(s)
  })

  gridCells(shapes).forEach((cell) => {
    if (!textItems.some((it) => inside(cell, itemCenter(it)))) addBlank(cell)
  })

  return out
}

/* -------------------------------------------------------------------------- */
/* Page-level clean up                                                         */
/* -------------------------------------------------------------------------- */

export type PageLine = { y: number; text: string }

const MARGIN_RATIO = 0.06

const lineKey = (text: string) => text.replace(/\d+/g, '#').replace(/\s+/g, ' ').trim().toLowerCase()

/**
 * Drop running headers / footers (browser print date, URL, "2/3" …): lines in
 * the top / bottom margin whose digit-normalised text repeats on other pages.
 */
export function stripRunningLines(pages: Array<{ height: number; lines: PageLine[] }>): PageLine[][] {
  if (pages.length < 2) return pages.map((p) => p.lines)
  const inMargin = (y: number, h: number) => y <= h * MARGIN_RATIO || y >= h * (1 - MARGIN_RATIO)
  const counts = new Map<string, number>()
  pages.forEach((p) => {
    const keys = new Set(p.lines.filter((l) => inMargin(l.y, p.height)).map((l) => lineKey(l.text)))
    keys.forEach((k) => counts.set(k, (counts.get(k) || 0) + 1))
  })
  return pages.map((p) =>
    p.lines.filter((l) => !(inMargin(l.y, p.height) && (counts.get(lineKey(l.text)) || 0) >= 2))
  )
}

/**
 * When the same form is printed twice (e.g. once inside the app screen and
 * once on its own), keep the cleaner copy: a page is dropped when another
 * page's text items are almost all contained in it.
 */
export function dropDuplicatePages(pageItems: string[][]): Set<number> {
  const sets = pageItems.map((items) => new Set(items.map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean)))
  const dropped = new Set<number>()
  sets.forEach((small, i) => {
    if (small.size < 8 || dropped.has(i)) return
    sets.forEach((big, j) => {
      if (i === j || dropped.has(j) || big.size <= small.size) return
      let shared = 0
      small.forEach((s) => {
        if (big.has(s)) shared += 1
      })
      if (shared / small.size >= 0.9) dropped.add(j)
    })
  })
  return dropped
}
