import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const required = ['app.es.js', 'app.umd.js', 'app.css', 'index.d.ts']
const isLocal = process.env.VITE_LOCAL_BUILD === 'true'

for (const file of required) {
  const filePath = path.join(dist, file)
  if (!fs.existsSync(filePath)) {
    console.error(`Missing dist/${file}`)
    process.exit(1)
  }
}

const css = fs.readFileSync(path.join(dist, 'app.css'), 'utf8')
const js = fs.readFileSync(path.join(dist, 'app.es.js'), 'utf8')
const hasBanner = js.includes('local @visif/form-builder')
const hasFormStyles = css.includes('.react-form-builder')
const hasQuill = css.includes('.ql-snow')

if (!hasFormStyles) {
  console.error('dist/app.css is missing form-builder styles')
  process.exit(1)
}

if (!hasQuill) {
  console.error('dist/app.css is missing Quill styles')
  process.exit(1)
}

if (isLocal && !hasBanner) {
  console.error('Local build expected the notice banner in dist/app.es.js')
  process.exit(1)
}

if (!isLocal && hasBanner) {
  console.error('Publish build must not include the local notice banner')
  process.exit(1)
}

console.log(
  `dist ok (${isLocal ? 'local' : 'publish'}: banner ${hasBanner ? 'on' : 'off'}, css ${css.length} bytes)`
)
