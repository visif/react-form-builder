/**
 * <DynamicColumnList />
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input, Space } from 'antd'
import PropTypes from 'prop-types'
import ReactQuill, { Quill } from 'react-quill-new'

import 'react-quill-new/dist/quill.snow.css'

import ID from '../../../utils/uuid'
// eslint-disable-next-line import/no-cycle
import FormElementsEdit from './FormElementsEdit'

if (typeof window !== 'undefined') {
  const Size = Quill.import('attributors/style/size')
  Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px']
  Quill.register(Size, true)
  const AlignStyle = Quill.import('attributors/style/align')
  Quill.register(AlignStyle, true)
}

const COLUMN_HEADER_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ script: 'sub' }, { script: 'super' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    [{ size: ['10px', '12px', '14px', '16px', '18px', '20px', '24px'] }],
    ['link'],
    [{ color: [] }],
    ['clean'],
  ],
}

const COLUMN_HEADER_FORMATS = [
  'bold',
  'italic',
  'underline',
  'script',
  'list',
  'bullet',
  'align',
  'size',
  'link',
  'color',
]

const COLUMN_HEADER_CSS = `
  .dynamic-column-list .ql-toolbar.ql-snow { padding: 4px; }
  .dynamic-column-list .ql-container.ql-snow,
  .dynamic-column-list .ql-editor { min-height: 80px; }
`

if (typeof window !== 'undefined' && !document.getElementById('dcr-column-header-overrides')) {
  const style = document.createElement('style')
  style.id = 'dcr-column-header-overrides'
  style.textContent = COLUMN_HEADER_CSS
  document.head.appendChild(style)
}

const stripHtml = (html) =>
  `${html || ''}`
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const ColumnHeaderEditor = ({ value, onChange, onBlur }) => {
  const [editorValue, setEditorValue] = useState(value || '')
  const isInternalChange = useRef(false)

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }
    if (value !== undefined && value !== editorValue) {
      setEditorValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = useCallback(
    (content) => {
      isInternalChange.current = true
      setEditorValue(content)
      if (onChange) {
        onChange(content)
      }
    },
    [onChange]
  )

  return (
    <ReactQuill
      theme="snow"
      value={editorValue}
      onChange={handleChange}
      onBlur={onBlur}
      modules={COLUMN_HEADER_MODULES}
      formats={COLUMN_HEADER_FORMATS}
      placeholder="Column header text"
      style={{ backgroundColor: 'white' }}
    />
  )
}

ColumnHeaderEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
}

const DynamicColumnList = ({ element: propsElement, preview = null, updateElement }) => {
  const [element, setElement] = useState(propsElement)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingColumn, setEditingColumn] = useState(null)
  const [dirty, setDirty] = useState(false)
  const elementRef = useRef(element)
  const dirtyRef = useRef(false)

  useEffect(() => {
    elementRef.current = element
  }, [element])

  const handleEditModalClose = useCallback(() => {
    setShowEditModal(false)
    setEditingColumn(null)
  }, [])

  const _setValue = (text) => `${text}`.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()

  const persistElement = useCallback(
    (nextElement) => {
      if (preview) {
        updateElement.call(preview, nextElement)
      } else {
        updateElement(nextElement)
      }
    },
    [preview, updateElement]
  )

  const editColumn = useCallback(
    (index, key, e) => {
      setElement((prevElement) => {
        const columns = [...(prevElement.columns || [])]
        const column = { ...columns[index] }

        if (key === 'isSync' || key === 'required') {
          column[key] = e.target.checked
        } else {
          const val =
            column.value !== _setValue(column[key]) ? column.value : _setValue(e.target.value)
          column[key] = e.target.value
          column.value = val
        }

        columns[index] = column
        const newElement = { ...prevElement, columns }
        dirtyRef.current = true
        setDirty(true)
        if (key === 'isSync' || key === 'required') {
          persistElement(newElement)
          dirtyRef.current = false
          setDirty(false)
        }
        return newElement
      })
    },
    [persistElement]
  )

  const editColumnText = useCallback((index, html) => {
    setElement((prevElement) => {
      const columns = [...(prevElement.columns || [])]
      const column = { ...columns[index] }
      const oldPlain = stripHtml(column.text)
      const newPlain = stripHtml(html)
      const val = column.value !== _setValue(oldPlain) ? column.value : _setValue(newPlain)
      column.text = html
      column.value = val
      columns[index] = column
      dirtyRef.current = true
      setDirty(true)
      return { ...prevElement, columns }
    })
  }, [])

  const updateColumn = useCallback(() => {
    if (dirtyRef.current) {
      persistElement(elementRef.current)
      dirtyRef.current = false
      setDirty(false)
    }
  }, [persistElement])

  const addColumn = useCallback(
    (index) => {
      setElement((prevElement) => {
        const columns = [...(prevElement.columns || [])]
        columns.splice(index + 1, 0, {
          value: '',
          text: '',
          key: ID.uuid(),
          width: 1,
          isSync: true,
          required: false,
        })
        const newElement = { ...prevElement, columns }
        persistElement(newElement)
        return newElement
      })
    },
    [persistElement]
  )

  const removeColumn = useCallback(
    (index) => {
      setElement((prevElement) => {
        const columns = [...(prevElement.columns || [])]
        columns.splice(index, 1)
        const newElement = { ...prevElement, columns }
        persistElement(newElement)
        return newElement
      })
    },
    [persistElement]
  )

  const handleUpdateElement = useCallback(
    (updatedElement) => {
      const columns = [...(element.columns || [])]
      const index = columns.findIndex((col) => col.key === updatedElement.key)
      if (index !== -1) {
        columns[index] = updatedElement
        const newElement = { ...element, columns }
        setElement(newElement)
        setDirty(true)
        persistElement(newElement)
        handleEditModalClose()
      }
    },
    [element, persistElement, handleEditModalClose]
  )

  if (dirty) {
    element.dirty = true
  }

  const columns = element.columns || []
  const gridTemplateColumns = 'minmax(0, 1fr) 72px 48px 72px 64px'
  const columnLabelStyle = {
    display: 'block',
    margin: 0,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '32px',
    color: 'rgba(0, 0, 0, 0.88)',
    whiteSpace: 'nowrap',
  }
  const centerCellStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <>
      <div className="dynamic-column-list">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li>
            <div style={{ marginBottom: '12px' }}>
              <b>Columns</b>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns,
                gap: '8px',
                alignItems: 'center',
                padding: '4px 0',
              }}
            >
              <label
                className="dynamic-column-col-label"
                style={{ ...columnLabelStyle, textAlign: 'left' }}
              >
                Header Text
              </label>
              <label
                className="dynamic-column-col-label"
                style={{ ...columnLabelStyle, textAlign: 'left' }}
              >
                Width
              </label>
              <label className="dynamic-column-col-label" style={{ ...columnLabelStyle, textAlign: 'center' }}>
                Sync
              </label>
              <label className="dynamic-column-col-label" style={{ ...columnLabelStyle, textAlign: 'center' }}>
                Required
              </label>
              <div />
            </div>
          </li>
          {columns.length === 0 && (
            <li style={{ marginBottom: '8px' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => addColumn(-1)}>
                Add Column
              </Button>
            </li>
          )}
          {columns.map((option, index) => {
            const editKey = `edit_${option.key}`
            return (
              <li key={editKey} style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns,
                    gap: '8px',
                    alignItems: 'start',
                    padding: '4px 0',
                  }}
                >
                  <ColumnHeaderEditor
                    value={option.text}
                    onChange={(html) => editColumnText(index, html)}
                    onBlur={updateColumn}
                  />
                  <Input
                    tabIndex={index + 1}
                    type="text"
                    name={`width_${index}`}
                    placeholder="Width"
                    value={option.width}
                    onBlur={updateColumn}
                    onChange={(e) => editColumn(index, 'width', e)}
                  />
                  <div style={{ ...centerCellStyle, minHeight: 32 }}>
                    <Checkbox
                      id={`sync_${index}`}
                      checked={option.isSync || false}
                      onChange={(e) => editColumn(index, 'isSync', e)}
                      onBlur={updateColumn}
                    />
                  </div>
                  <div style={{ ...centerCellStyle, minHeight: 32 }}>
                    <Checkbox
                      id={`required_${index}`}
                      checked={option.required || false}
                      onChange={(e) => editColumn(index, 'required', e)}
                      onBlur={updateColumn}
                    />
                  </div>
                  <Space size={8}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => addColumn(index)}
                    />
                    {index > 0 ? (
                      <Button
                        danger
                        icon={<MinusOutlined />}
                        size="small"
                        onClick={() => removeColumn(index)}
                      />
                    ) : (
                      <span aria-hidden="true" style={{ width: 24, height: 24, display: 'inline-block' }} />
                    )}
                  </Space>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {showEditModal && editingColumn && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <FormElementsEdit
                element={editingColumn}
                updateElement={handleUpdateElement}
                manualEditModeOff={handleEditModalClose}
                preview={preview}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

DynamicColumnList.propTypes = {
  element: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        type: PropTypes.string,
        isSync: PropTypes.bool,
        required: PropTypes.bool,
      })
    ).isRequired,
  }).isRequired,
  preview: PropTypes.shape({}),
  updateElement: PropTypes.func.isRequired,
}

export default DynamicColumnList
