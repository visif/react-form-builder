/**
 * <DynamicColumnList />
 */
import React, { useCallback, useState } from 'react'
import { Input, Checkbox, Button, Space } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

import PropTypes from 'prop-types'

import ID from '../../../utils/uuid'
// eslint-disable-next-line import/no-cycle
import FormElementsEdit from './FormElementsEdit'

const DynamicColumnList = ({ element: propsElement, preview = null, updateElement }) => {
  const [element, setElement] = useState(propsElement)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingColumn, setEditingColumn] = useState(null)
  const [dirty, setDirty] = useState(false)

  const handleEditModalClose = useCallback(() => {
    setShowEditModal(false)
    setEditingColumn(null)
  }, [])

  const _setValue = (text) => `${text}`.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()

  const editColumn = useCallback(
    (index, key, e) => {
      setElement((prevElement) => {
        const newElement = { ...prevElement }

        if (key === 'isSync') {
          newElement.columns[index][key] = e.target.checked
        } else {
          const val =
            newElement.columns[index].value !== _setValue(newElement.columns[index][key])
              ? newElement.columns[index].value
              : _setValue(e.target.value)

          newElement.columns[index][key] = e.target.value
          newElement.columns[index].value = val
        }

        setDirty(true)
        return newElement
      })
    },
    [_setValue]
  )

  const updateColumn = useCallback(() => {
    if (dirty) {
      if (preview) {
        updateElement.call(preview, element)
      } else {
        updateElement(element)
      }
      setDirty(false)
    }
  }, [dirty, element, preview, updateElement])

  const addColumn = useCallback(
    (index) => {
      setElement((prevElement) => {
        const newElement = { ...prevElement }
        newElement.columns.splice(index + 1, 0, {
          value: '',
          text: '',
          key: ID.uuid(),
          width: 1,
          isSync: true,
        })
        return newElement
      })

      setTimeout(() => {
        if (preview) {
          updateElement.call(preview, element)
        } else {
          updateElement(element)
        }
      }, 0)
    },
    [element, preview, updateElement]
  )

  const removeColumn = useCallback(
    (index) => {
      setElement((prevElement) => {
        const newElement = { ...prevElement }
        newElement.columns.splice(index, 1)
        return newElement
      })

      setTimeout(() => {
        if (preview) {
          updateElement.call(preview, element)
        } else {
          updateElement(element)
        }
      }, 0)
    },
    [element, preview, updateElement]
  )

  const editColumnSettings = useCallback((column) => {
    setShowEditModal(true)
    setEditingColumn(column)
  }, [])

  const handleUpdateElement = useCallback(
    (updatedElement) => {
      const columns = [...element.columns]
      const index = columns.findIndex((col) => col.key === updatedElement.key)
      if (index !== -1) {
        columns[index] = updatedElement
        setElement((prevElement) => ({
          ...prevElement,
          columns,
        }))
        setDirty(true)
        setTimeout(() => {
          updateColumn()
          handleEditModalClose()
        }, 0)
      }
    },
    [element.columns, updateColumn, handleEditModalClose]
  )

  if (dirty) {
    element.dirty = true
  }

  return (
    <>
      <div className="dynamic-option-list">
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <div style={{ marginBottom: '12px' }}>
              <b>Columns</b>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 60px 120px', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Header Text</div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Width</div>
              <div style={{ fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>Sync</div>
              <div />
            </div>
          </li>
          {element.columns.map((option, index) => {
            const editKey = `edit_${option.key}`
            return (
              <li key={editKey} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 60px 120px', gap: '8px', alignItems: 'center' }}>
                  <Input
                    tabIndex={index + 1}
                    type="text"
                    name={`text_${index}`}
                    placeholder="Column header text"
                    value={option.text}
                    onBlur={updateColumn}
                    onChange={(e) => editColumn(index, 'text', e)}
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
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Checkbox
                      id={`sync_${index}`}
                      checked={option.isSync || false}
                      onChange={(e) => editColumn(index, 'isSync', e)}
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
                    {index > 0 && (
                      <Button
                        danger
                        icon={<MinusOutlined />}
                        size="small"
                        onClick={() => removeColumn(index)}
                      />
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
      })
    ).isRequired,
  }).isRequired,
  preview: PropTypes.shape({}),
  updateElement: PropTypes.func.isRequired,
}

export default DynamicColumnList
