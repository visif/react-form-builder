/**
 * <FixedRowList />
 */
import React from 'react'
import PropTypes from 'prop-types'
import ID from './UUID'

class FixedRowList extends React.Component {
  constructor(props) {
    super(props)
    const { element } = props
    this.state = {
      element,
      dirty: false,
    }
  }

  componentDidUpdate(prevProps) {
    const { element } = this.props
    if (prevProps.element !== element) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ element })
    }
  }

  _setValue(text) {
    return `${text || ''}`.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()
  }

  areRowsInSync() {
    const { element } = this.state
    return Number(element.rows || 1) === element.rowLabels.length
  }

  editRow(index, key, e) {
    const { element } = this.state
    const targetValue = e.target.value || ''

    // Ensure rowLabels[index] exists
    if (!element.rowLabels[index]) {
      element.rowLabels[index] = { value: '', text: '', key: ID.uuid() }
    }

    // Safely check if value property differs from the generated value
    const currentValue = element.rowLabels[index].value || ''
    const currentKeyValue = element.rowLabels[index][key] || ''

    // If value is already custom (not auto-generated from text), keep it
    // Otherwise, set it to the new auto-generated value
    const val =
      currentValue !== this._setValue(currentKeyValue)
        ? currentValue
        : this._setValue(targetValue)

    // Update the properties
    element.rowLabels[index][key] = targetValue
    element.rowLabels[index].value = val

    this.setState({
      element,
      dirty: true,
    })
  }

  updateRow() {
    const { element, dirty } = this.state
    const { updateElement, preview } = this.props

    if (dirty) {
      updateElement.call(preview, element)
      this.setState({ dirty: false })
    }
  }

  addRow(index) {
    const { element } = this.state
    const { updateElement, preview } = this.props
    const newRowIndex = index + 1

    // Add a new row label
    element.rowLabels.splice(newRowIndex, 0, {
      value: '',
      text: `Row ${element.rowLabels.length + 1}`,
      key: ID.uuid(),
    })

    // Update rows count only if it was in sync with rowLabels
    if (this.areRowsInSync()) {
      element.rows = element.rowLabels.length
    }

    // Initialize a new row in childItems if it doesn't exist
    if (!element.childItems) {
      element.childItems = []
    }
    if (!element.childItems[newRowIndex]) {
      const columnsCount = element.childItems[0] ? element.childItems[0].length : 0
      element.childItems[newRowIndex] = Array(columnsCount).fill(null)
    }

    // If we can access the preview data
    if (preview?.state?.data && typeof preview.getDataById === 'function') {
      const allFormData = [...preview.state.data]
      const newElements = []

      // For each column, create new elements
      const columnCount = element.childItems[0] ? element.childItems[0].length : 0

      for (let col = 0; col < columnCount; col++) {
        // Find a template element
        let templateElement = null

        // Look for existing elements in this column
        for (let row = 0; row < element.childItems.length; row++) {
          if (
            row !== newRowIndex &&
            element.childItems[row] &&
            element.childItems[row][col]
          ) {
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
          const newElement = {
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
            newElement.label = templateElement.label
          }
          if (templateElement.required !== undefined) {
            newElement.required = templateElement.required
          }

          // Handle special element types
          if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
            // Create fresh options with unchecked state
            if (templateElement.options && Array.isArray(templateElement.options)) {
              newElement.options = templateElement.options.map((option) => ({
                value: option.value,
                text: option.text,
                key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
                checked: false,
                selected: false,
              }))
              newElement.inline = templateElement.inline || false
            }
          } else if (elementType === 'Dropdown') {
            // Create dropdown options
            if (templateElement.options && Array.isArray(templateElement.options)) {
              newElement.options = templateElement.options.map((option) => ({
                value: option.value,
                text: option.text,
                key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
              }))
            }
          } else if (templateElement.options) {
            // Handle other elements with options
            newElement.options = JSON.parse(JSON.stringify(templateElement.options)).map(
              (opt) => ({
                ...opt,
                key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
              })
            )
          }

          // Add to our collection
          newElements.push(newElement)
          element.childItems[newRowIndex][col] = newElement.id
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
  }

  removeRow(index) {
    const { element } = this.state
    const { updateElement, preview } = this.props

    // Remove the row label
    element.rowLabels.splice(index, 1)

    // Update rows count only if it was in sync with rowLabels
    if (this.areRowsInSync()) {
      element.rows = element.rowLabels.length
    }

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
  }

  render() {
    const { element } = this.props

    return (
      <div className="dynamic-option-list">
        <ul key="row-labels">
          <li>
            <div className="row">
              <div className="col-sm-12">
                <b>Rows</b>
              </div>
            </div>
          </li>
          <li className="clearfix" key="li_label_x">
            <div className="row">
              <div className="col-sm-9">Row Label</div>
              <div className="col-sm-3">
                <div className="dynamic-options-actions-buttons">
                  <button
                    onClick={this.addRow.bind(this, -1)}
                    className="btn btn-success"
                  >
                    <i className="fas fa-plus-circle" />
                  </button>
                </div>
              </div>
            </div>
          </li>

          {(element.rowLabels || []).map((option, index) => {
            const key = `edit_${option.key}`
            return (
              <li className="clearfix" key={`li_label_${key}`}>
                <div className="row">
                  <div className="col-sm-9">
                    <input
                      tabIndex={index + 1}
                      key={`input_label_${key}`}
                      className="form-control"
                      style={{ width: '100%' }}
                      type="text"
                      name={`text_${index}`}
                      placeholder="Row Label"
                      value={option.text}
                      onBlur={this.updateRow.bind(this)}
                      onChange={this.editRow.bind(this, index, 'text')}
                    />
                  </div>
                  <div className="col-sm-3">
                    <div className="dynamic-options-actions-buttons">
                      <button
                        onClick={this.addRow.bind(this, index)}
                        className="btn btn-success"
                      >
                        <i className="fas fa-plus-circle" />
                      </button>
                      <button
                        onClick={this.removeRow.bind(this, index)}
                        className="btn btn-danger"
                      >
                        <i className="fas fa-minus-circle" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
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

FixedRowList.defaultProps = {
  preview: null,
}

export default FixedRowList
