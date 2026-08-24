const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const cssPath = path.join(root, 'src', 'styles', 'draft-align.css')
const sources = [
  path.join(root, 'src', 'form-elements-edit.jsx'),
  path.join(root, 'src', 'dynamic-column-list.jsx'),
  path.join(root, 'src', 'fixed-row-list.jsx'),
]

describe('toolbar popup position (left sidebar)', () => {
  it('positions link and color picker popups to the right of the toolbar icon', () => {
    const css = fs.readFileSync(cssPath, 'utf8')

    assert.match(
      css,
      /\.link-popup-right\s*\{[^}]*left:\s*100%\s*!important/s,
      'link popup must open to the right of the icon'
    )
    assert.doesNotMatch(
      css,
      /\.link-popup-(?:left|right)\s*\{[^}]*right:\s*100%\s*!important/s,
      'link popup must not open to the left of the icon'
    )

    assert.match(
      css,
      /\.color-picker-popup-right\s*\{[^}]*left:\s*(?:100%|0)\s*!important/s,
      'color picker popup must open to the right of the icon'
    )
    assert.doesNotMatch(
      css,
      /\.color-picker-popup-(?:left|right)\s*\{[^}]*right:\s*0\s*!important/s,
      'color picker must not extend left from the icon'
    )
  })

  it('lets the link popup background grow with its content', () => {
    const css = fs.readFileSync(cssPath, 'utf8')
    assert.match(
      css,
      /\.link-popup-right\s*\{[^}]*height:\s*auto\s*!important/s,
      'link popup must not use a fixed height that clips the white background'
    )
  })

  it('uses right-side popup class names in editor toolbars', () => {
    for (const file of sources) {
      const src = fs.readFileSync(file, 'utf8')
      assert.match(
        src,
        /popupClassName:\s*['"]link-popup-right['"]/,
        `${path.basename(file)} should use link-popup-right`
      )
      assert.match(
        src,
        /popupClassName:\s*['"]color-picker-popup-right['"]/,
        `${path.basename(file)} should use color-picker-popup-right`
      )
      assert.doesNotMatch(
        src,
        /popupClassName:\s*['"]link-popup-left['"]/,
        `${path.basename(file)} should not use link-popup-left`
      )
      assert.doesNotMatch(
        src,
        /popupClassName:\s*['"]color-picker-popup-left['"]/,
        `${path.basename(file)} should not use color-picker-popup-left`
      )
    }
  })
})
