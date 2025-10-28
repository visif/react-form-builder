/**
 * <DynamicColumnList />
 */
import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line import/no-cycle
import FormElementsEdit from './form-elements-edit'
import ID from './UUID'

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
        <ul>
          <li>
            <div className="row">
              <div className="col-sm-12">
                <b>Columns</b>
              </div>
            </div>
          </li>
          <li className="clearfix">
            <div className="row">
              <div className="col-sm-6">Header Text</div>
              <div className="col-sm-2">Width</div>
              <div className="col-sm-1 text-center">Sync</div>
              <div className="col-sm-3" />
            </div>
          </li>
          {element.columns.map((option, index) => {
            const editKey = `edit_${option.key}`
            return (
              <li className="clearfix" key={editKey}>
                <div className="row">
                  <div className="col-sm-6">
                    <input
                      tabIndex={index + 1}
                      className="form-control"
                      style={{ width: '100%' }}
                      type="text"
                      name={`text_${index}`}
                      placeholder="Option text"
                      value={option.text}
                      onBlur={updateColumn}
                      onChange={(e) => editColumn(index, 'text', e)}
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      tabIndex={index + 1}
                      className="form-control"
                      style={{ width: '100%' }}
                      type="text"
                      name={`width_${index}`}
                      placeholder="Width"
                      value={option.width}
                      onBlur={updateColumn}
                      onChange={(e) => editColumn(index, 'width', e)}
                    />
                  </div>
                  <div className="col-sm-1">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: '38px', minWidth: '56px' }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`sync_${index}`}
                        checked={option.isSync || false}
                        onChange={(e) => editColumn(index, 'isSync', e)}
                        onBlur={updateColumn}
                      />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="dynamic-options-actions-buttons">
                      <button
                        type="button"
                        onClick={() => addColumn(index)}
                        className="btn btn-success"
                      >
                        <i className="fas fa-plus-circle" />
                      </button>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeColumn(index)}
                          className="btn btn-danger"
                        >
                          <i className="fas fa-minus-circle" />
                        </button>
                      )}
                    </div>
                  </div>
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
