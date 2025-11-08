import React from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Register custom font sizes
if (typeof window !== 'undefined') {
  const Size = Quill.import('attributors/style/size')
  Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px']
  Quill.register(Size, true)
}

/**
 * WYSIWYG editor component for rich text editing
 * Uses Quill.js - a modern, powerful rich text editor
 */
const ReactQuillEditor = ({
  label,
  defaultValue = '',
  value,
  onChange,
  onBlur,
  placeholder = 'Enter text...',
}) => {
  const [editorValue, setEditorValue] = React.useState(defaultValue || value || '')

  // Sync with external value changes
  React.useEffect(() => {
    if (value !== undefined && value !== editorValue) {
      setEditorValue(value)
    }
  }, [value])

  const handleChange = (content) => {
    setEditorValue(content)
    if (onChange) {
      onChange(content)
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'] }],
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

  const formats = [
    'header',
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

  return (
    <div className="form-group">
      {label && <label className="control-label">{label}</label>}
      <style>
        {`
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
            content: '10px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
            content: '12px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
            content: '14px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
            content: '16px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
            content: '18px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
            content: '20px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
            content: '24px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="28px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="28px"]::before {
            content: '28px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before {
            content: '32px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
            content: '36px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="48px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before {
            content: '48px' !important;
          }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="64px"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="64px"]::before {
            content: '64px' !important;
          }
          .ql-container {
            min-height: 150px;
          }
          .ql-editor {
            min-height: 150px;
          }
        `}
      </style>
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        onBlur={onBlur}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ backgroundColor: 'white' }}
      />
    </div>
  )
}

export default ReactQuillEditor
