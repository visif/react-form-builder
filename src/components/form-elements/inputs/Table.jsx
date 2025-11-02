import React from 'react'
import { Button } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

import PropTypes from 'prop-types'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const getInputValues = (defaultValue = [], columns, rows, addingRows, rowLabels) => {
  const result = []
  const isFixedRow = rowLabels?.length > 0
  const activeRows = isFixedRow ? rowLabels?.length : rows + addingRows
  Array.from(Array(Number(activeRows)).keys()).map((i) => {
    const current = []
    columns.map((j, jIndex) => {
      let value = defaultValue[i] ? (defaultValue[i][jIndex] ?? '') : ''
      if (isFixedRow && jIndex === 0) {
        value = rowLabels[i].text
      }
      current.push(value)
    })
    result.push(current)
  })

  return result
}

const Table = (props) => {
  const tableRef = React.useRef(null)

  const initialRowsAdded =
    (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) -
    Number(props.data.rows)

  const [rows, setRows] = React.useState(Number(props.data.rows))
  const [rowLabels, setRowLabels] = React.useState(props.data.rowLabels)
  const [columns, setColumns] = React.useState(props.data.columns)
  const [defaultValue, setDefaultValue] = React.useState(props.defaultValue)
  const [inputs, setInputs] = React.useState(
    getInputValues(
      props.defaultValue,
      props.data.columns,
      Number(props.data.rows),
      initialRowsAdded,
      props.data.rowLabels
    )
  )
  const [rowsAdded, setRowsAdded] = React.useState(initialRowsAdded)

  React.useEffect(() => {
    console.log('Table useEffect - columns/rows check')
    if (
      Number(props.data.rows) !== Number(rows) ||
      JSON.stringify(props.data.columns) !== JSON.stringify(columns) ||
      JSON.stringify(rowLabels) !== JSON.stringify(props.data.rowLabels)
    ) {
      console.log('Table default columns/rows changed')
      setRows(Number(props.data.rows))
      setColumns(props.data.columns)
      setRowLabels(props.data.rowLabels)
      setInputs(
        getInputValues(
          inputs,
          props.data.columns,
          Number(props.data.rows),
          rowsAdded,
          props.data.rowLabels
        )
      )
    }
  }, [
    props.data.rows,
    props.data.columns,
    props.data.rowLabels,
    rows,
    columns,
    rowLabels,
    rowsAdded,
    inputs,
  ])

  React.useEffect(() => {
    console.log('Table useEffect - defaultValue check')
    if (JSON.stringify(defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log('Table default prop changed', defaultValue, props.defaultValue)
      const newRowsAdded =
        (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) -
        Number(props.data.rows)
      setRows(Number(props.data.rows))
      setColumns(props.data.columns)
      setDefaultValue(props.defaultValue)
      setRowLabels(props.data.rowLabels)
      setInputs(
        getInputValues(
          props.defaultValue,
          props.data.columns,
          Number(props.data.rows),
          newRowsAdded,
          props.data.rowLabels
        )
      )
      setRowsAdded(newRowsAdded)
    }
  }, [props.defaultValue, props.data.rows, props.data.columns, props.data.rowLabels, defaultValue])

  const addRow = React.useCallback(() => {
    const newRowsAdded = rowsAdded + 1
    setRowsAdded(newRowsAdded)
    setInputs(getInputValues(inputs, columns, rows, newRowsAdded))
  }, [rowsAdded, inputs, columns, rows])

  const removeRow = React.useCallback(() => {
    const newRowsAdded = rowsAdded - 1
    setRowsAdded(newRowsAdded)
    setInputs(getInputValues(inputs, columns, rows, newRowsAdded))
  }, [rowsAdded, inputs, columns, rows])

  const handleInputChange = React.useCallback((rowIndex, colIndex, value) => {
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs]
      if (!newInputs[rowIndex]) {
        newInputs[rowIndex] = []
      }
      newInputs[rowIndex][colIndex] = value
      return newInputs
    })
  }, [])

  const getColumnWidth = React.useCallback((totalWidthCount, width) => {
    const currentWidth = parseInt(width) ? Number(width) : 1
    return `${(currentWidth / totalWidthCount) * 100}%`
  }, [])

  const renderRows = React.useCallback(() => {
    const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

    const savedEditor = props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor =
        userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
    }

    const isFixedRow = rowLabels?.length > 0
    const activeRows = isFixedRow ? rowLabels?.length : rows + rowsAdded

    return (
      <tbody>
        {Array.from(Array(Number(activeRows)).keys()).map((i) => (
          <tr key={'row' + i}>
            {props.data?.columns?.map((j, jIndex) => {
              const isLabel = isFixedRow && jIndex === 0

              if (isLabel) {
                return (
                  <td key={`cell-${i}-${jIndex}`}>
                    <label>{rowLabels[i].text}</label>
                  </td>
                )
              }

              const value = inputs[i] ? (inputs[i][jIndex] ?? '') : ''

              return (
                <td key={`cell-${i}-${jIndex}`}>
                  <textarea
                    className="form-control"
                    style={isLabel ? { border: 0, backgroundColor: 'inherit' } : {}}
                    disabled={isLabel || !isSameEditor}
                    type="text"
                    value={value}
                    rows={1}
                    onChange={(event) => {
                      handleInputChange(i, jIndex, event.target.value)
                    }}
                  />
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    )
  }, [props, rowLabels, rows, rowsAdded, inputs, handleInputChange])

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props?.data?.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }
  const totalWidthCount = props.data?.columns.reduce((previous, current) => {
    return previous + (parseInt(current.width) ? Number(current.width) : 1)
  }, 0)
  const isFixedRow = rowLabels?.length > 0

  return (
    <div className={baseClasses} key={`table-container-${props.id}`}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        <table className="table table-bordered" ref={tableRef} key={`table-${props.id}`}>
          <thead>
            <tr>
              {props.data?.columns?.map((col, colIndex) => {
                return (
                  <th
                    key={`header-${colIndex}`}
                    scope="col"
                    style={{
                      width: getColumnWidth(totalWidthCount, col.width),
                    }}
                  >
                    {col.text}
                  </th>
                )
              })}
            </tr>
          </thead>
          {renderRows()}
        </table>
        {!isFixedRow && (
          <div style={{ textAlign: 'right' }}>
            <Button
              type="default"
              icon={<MinusOutlined />}
              onClick={removeRow}
              style={{
                marginRight: 8,
                display: inputs.length > 0 ? 'initial' : 'none',
              }}
              disabled={!isSameEditor}
            >
              Remove Row
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              disabled={!isSameEditor}
              onClick={addRow}
            >
              Add Row
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

Table.propTypes = {
  data: PropTypes.shape({
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    columns: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    rowLabels: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    required: PropTypes.bool,
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    label: PropTypes.string,
  }).isRequired,
  defaultValue: PropTypes.array,
  read_only: PropTypes.bool,
  editor: PropTypes.shape({
    email: PropTypes.string,
  }),
}

export default Table
