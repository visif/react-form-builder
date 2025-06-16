/* eslint-disable camelcase */
import React from 'react'
import ComponentHeader from '../form-elements/component-header'
import ComponentLabel from '../form-elements/component-label'
import ItemTypes from '../ItemTypes'
import Dustbin from './dustbin'

const accepts = [ItemTypes.BOX, ItemTypes.CARD]

const MultiColumnRow = (props) => {
  const {
    controls,
    data = {}, // Default to an empty object if data is undefined
    editModeOn,
    getDataById,
    setAsChild,
    removeChild,
    seq,
    index,
    updateElement,
  } = props

  const { childItems = [], pageBreakBefore } = data
  const baseClasses = `SortableItem rfb-item ${pageBreakBefore ? 'alwaysbreak' : ''}`

  // Check if row labels are defined in data
  const hasRowLabels = Array.isArray(data.rowLabels) && data.rowLabels.length > 0

  // Function to synchronize changes across a column
  const syncColumnChanges = (rowIndex, columnIndex, elementType, changeData) => {
    // Only sync for supported element types
    if (
      ![
        'Checkboxes',
        'RadioButtons',
        'Dropdown',
        'TextInput',
        'NumberInput',
        'TextArea',
        'DatePicker',
        'Signature',
        'Signature2',
        'FormulaInput',
        'DataSource',
        'FormLink',
      ].includes(elementType)
    ) {
      return
    }

    // Go through each row
    childItems.forEach((row, rIdx) => {
      // Skip the row that triggered the change
      if (rIdx === rowIndex) return

      const itemId = row[columnIndex]
      if (!itemId) return

      const itemData = getDataById(itemId)
      if (!itemData || itemData.element !== elementType) return

      // Create a new updated element to apply changes
      const updatedItem = {
        ...itemData,
      }

      // Apply changes based on element type and what was changed
      if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
        // For checkboxes/radio buttons
        if (changeData.options) {
          // Transfer option selection state but preserve option structure
          updatedItem.options = changeData.options.map((newOpt, idx) => {
            if (idx < itemData.options.length) {
              return {
                ...itemData.options[idx],
                text: newOpt.text, // Update text
                value: newOpt.value, // Update value
                checked: newOpt.checked, // Update checked state
                selected: newOpt.selected, // Update selected state
              }
            }
            return newOpt // For new options
          })
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey
        }
      } else if (elementType === 'Dropdown') {
        // For dropdowns
        if (changeData.options) {
          updatedItem.options = changeData.options.map((newOpt, idx) => {
            if (idx < itemData.options.length) {
              return {
                ...itemData.options[idx],
                text: newOpt.text,
                value: newOpt.value,
              }
            }
            return newOpt
          })
        }

        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey
        }
      } else if (elementType === 'DataSource') {
        // For DataSource components
        if (changeData.sourceType !== undefined) {
          updatedItem.sourceType = changeData.sourceType
        }

        if (changeData.formSource !== undefined) {
          updatedItem.formSource = changeData.formSource
        }

        // Handle any selected item data
        if (changeData.selectedItem !== undefined) {
          updatedItem.selectedItem = changeData.selectedItem
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Make sure the DataSource is properly initialized
        updatedItem.initialized = true
      } else if (elementType === 'Signature2') {
        // For Signature2 components
        if (changeData.position !== undefined) {
          updatedItem.position = changeData.position
        }
        if (changeData.specificRole !== undefined) {
          updatedItem.specificRole = changeData.specificRole
        }
        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync required property if it exists
        if (changeData.hasOwnProperty('required')) {
          updatedItem.required = changeData.required
        }

        // Sync readOnly property if it exists
        if (changeData.hasOwnProperty('readOnly')) {
          updatedItem.readOnly = changeData.readOnly
        }

        // Make sure the Signature2 is properly initialized
        updatedItem.initialized = true
      } else if (elementType === 'FormLink') {
        // For FormLink components
        if (changeData.selectedFormId !== undefined) {
          updatedItem.selectedFormId = changeData.selectedFormId
        }

        if (changeData.formName !== undefined) {
          updatedItem.formName = changeData.formName
        }

        if (changeData.linkText !== undefined) {
          updatedItem.linkText = changeData.linkText
        }

        if (changeData.openInNewWindow !== undefined) {
          updatedItem.openInNewWindow = changeData.openInNewWindow
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync any additional FormLink-specific properties
        if (changeData.buttonStyle !== undefined) {
          updatedItem.buttonStyle = changeData.buttonStyle
        }

        if (changeData.className !== undefined) {
          updatedItem.className = changeData.className
        }

        // Add missing FormLink props from the component
        if (changeData.formSource !== undefined) {
          updatedItem.formSource = changeData.formSource
        }

        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value
        }

        if (changeData.isShowLabel !== undefined) {
          updatedItem.isShowLabel = changeData.isShowLabel
        }

        if (changeData.pageBreakBefore !== undefined) {
          updatedItem.pageBreakBefore = changeData.pageBreakBefore
        }

        // Sync dirty state
        if (changeData.hasOwnProperty('dirty')) {
          updatedItem.dirty = changeData.dirty
        }

        // Sync required property if it exists
        if (changeData.hasOwnProperty('required')) {
          updatedItem.required = changeData.required
        }

        // Sync readOnly property if it exists
        if (changeData.hasOwnProperty('readOnly')) {
          updatedItem.readOnly = changeData.readOnly
        }

        // Sync disabled property if it exists
        if (changeData.hasOwnProperty('disabled')) {
          updatedItem.disabled = changeData.disabled
        }

        // Sync style property if it exists
        if (changeData.style !== undefined) {
          updatedItem.style = changeData.style
        }

        // Sync editor information
        if (changeData.editor !== undefined) {
          updatedItem.editor = changeData.editor
        }

        // Sync form information properties
        if (changeData.formInfo !== undefined) {
          updatedItem.formInfo = changeData.formInfo
        }

        // Sync default value properties
        if (changeData.defaultValue !== undefined) {
          updatedItem.defaultValue = changeData.defaultValue
        }
      } else {
        // For other input types
        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey
        }
      }

      // If we created an updated item, apply the changes
      if (updatedItem && updateElement) {
        updateElement(updatedItem)
      }
    })
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div>
        <ComponentLabel {...props} />
        <table className="table table-bordered" style={{ borderCollapse: 'collapse' }}>
          {data.columns && (
            <thead>
              <tr>
                {/* Add empty header cell for row labels column if row labels are present */}
                {hasRowLabels && (
                  <th
                    style={{
                      width: '150px',
                      fontWeight: 'bold',
                      backgroundColor: '#e9ecef', // Slightly darker background
                      borderBottom: '2px solid #dee2e6', // Thicker bottom border
                    }}
                  />
                )}
                {data.columns.map((column, columnIndex) => (
                  <th
                    key={`header_${columnIndex}`}
                    className="rfb-table-column-header" // Add CSS class
                    style={{
                      textAlign: 'center',
                      backgroundColor: '#e9ecef',
                      borderBottom: '2px solid #dee2e6',
                      padding: '10px 8px',
                    }}
                  >
                    {column.text}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {childItems.map((row, rowIndex) => (
              <tr key={`row_${rowIndex}`}>
                {/* Add row label cell if row labels are present */}
                {hasRowLabels && (
                  <td
                    className="row-label rfb-table-row-label" // Add CSS class
                    style={{
                      textAlign: 'right',
                      paddingRight: '10px',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    {data.rowLabels[rowIndex] ? data.rowLabels[rowIndex].text : ''}
                  </td>
                )}
                {row.map((item, columnIndex) => (
                  <td
                    key={`${rowIndex}_${columnIndex}_${item || '_'}`}
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
                  >
                    {controls ? (
                      controls[rowIndex]?.[columnIndex]
                    ) : (
                      <Dustbin
                        style={{ width: '100%' }}
                        data={data}
                        accepts={accepts}
                        items={childItems[rowIndex]}
                        row={rowIndex}
                        col={columnIndex}
                        parentIndex={index}
                        editModeOn={editModeOn}
                        _onDestroy={() => removeChild(data, rowIndex, columnIndex)}
                        getDataById={getDataById}
                        setAsChild={setAsChild}
                        seq={seq}
                        syncColumnChanges={syncColumnChanges}
                        updateElement={updateElement}
                        {...props}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Creates a higher-order component (HOC) for rendering a multi-column row.
 *
 * @param {string} defaultClassName - The default CSS class name to apply to the row.
 * @param {number} numberOfColumns - The number of columns to initialize in the row.
 * @returns {Function} A React functional component that renders a `MultiColumnRow` with the specified properties.
 *
 * The returned component:
 * - Accepts `data`, `class_name`, and other props.
 * - Initializes `data.childItems` as an array of `numberOfColumns` elements if not already defined.
 * - Sets `data.isContainer` to `true` if `data.childItems` is initialized.
 * - Applies the provided `class_name` or falls back to `defaultClassName`.
 */
const createColumnRow =
  (defaultClassName, numberOfColumns, numberOfRows = 1) =>
  ({ data = {}, class_name, ...rest }) => {
    const className = `${class_name || defaultClassName} mb-2`
    const rows = data.rows || numberOfRows

    if (!data.childItems) {
      data.childItems = Array(rows)
        .fill()
        .map(() => Array(numberOfColumns).fill(null))
      data.isContainer = true
    } else if (!Array.isArray(data.childItems[0])) {
      // Convert existing 1D array to 2D for backward compatibility
      data.childItems = [data.childItems]
    }

    return <MultiColumnRow {...rest} className={className} rows={rows} data={data} />
  }

/**
 * Creates a dynamic column row component that supports any number of rows and columns.
 * Uses the same pattern as createColumnRow for consistency.
 */
const createDynamicColumnRow =
  () =>
  ({ data = {}, class_name, ...rest }) => {
    const rows = Number(data.rows) || 1
    const columns = data.columns?.length || 2
    const defaultClassName = `col-md-${Math.floor(12 / columns)}`
    const className = `${class_name || defaultClassName} mb-2`

    // Initialize or update childItems to match current rows and columns
    if (!data.childItems) {
      data.childItems = Array(rows)
        .fill()
        .map(() => Array(columns).fill(null))
      data.isContainer = true
    } else if (data.childItems.length > 0 && !Array.isArray(data.childItems[0])) {
      // Convert existing 1D array to 2D for backward compatibility
      data.childItems = [data.childItems]
    } else {
      // Update existing childItems to match current structure
      const updatedChildItems = []

      // Ensure we have the right number of rows
      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const existingRow = data.childItems[rowIndex] || []
        const newRow = []

        // Ensure each row has the right number of columns
        for (let colIndex = 0; colIndex < columns; colIndex++) {
          newRow[colIndex] = existingRow[colIndex] || null
        }

        updatedChildItems.push(newRow)
      }

      data.childItems = updatedChildItems
    }

    return <MultiColumnRow {...rest} className={className} rows={rows} data={data} />
  }

// Create the component using the same pattern
const DynamicColumnRow = createDynamicColumnRow()

const TwoColumnRow = createColumnRow('col-md-6', 2)
const ThreeColumnRow = createColumnRow('col-md-4', 3)
const FourColumnRow = createColumnRow('col-md-3', 4)

export { TwoColumnRow, ThreeColumnRow, FourColumnRow, DynamicColumnRow }
