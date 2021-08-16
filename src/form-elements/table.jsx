import React, { useRef, useState } from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
// import FormElements from '../form-elements';

export default class Table extends React.Component {
  self = this;
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.state = {
      rows: props.data.rows,
      columns: props.data.columns,
      defaultValue: props.defaultValue,
      inputs: Table.getInputValues(props.defaultValue, props.data.columns, props.data.rows),
    };
  }

  static getInputValues = (defaultValue = [], columns, rows) => {
    const result = [];
    Array.from(Array(Number(rows)).keys()).map((i) => {
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
        rows: props.data.rows,
        columns: props.data.columns,
        defaultValue: state.defaultValue,
        inputs: Table.getInputValues(state.inputs, props.data.columns, props.data.rows),
      }
    }

    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log('Table default prop changed', state.defaultValue, props.defaultValue)
      return {
        rows: props.data.rows,
        columns: props.data.columns,
        defaultValue: props.defaultValue,
        inputs: Table.getInputValues(props.defaultValue, props.data.columns, props.data.rows),
      }
    }

    return state;
  }

  renderRows = () => {
    if (!Number(this.props.data?.rows)) {
      return;
    }
    return (
      <tbody>
      {
        Array.from(Array(Number(this.props.data?.rows)).keys()).map((i) => (
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

  render () {
    let baseClasses = 'SortableItem rfb-item';
    if (this.props?.data?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

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
                    <th scope="col">{col.text}</th>
                  );
                })
              }
              </tr>
            </thead>
            {
              this.renderRows()
            }
          </table>
        </div>  
      </div>
    )
  }
}
