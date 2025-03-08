/**
 * <FixedRowList />
 */
import React from 'react'
import ID from './UUID'

export default class FixedRowList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
    }
  }

  _setValue(text) {
    return `${text}`.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()
  }

  editRow(index, key, e) {
    const this_element = this.state.element
    const val =
      this_element.rowLabels[index].value !==
      this._setValue(this_element.rowLabels[index][key])
        ? this_element.rowLabels[index].value
        : this._setValue(e.target.value)

    this_element.rowLabels[index][key] = e.target.value
    this_element.rowLabels[index].value = val
    this.setState({
      element: this_element,
      dirty: true,
    })
  }

  updateRow() {
    const this_element = this.state.element
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element)
      this.setState({ dirty: false })
    }
  }

  addRow(index) {
    const this_element = this.state.element
    this_element.rowLabels.splice(index + 1, 0, { value: '', text: '', key: ID.uuid() })
    this.props.updateElement.call(this.props.preview, this_element)
  }

  removeRow(index) {
    const this_element = this.state.element
    this_element.rowLabels.splice(index, 1)
    this.props.updateElement.call(this.props.preview, this_element)
  }

  render() {
    if (this.state.dirty) {
      this.state.element.dirty = true
    }

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
          <li className="clearfix" key={`li_label_x`}>
            <div className="row">
              <div className="col-sm-9">Row Label</div>
              <div className="col-sm-3">
                <div className="dynamic-options-actions-buttons">
                  <button
                    onClick={this.addRow.bind(this, -1)}
                    className="btn btn-success"
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                </div>
              </div>
            </div>
          </li>
          {this.props.element.rowLabels.map((option, index) => {
            const this_key = `edit_${option.key}`
            const val = option.value !== this._setValue(option.text) ? option.value : ''

            return (
              <>
                <li className="clearfix" key={`li_label_${this_key}`}>
                  <div className="row">
                    <div className="col-sm-9">
                      <input
                        tabIndex={index + 1}
                        key={`input_label_${this_key}`}
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
                          <i className="fas fa-plus-circle"></i>
                        </button>
                        {
                          <button
                            onClick={this.removeRow.bind(this, index)}
                            className="btn btn-danger"
                          >
                            <i className="fas fa-minus-circle"></i>
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                </li>
              </>
            )
          })}
        </ul>
      </div>
    )
  }
}
