import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';

export default class Table extends React.Component {
  self = this;
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    const rowsAdded = (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) - Number(props.data.rows);
    this.state = {
      rows: Number(props.data.rows),
      rowLabels: props.data.rowLabels,
      columns: props.data.columns,
      defaultValue: props.defaultValue,
      inputs: Table.getInputValues(
        props.defaultValue, 
        props.data.columns, 
        Number(props.data.rows), 
        rowsAdded,
        props.data.rowLabels,
      ),
      rowsAdded,
    };
  }

  static getInputValues = (defaultValue = [], columns, rows, addingRows, rowLabels) => {
    const result = [];
    const isFixedRow = rowLabels?.length > 0;
    const activeRows = isFixedRow ? rowLabels?.length : (rows + addingRows);
    Array.from(Array(Number(activeRows)).keys()).map((i) => {
      const current = []
      columns.map((j, jIndex) => {
        let value = defaultValue[i] ? (defaultValue[i][jIndex] ?? '') : '';
        if (isFixedRow && jIndex === 0) {
          value = rowLabels[i].text;
        }
        current.push(value)
      })
      result.push(current)
    })

    return result;
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log('Table getDerivedStateFromProps')
    if (Number(props.data.rows) !== Number(state.rows) 
      || (JSON.stringify(props.data.columns) !== JSON.stringify(state.columns))
      || (JSON.stringify(state.rowLabels) !== JSON.stringify(props.data.rowLabels))
    ) {
      console.log('Table default columns/rows changed')
      return {
        rows: Number(props.data.rows),
        columns: props.data.columns,
        defaultValue: state.defaultValue,
        inputs: Table.getInputValues(state.inputs, props.data.columns, Number(props.data.rows), state.rowsAdded, props.data.rowLabels),
        rowsAdded: state.rowsAdded,
        rowLabels: props.data.rowLabels,
      }
    }

    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log('Table default prop changed', state.defaultValue, props.defaultValue)
      const rowsAdded = (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) - Number(props.data.rows);
      return {
        rows: Number(props.data.rows),
        columns: props.data.columns,
        defaultValue: props.defaultValue,
        inputs: Table.getInputValues(props.defaultValue, props.data.columns, Number(props.data.rows), rowsAdded, props.data.rowLabels),
        rowsAdded,
        rowLabels: props.data.rowLabels,
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
    const isFixedRow = this.state.rowLabels?.length > 0;
    const activeRows =  isFixedRow ? this.state.rowLabels?.length : (this.state.rows + this.state.rowsAdded);
    return (
      <tbody>
      {

        Array.from(Array(Number(activeRows)).keys()).map((i) => (
          <tr key={"row" + i}>
          {
            this.props.data?.columns?.map((j, jIndex) => {
              const isLabel =  (isFixedRow && jIndex === 0);
              const value = isLabel ? this.state.rowLabels[i].text
                : (this.state.inputs[i] ? (this.state.inputs[i][jIndex] ?? '') : '')
              return (
                <td>
                  <input
                    className="form-control"
                    style={isLabel ? { border: 0, backgroundColor: 'inherit'} : {}}
                    disabled={isLabel}
                    type="text"
                    value={value}
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
      <div className={baseClasses} key={`table-container-${this.props.id}`}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <table 
            className="table table-bordered"
            ref={this.tableRef}
            key={`table-${this.props.id}`}
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
