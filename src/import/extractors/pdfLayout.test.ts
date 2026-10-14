import { describe, expect, it } from 'vitest'

import {
  annotateItemsWithShapes,
  collectShapes,
  dropDuplicatePages,
  type PdfShape,
  type PdfTextItem,
  stripRunningLines,
} from './pdfLayout'

const OPS = {
  save: 10,
  restore: 11,
  transform: 12,
  constructPath: 91,
  stroke: 20,
  closeStroke: 21,
  fill: 22,
  eoFill: 23,
  fillStroke: 24,
  eoFillStroke: 25,
  closeFillStroke: 26,
  closeEOFillStroke: 27,
  endPath: 28,
  setFillRGBColor: 59,
  setStrokeRGBColor: 58,
}

const item = (str: string, x: number, y: number, size = 10): PdfTextItem => ({
  str,
  transform: [size, 0, 0, size, x, y],
  width: str.length * size * 0.5,
})

const shape = (s: Partial<PdfShape> & Pick<PdfShape, 'x0' | 'y0' | 'x1' | 'y1'>): PdfShape => ({
  curves: 0,
  lines: 4,
  stroked: true,
  fill: '#000000',
  stroke: '#d9d9d9',
  ...s,
})

describe('collectShapes', () => {
  it('maps painted paths through the CTM and skips clip-only paths', () => {
    const circle = new Float32Array([0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
    const shapes = collectShapes(
      {
        fnArray: [OPS.save, OPS.transform, OPS.setStrokeRGBColor, OPS.constructPath, OPS.restore, OPS.constructPath],
        argsArray: [[], [1, 0, 0, 1, 50, 100], ['#1677FF'], [OPS.stroke, [circle], [0, 0, 11, 11]], [], [OPS.endPath, [circle], [0, 0, 500, 500]]],
      },
      OPS
    )
    expect(shapes).toHaveLength(1)
    expect(shapes[0]).toMatchObject({ x0: 50, y0: 100, x1: 61, y1: 111, curves: 4, lines: 0, stroked: true, stroke: '#1677ff' })
  })
})

describe('annotateItemsWithShapes', () => {
  const texts = (items: PdfTextItem[]) => items.map((i) => i.str)

  it('adds option glyphs, required markers and blanks for empty boxes and grid cells', () => {
    const items = [
      item('Option A', 72, 700),
      item('Required', 120, 740),
      item('Name', 50, 660),
      item('H1', 50, 612),
      item('H2', 150, 612),
    ]
    const shapes: PdfShape[] = [
      // radio drawn twice: white background first, then the visible ring
      shape({ x0: 54, y0: 699, x1: 65, y1: 710, curves: 4, lines: 0, stroked: false, fill: '#ffffff' }),
      shape({ x0: 54, y0: 699, x1: 65, y1: 710, curves: 4, lines: 0 }),
      shape({ x0: 115, y0: 736, x1: 162, y1: 750, stroke: '#000000' }),
      shape({ x0: 50, y0: 630, x1: 400, y1: 654 }),
      // 2×2 grid, header row filled, body row empty
      ...[590, 605, 625].map((y) => shape({ x0: 45, y0: y, x1: 245, y1: y + 0.5, lines: 1 })),
      ...[45, 145, 245].map((x) => shape({ x0: x, y0: 590, x1: x + 0.5, y1: 625, lines: 1 })),
    ]
    const out = annotateItemsWithShapes(items, shapes, 600)
    expect(texts(out)).toEqual(['Option A', '*', 'Name', 'H1', 'H2', '○', '______', '______', '______'])
    expect(out[5].transform[5]).toBe(700)
  })
})

describe('page clean up', () => {
  it('strips repeated header / footer lines in the page margins', () => {
    const page = (n: number, body: string) => ({
      height: 800,
      lines: [
        { y: 790, text: '10/1/26, 12:38 AM' },
        { y: 400, text: body },
        { y: 10, text: `https://app.example.com/form ${n}/2` },
      ],
    })
    expect(stripRunningLines([page(1, 'Section 1'), page(2, 'Section 2')])).toEqual([
      [{ y: 400, text: 'Section 1' }],
      [{ y: 400, text: 'Section 2' }],
    ])
  })

  it('drops the page that contains a second copy of another page', () => {
    const form = ['Title', 'Section 1', 'Radio', 'Option 1', 'Option 2', 'Dropdown', 'Please Select', 'Text', 'Date', '1/3']
    const screen = ['Menu', 'Library', ...form.slice(0, -1), 'Upload', '2/3']
    expect([...dropDuplicatePages([screen, form, ['3/3']])]).toEqual([0])
  })
})
