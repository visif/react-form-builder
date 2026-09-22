import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as sass from 'sass'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distCssPath = path.join(root, 'dist/app.css')

if (!fs.existsSync(distCssPath)) {
  console.error('dist/app.css is missing. Run vite build before composing CSS.')
  process.exit(1)
}

const viteCss = fs.readFileSync(distCssPath, 'utf8')
const scssCss = sass.compile(path.join(root, 'scss/application.scss'), {
  style: 'compressed',
}).css

const quillPath = path.join(root, 'node_modules/react-quill-new/dist/quill.snow.css')
const quillCss = fs.readFileSync(quillPath, 'utf8')
const hasQuill = /\.ql-snow/.test(viteCss)

const combined = [scssCss, viteCss, hasQuill ? '' : quillCss]
  .join('\n')
  .replace(/\/\*#\s*sourceMappingURL=[\s\S]*?\*\//g, '')
  .trim()

fs.writeFileSync(distCssPath, `${combined}\n`)
