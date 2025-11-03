/**
 * <FixedRowList />
 */
import React, { useCallback, useState } from 'react'
import { Input, Button, Space } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

import PropTypes from 'prop-types'

import ID from '../../../utils/uuid'

const FixedRowList = ({ element: propsElement, preview = null, updateElement }) => {
  const [element, setElement] = useState(propsElement)
  const [dirty, setDirty] = useState(false)

  const _setValue = (text) => {
    return `${text || ''}`.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()
  }

  const areRowsInSync = useCallback(() => {
    return Number(element.rows || 1) === element.rowLabels.length
  }, [element.rows, element.rowLabels.length])

  const editRow = useCallback(
    (index, key, e) => {
      setElement((prevElement) => {
        const newElement = { ...prevElement }
        const targetValue = e.target.value || ''

        // Ensure rowLabels[index] exists
        if (!newElement.rowLabels[index]) {
          newElement.rowLabels[index] = { value: '', text: '', key: ID.uuid() }
        }

        // Safely check if value property differs from the generated value
        const currentValue = newElement.rowLabels[index].value || ''
        const currentKeyValue = newElement.rowLabels[index][key] || ''

        // If value is already custom (not auto-generated from text), keep it
        // Otherwise, set it to the new auto-generated value
        const val =
          currentValue !== _setValue(currentKeyValue) ? currentValue : _setValue(targetValue)

        // Update the properties
        newElement.rowLabels[index][key] = targetValue
        newElement.rowLabels[index].value = val

        setDirty(true)
        return newElement
      })
    },
    [_setValue]
  )

  const updateRow = useCallback(() => {
    if (dirty) {
      updateElement.call(preview, element)
      setDirty(false)
    }
  }, [dirty, element, preview, updateElement])

  const addRow = useCallback(
    (index) => {
      setElement((prevElement) => {
        const newElement = { ...prevElement }
        const newRowIndex = index + 1

        // Add a new row label
        newElement.rowLabels.splice(newRowIndex, 0, {
          value: '',
          text: `Row ${newElement.rowLabels.length + 1}`,
          key: ID.uuid(),
        })

        // Update rows count only if it was in sync with rowLabels
        if (Number(newElement.rows || 1) === prevElement.rowLabels.length) {
          newElement.rows = newElement.rowLabels.length
        }

        // Initialize a new row in childItems if it doesn't exist
        if (!newElement.childItems) {
          newElement.childItems = []
        }
        if (!newElement.childItems[newRowIndex]) {
          const columnsCount = newElement.childItems[0] ? newElement.childItems[0].length : 0
          newElement.childItems[newRowIndex] = Array(columnsCount).fill(null)
        }

        return newElement
      })

      // Handle element creation
      setTimeout(() => {
        // If we can access the preview data
        if (preview?.state?.data && typeof preview.getDataById === 'function') {
          const allFormData = [...preview.state.data]
          const newElements = []
          const newRowIndex = index + 1

          // For each column, create new elements
          const columnCount = element.childItems[0] ? element.childItems[0].length : 0

          for (let col = 0; col < columnCount; col++) {
            // Find a template element
            let templateElement = null

            // Look for existing elements in this column
            for (let row = 0; row < element.childItems.length; row++) {
              if (row !== newRowIndex && element.childItems[row] && element.childItems[row][col]) {
                const elementId = element.childItems[row][col]
                const foundElement = preview.getDataById(elementId)

                if (foundElement) {
                  templateElement = foundElement
                  break
                }
              }
            }

            // If we found a template element
            if (templateElement) {
              const elementType = templateElement.element
              const timestamp = Date.now() + col + newRowIndex

              // Create a new element
              const newElementData = {
                element: elementType,
                id: `${elementType}_${timestamp}_${newRowIndex}_${col}`,
                row: newRowIndex,
                col,
                parentId: element.id,
                hideLabel: true,
                field_name: `${elementType}_${newRowIndex}_${col}_${timestamp}`,
              }

              // Copy basic properties
              if (templateElement.label) {
                newElementData.label = templateElement.label
              }
              if (templateElement.required !== undefined) {
                newElementData.required = templateElement.required
              }

              // Handle special element types
              if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
                // Create fresh options with unchecked state
                if (templateElement.options && Array.isArray(templateElement.options)) {
                  newElementData.options = templateElement.options.map((option) => ({
                    value: option.value,
                    text: option.text,
                    key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
                    checked: false,
                    selected: false,
                  }))
                  newElementData.inline = templateElement.inline || false
                }
              } else if (elementType === 'Dropdown') {
                // Create dropdown options
                if (templateElement.options && Array.isArray(templateElement.options)) {
                  newElementData.options = templateElement.options.map((option) => ({
                    value: option.value,
                    text: option.text,
                    key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
                  }))
                }
              } else if (templateElement.options) {
                // Handle other elements with options
                newElementData.options = JSON.parse(JSON.stringify(templateElement.options)).map(
                  (opt) => ({
                    ...opt,
                    key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
                  })
                )
              }

              // Add to our collection
              newElements.push(newElementData)
              element.childItems[newRowIndex][col] = newElementData.id
            }
          }

          // If we created new elements, update the form data
          if (newElements.length > 0) {
            const updatedData = [...allFormData, ...newElements]

            // Try to update state
            try {
              preview.setState({ data: updatedData }, () => {
                updateElement.call(preview, element)
              })
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Error updating state:', e)
              updateElement.call(preview, element)
            }
          } else {
            // Just update the element if we can't access data
            updateElement.call(preview, element)
          }
        }
      }, 0)
    },
    [element, preview, updateElement]
  )

  const removeRow = useCallback(
    (index) => {
      setElement((prevElement) => {
        const newElement = { ...prevElement }

        // Remove the row label
        newElement.rowLabels.splice(index, 1)

        // Update rows count only if it was in sync with rowLabels
        if (Number(newElement.rows || 1) === prevElement.rowLabels.length) {
          newElement.rows = newElement.rowLabels.length
        }

        return newElement
      })

      // Handle element removal
      setTimeout(() => {
        // If we have childItems, also remove the row from there
        if (element.childItems && Array.isArray(element.childItems)) {
          let updatedData = preview?.state ? [...preview.state.data] : []

          // Track elements to remove
          const elementsToRemove = []

          // Remove the row from childItems
          if (index < element.childItems.length) {
            // Find elements in this row to remove them from data
            if (preview && typeof preview.getDataById === 'function') {
              const rowItems = element.childItems[index]
              if (rowItems) {
                rowItems.forEach((elementId) => {
                  if (elementId) {
                    const foundElement = preview.getDataById(elementId)
                    if (foundElement) {
                      elementsToRemove.push(foundElement)
                    }
                  }
                })
              }
            }

            // Remove the row from childItems
            element.childItems.splice(index, 1)

            // Remove elements from data if we have access to it
            if (preview?.state && elementsToRemove.length > 0) {
              updatedData = updatedData.filter((x) => !elementsToRemove.includes(x))

              // Try to update state
              try {
                preview.setState({ data: updatedData }, () => {
                  updateElement.call(preview, element)
                })
                return
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Error updating state:', e)
              }
            }
          }
        }

        // Update the element
        updateElement.call(preview, element)
      }, 0)
    },
    [element, preview, updateElement]
  )

  return (
    <div className="dynamic-option-list">
      <ul key="row-labels">
        <li>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '8px', alignItems: 'center', padding: '4px 0' }}>
            <Input value="Rows" disabled />
            <div></div>
          </div>
        </li>
        <li className="clearfix" key="li_label_x">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '8px', alignItems: 'center', padding: '4px 0' }}>
            <Input value="Row Label" disabled />
            <Space size="small">
              <Button
                onClick={() => addRow(-1)}
                type="primary"
                size="small"
                icon={<PlusOutlined />}
              />
            </Space>
          </div>
        </li>

        {propsElement.rowLabels.map((option, index) => {
          const key = `edit_${option.key}`
          return (
            <li className="clearfix" key={`li_label_${key}`}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '8px', alignItems: 'center', padding: '4px 0' }}>
                <Input
                  tabIndex={index + 1}
                  key={`input_label_${key}`}
                  type="text"
                  name={`text_${index}`}
                  placeholder="Row Label"
                  value={option.text}
                  onBlur={updateRow}
                  onChange={(e) => editRow(index, 'text', e)}
                />
                <Space size="small">
                  <Button
                    onClick={() => addRow(index)}
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                  />
                  <Button
                    onClick={() => removeRow(index)}
                    danger
                    size="small"
                    icon={<MinusOutlined />}
                  />
                </Space>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

FixedRowList.propTypes = {
  element: PropTypes.shape({
    rowLabels: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
        key: PropTypes.string,
      })
    ).isRequired,
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.string,
    childItems: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  }).isRequired,
  preview: PropTypes.shape({
    state: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    getDataById: PropTypes.func,
    setState: PropTypes.func,
  }),
  updateElement: PropTypes.func.isRequired,
}

export default FixedRowList
