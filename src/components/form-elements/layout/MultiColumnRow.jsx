/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import ItemTypes from '../../../constants/itemTypes'
import useSyncColumnChanges from '../../../hooks/useSyncColumnChanges'
import {
  getRelativeColumnWidths,
  getRowLabelColumnCssWidth,
  resizeAdjacentColumnWidths,
  roundRelativeWidth,
} from '../../../utils/columnWidths'
import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel, { RequiredBadge } from '../shared/ComponentLabel'
import Dustbin from './dustbin'

const accepts = [ItemTypes.BOX, ItemTypes.CARD]

const RESIZABLE_COLUMN_ROWS = new Set([
  'DynamicColumnRow',
  'TwoColumnRow',
  'ThreeColumnRow',
  'FourColumnRow',
])

const stripPTags = (html) => {
  if (!html) return html
  return html.replace(/<p>/gi, '').replace(/<\/p>/gi, '').trim()
}

const percentWidthsFromRelative = (relativeWidths) => {
  const totalWidth = relativeWidths.reduce((sum, width) => sum + width, 0)
  if (!totalWidth) return relativeWidths.map(() => 0)
  return relativeWidths.map((width) => (width / totalWidth) * 100)
}

const RESIZE_HANDLE_STYLE = {
  position: 'absolute',
  top: 0,
  right: -6,
  width: 12,
  height: '100%',
  padding: 0,
  margin: 0,
  border: 0,
  background: 'transparent',
  cursor: 'col-resize',
  zIndex: 6,
  touchAction: 'none',
  userSelect: 'none',
}

const RESIZE_HANDLE_BAR_STYLE = {
  position: 'absolute',
  top: 6,
  bottom: 6,
  left: 5,
  width: 2,
  borderRadius: 1,
  backgroundColor: '#98a2b3',
  pointerEvents: 'none',
}

const ColumnResizeHandle = ({ columnIndex, onResizeStart }) => {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      type="button"
      className="rfb-col-resize-handle"
      aria-orientation="vertical"
      aria-label={`Resize column ${columnIndex + 1}`}
      title="Drag to resize column"
      style={RESIZE_HANDLE_STYLE}
      onPointerDown={onResizeStart(columnIndex)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      <span
        style={{
          ...RESIZE_HANDLE_BAR_STYLE,
          backgroundColor: hovered ? '#1677ff' : '#98a2b3',
        }}
      />
    </button>
  )
}

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
    connectDragSource,
    onSelectChildForm,
    openLinkedForm,
    getFormInfo,
    getFormSource,
    preview,
  } = props

  const { childItems = [], pageBreakBefore } = data
  const baseClasses = `SortableItem rfb-item ${pageBreakBefore ? 'alwaysbreak' : ''}${
    data.element === 'DynamicColumnRow' ? ' rfb-dcr' : ''
  }`

  // Check if row labels are defined in data
  const hasRowLabels = Array.isArray(data.rowLabels) && data.rowLabels.length > 0
  const rowLabelColumnWidth = hasRowLabels ? getRowLabelColumnCssWidth(data.rowLabels) : null

  // Use the custom hook for synchronizing column changes
  const syncColumnChanges = useSyncColumnChanges(childItems, getDataById, updateElement)

  const tableRef = useRef(null)
  const dataRef = useRef(data)
  dataRef.current = data
  const dragStateRef = useRef(null)
  const [draftWidths, setDraftWidths] = useState(null)
  const [isResizing, setIsResizing] = useState(false)

  const columnCount = data.columns?.length || childItems[0]?.length || 0
  const hasColumnHeaders = Array.isArray(data.columns) && data.columns.length > 0
  const canResizeColumns =
    RESIZABLE_COLUMN_ROWS.has(data.element) &&
    typeof updateElement === 'function' &&
    (Boolean(preview) || Boolean(editModeOn))

  const relativeWidths = useMemo(() => {
    if (draftWidths) return draftWidths
    return getRelativeColumnWidths(data.columns, data.colWidths, columnCount)
  }, [data.columns, data.colWidths, columnCount, draftWidths])

  const columnWidths = percentWidthsFromRelative(relativeWidths)

  const stopColumnResize = useCallback(() => {
    const drag = dragStateRef.current
    if (!drag) return

    dragStateRef.current = null
    document.body.classList.remove('rfb-col-resizing')
    window.removeEventListener('pointermove', drag.move)
    window.removeEventListener('pointerup', drag.up)
    window.removeEventListener('pointercancel', drag.up)

    const current = dataRef.current
    if (typeof updateElement === 'function') {
      const rounded = drag.currentWidths.map(roundRelativeWidth)
      if (Array.isArray(current.columns) && current.columns.length > 0) {
        updateElement({
          ...current,
          columns: current.columns.map((column, columnIndex) => ({
            ...column,
            width: rounded[columnIndex],
          })),
          dirty: true,
        })
      } else {
        updateElement({
          ...current,
          colWidths: rounded,
          dirty: true,
        })
      }
    }
    setDraftWidths(null)
    setIsResizing(false)
  }, [updateElement])

  const moveColumnResize = useCallback((event) => {
    const drag = dragStateRef.current
    if (!drag) return
    const deltaUnits = (event.clientX - drag.startX) / drag.pxPerUnit
    const next = resizeAdjacentColumnWidths(drag.startWidths, drag.index, deltaUnits)
    drag.currentWidths = next
    setDraftWidths(next)
  }, [])

  const startColumnResize = useCallback(
    (columnIndex) => (event) => {
      if (!canResizeColumns || columnIndex >= relativeWidths.length - 1) return
      if (dragStateRef.current) return
      event.preventDefault()
      event.stopPropagation()

      const tableWidth = tableRef.current?.clientWidth || 0
      const rowLabelCell = tableRef.current?.querySelector('.rfb-table-row-header-cell')
      const rowLabelWidth = rowLabelCell?.getBoundingClientRect?.().width || 0
      const usableWidth = Math.max(tableWidth - rowLabelWidth, 1)
      const totalUnits = relativeWidths.reduce((sum, width) => sum + width, 0) || 1

      const move = moveColumnResize
      const up = stopColumnResize
      dragStateRef.current = {
        index: columnIndex,
        startX: event.clientX,
        startWidths: relativeWidths,
        currentWidths: relativeWidths,
        pxPerUnit: usableWidth / totalUnits,
        move,
        up,
      }
      setDraftWidths(relativeWidths)
      setIsResizing(true)
      document.body.classList.add('rfb-col-resizing')
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    },
    [canResizeColumns, moveColumnResize, relativeWidths, stopColumnResize]
  )

  useEffect(
    () => () => {
      if (!dragStateRef.current) return
      window.removeEventListener('pointermove', dragStateRef.current.move)
      window.removeEventListener('pointerup', dragStateRef.current.up)
      window.removeEventListener('pointercancel', dragStateRef.current.up)
      document.body.classList.remove('rfb-col-resizing')
      dragStateRef.current = null
    },
    []
  )

  const rowLabelCellStyle = {
    width: rowLabelColumnWidth,
    minWidth: rowLabelColumnWidth,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div>
        <ComponentLabel {...props} />
        <table
          ref={tableRef}
          className={`rfb-multicolumn-table${isResizing ? ' rfb-col-resizing' : ''}`}
          style={{
            marginBottom: '0',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            width: '100%',
          }}
        >
          {hasColumnHeaders && (
            <thead>
              <tr>
                {/* Add empty header cell for row labels column if row labels are present */}
                {hasRowLabels && (
                  <th
                    className="rfb-table-row-header-cell"
                    style={{
                      ...rowLabelCellStyle,
                      fontWeight: 'var(--rfb-table-header-font-weight, bold)',
                      fontFamily: 'var(--rfb-table-header-font-family, inherit)',
                      backgroundColor: '#eaecf0',
                      borderBottom: '1px solid #d0d5dd',
                      borderRight: '1px solid #d0d5dd',
                    }}
                  />
                )}
                {data.columns.map((column, columnIndex) => (
                  <th
                    key={`header_${columnIndex}`}
                    className="rfb-table-column-header"
                    style={{
                      position: 'relative',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontWeight: 'var(--rfb-table-header-font-weight, bold)',
                      fontFamily: 'var(--rfb-table-header-font-family, inherit)',
                      padding: '10px 8px',
                      width: `${columnWidths[columnIndex]}%`,
                      maxWidth: `${columnWidths[columnIndex]}%`,
                      minWidth: `${columnWidths[columnIndex]}%`,
                      boxSizing: 'border-box',
                      backgroundColor: '#eaecf0',
                      border: '1px solid #d0d5dd',
                    }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: stripPTags(column.text) }} />
                    {column.required && <RequiredBadge />}
                    {canResizeColumns && columnIndex < relativeWidths.length - 1 && (
                      <ColumnResizeHandle
                        columnIndex={columnIndex}
                        onResizeStart={startColumnResize}
                      />
                    )}
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
                    className="row-label rfb-table-row-label"
                    style={{
                      ...rowLabelCellStyle,
                      textAlign: 'right',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      fontWeight: 'var(--rfb-table-row-font-weight, bold)',
                      fontFamily: 'var(--rfb-table-row-font-family, inherit)',
                      border: '1px solid #d0d5dd',
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: data.rowLabels[rowIndex]
                          ? stripPTags(data.rowLabels[rowIndex].text)
                          : '',
                      }}
                    />
                  </td>
                )}
                {row.map((item, columnIndex) => {
                  // Get column width with proper fallback handling
                  let columnWidth = 100 / row.length // Default: equal distribution

                  if (columnWidths.length > 0 && columnIndex < columnWidths.length) {
                    const calculatedWidth = columnWidths[columnIndex]
                    if (!Number.isNaN(calculatedWidth) && calculatedWidth > 0) {
                      columnWidth = calculatedWidth
                    }
                  }

                  return (
                    <td
                      key={`${rowIndex}_${columnIndex}_${item || '_'}`}
                      style={{
                        position: 'relative',
                        padding: '12px',
                        width: `${columnWidth}%`,
                        maxWidth: `${columnWidth}%`,
                        verticalAlign: 'top',
                        boxSizing: 'border-box',
                        border: '1px solid #d0d5dd',
                      }}
                    >
                      {controls ? (
                        controls[rowIndex]?.[columnIndex]
                      ) : (
                        <Dustbin
                          style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
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
                      {canResizeColumns &&
                        !hasColumnHeaders &&
                        columnIndex < relativeWidths.length - 1 && (
                          <ColumnResizeHandle
                            columnIndex={columnIndex}
                            onResizeStart={startColumnResize}
                          />
                        )}
                    </td>
                  )
                })}
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
