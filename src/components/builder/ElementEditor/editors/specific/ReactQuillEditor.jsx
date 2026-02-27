import React from 'react'

import ReactQuill, { Quill } from 'react-quill-new'

import 'react-quill-new/dist/quill.snow.css'

// Register custom font sizes and alignment — run once at module level
if (typeof window !== 'undefined') {
  const Size = Quill.import('attributors/style/size')
  Size.whitelist = [
    '10px',
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '24px',
    '28px',
    '32px',
    '36px',
    '48px',
    '64px',
  ]
  Quill.register(Size, true)

  // Register alignment as style attributor for proper alignment
  const AlignStyle = Quill.import('attributors/style/align')
  Quill.register(AlignStyle, true)
}

// Defined outside the component so the object reference is stable across renders.
// ReactQuill re-initialises the Quill instance when `modules` or `formats` change,
// which destroys the selection and makes the cursor appear frozen.
const MODULES = {
  toolbar: [
    [
      {
        size: [
          '10px',
          '12px',
          '14px',
          '16px',
          '18px',
          '20px',
          '24px',
          '28px',
          '32px',
          '36px',
          '48px',
          '64px',
        ],
      },
    ],
    [{ font: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ script: 'sub' }, { script: 'super' }],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
}

const FORMATS = [
  'size',
  'font',
  'bold',
  'italic',
  'underline',
  'strike',
  'script',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'align',
  'link',
  'image',
  'video',
  'blockquote',
  'code-block',
]

const QUILL_EDITOR_CSS = `
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before { content: '10px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before { content: '12px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before { content: '14px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before { content: '16px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before { content: '18px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before { content: '20px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before { content: '24px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="28px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="28px"]::before { content: '28px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before { content: '32px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before { content: '36px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="48px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before { content: '48px' !important; }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="64px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="64px"]::before { content: '64px' !important; }
  .ql-container, .ql-editor { min-height: 150px; }
`

/**
 * WYSIWYG editor component for rich text editing
 * Uses Quill.js - a modern, powerful rich text editor
 */

// Inject the size-picker label CSS once into the document head so it doesn't
// get re-inserted on every render (which causes layout recalculations that
// make the cursor appear frozen).
if (typeof window !== 'undefined' && !document.getElementById('quill-editor-overrides')) {
  const style = document.createElement('style')
  style.id = 'quill-editor-overrides'
  style.textContent = QUILL_EDITOR_CSS
  document.head.appendChild(style)
}

const ReactQuillEditor = ({
  label,
  defaultValue = '',
  value,
  onChange,
  onBlur,
  placeholder = 'Enter text...',
}) => {
  const [editorValue, setEditorValue] = React.useState(defaultValue || value || '')

  // Flag set to true while a change originates from the user typing.
  // Without this guard the useEffect below would see `value !== editorValue`
  // (because the parent hasn't re-rendered yet) and immediately revert the
  // content to the old value — freezing the cursor mid-keystroke.
  const isInternalChange = React.useRef(false)

  // Only sync the editor when an *external* caller changes `value` (e.g. the
  // parent loads saved data).  `editorValue` is intentionally omitted from the
  // dep array so that user keystrokes don't trigger this path.
  React.useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }
    if (value !== undefined && value !== editorValue) {
      setEditorValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = React.useCallback(
    (content) => {
      isInternalChange.current = true
      setEditorValue(content)
      if (onChange) {
        onChange(content)
      }
    },
    [onChange]
  )

  const handleBlur = React.useCallback(() => {
    if (onBlur) {
      onBlur()
    }
  }, [onBlur])

  return (
    <div className="form-group">
      {label && <label className="control-label">{label}</label>}
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        onBlur={handleBlur}
        modules={MODULES}
        formats={FORMATS}
        placeholder={placeholder}
        style={{ backgroundColor: 'white' }}
      />
    </div>
  )
}

export default ReactQuillEditor
