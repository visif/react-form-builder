import React, { useRef, useState } from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
// import FormElements from '../form-elements';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.state = {
      rows: props.rows || 3,
      cols: props.cols || 3,
      inputs: this.getInputValues(props),
    };
  }

  getInputValues = (props) => {
    const result = [];
    Array.from(Array(props.rows || 3).keys()).map((i) => {
      const current = []
      Array.from(Array(props.cols || 3).keys()).map((j) => {
        current.push('')
      })
      result.push(current)
    })

    return result;
  }

  renderRows = (rows, cols) => {
    if (!rows) {
      return;
    }
    return (
      <tbody>
      {
        Array.from(Array(rows).keys()).map((i) => (
          <tr key={"row" + i}>
          {
            Array.from(Array(cols).keys()).map((j) => {
              return (
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={this.state.inputs[i][j]}
                    onChange={(event) => {
                      const value = event.target.value;
                      const array = this.state.inputs;
                      array[i][j] = value;
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
                <th scope="col">Col 1</th>
                <th scope="col">Col 2</th>
                <th scope="col">Col 3</th>
              </tr>
            </thead>
            {
              this.renderRows(this.state.rows, this.state.cols)
            }
          </table>
        </div>  
      </div>
    )
  }
}
