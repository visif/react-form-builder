import { isNumber } from 'lodash-es';
import React, { useRef, useState } from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
// import FormElements from '../form-elements';

/*
[
  [
    "1",
    "มีนา",
    "ๅ"
  ],
  [
    "2",
    "มานี",
    "ๅ"
  ],
  [
    "3",
    "ชูใจ",
    "ๅ"
  ],
  [
    "4",
    "This is new added row",
    "ลองเพิ่มใหม่"
  ]
]
*/

export default class Table extends React.Component {
  self = this;
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    const rowsAdded = (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) - Number(props.data.rows);
    this.state = {
      rows: Number(props.data.rows),
      columns: props.data.columns,
      defaultValue: props.defaultValue,
      inputs: Table.getInputValues(props.defaultValue, props.data.columns, Number(props.data.rows), rowsAdded),
      rowsAdded,
    };
  }

  static getInputValues = (defaultValue = [], columns, rows, addingRows) => {
    const result = [];
    Array.from(Array(Number(rows + addingRows)).keys()).map((i) => {
      const current = []
      columns.map((j, jIndex) => {
        const value = defaultValue[i] ? (defaultValue[i][jIndex] ?? '') : '';
        current.push(value)
      })
      result.push(current)
    })

    return result;
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log('Table getDerivedStateFromProps')
    if (Number(props.data.rows) !== Number(state.rows) 
      || JSON.stringify(props.data.columns) !== JSON.stringify(state.columns)
    ) {
      console.log('Table default columns/rows changed')
      return {
        rows: Number(props.data.rows),
        columns: props.data.columns,
        defaultValue: state.defaultValue,
        inputs: Table.getInputValues(state.inputs, props.data.columns, Number(props.data.rows), state.rowsAdded),
        rowsAdded: state.rowsAdded,
      }
    }

    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log('Table default prop changed', state.defaultValue, props.defaultValue)
      const rowsAdded = (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) - Number(props.data.rows);
      return {
        rows: Number(props.data.rows),
        columns: props.data.columns,
        defaultValue: props.defaultValue,
        inputs: Table.getInputValues(props.defaultValue, props.data.columns, Number(props.data.rows), rowsAdded),
        rowsAdded,
      }
    }

    return state;
  }

  addRow = () => {
    this.setState((current) => ({
      ...current,
      rowsAdded: current.rowsAdded + 1,
      inputs: Table.getInputValues(current.inputs, current.columns, current.rows, current.rowsAdded + 1),
    }))
  }

  removeRow = () => {
    this.setState((current) => ({
      ...current,
      rowsAdded: current.rowsAdded - 1,
      inputs: Table.getInputValues(current.inputs, current.columns, current.rows, current.rowsAdded - 1),
    }))
  }

  renderRows = () => {
    return (
      <tbody>
      {
        Array.from(Array(Number(this.state.inputs.length)).keys()).map((i) => (
          <tr key={"row" + i}>
          {
            this.props.data?.columns?.map((j, jIndex) => {
              return (
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={this.state.inputs[i] ? (this.state.inputs[i][jIndex] ?? '') : ''}
                    onChange={(event) => {
                      const value = event.target.value;
                      const array = this.state.inputs;
                      array[i][jIndex] = value;
                      this.setState({
                        inputs: array
                      })
                    }}
                  />
              </td>
              );
            })
          }
          </tr>
        ))
      }
      </tbody>
    );
  }

  getColumnWidth = (totalWidthCount, width) => {
    const currentWidth = (parseInt(width) ? Number(width) : 1)
    return `${(currentWidth / totalWidthCount) * 100}%`;
  }

  render () {
    let baseClasses = 'SortableItem rfb-item';
    if (this.props?.data?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }
    const totalWidthCount = this.props.data?.columns.reduce((previous, current) => {
      return previous + (parseInt(current.width) ? Number(current.width) : 1)
    }, 0);

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <table 
            className="table table-bordered"
            ref={this.tableRef}
          >
            <thead>
              <tr>
              {
                this.props.data?.columns?.map((col) => {
                  return (
                    <th 
                      scope="col"
                      style={{ width: this.getColumnWidth(totalWidthCount, col.width)}}
                    >{col.text}</th>
                  );
                })
              }
              </tr>
            </thead>
            {
              this.renderRows()
            }
          </table>
          <div style={{ textAlign: 'right' }}>
            <button 
              type="button" 
              class="btn btn-secondary" 
              onClick={this.removeRow}
              style={{ marginRight: 8, display: this.state.inputs.length > 0 ? 'initial' : 'none'}}
            >Remove Row</button>
            <button type="button" class="btn btn-info" onClick={this.addRow}>Add Row</button>
          </div>
        </div>  
      </div>
    )
  }
}
