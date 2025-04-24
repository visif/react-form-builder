/**
 * <DynamicColumnList />
 */
import React from 'react'
import ID from './UUID'

export default class DynamicColumnList extends React.Component {
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

  editColumn(index, key, e) {
    const this_element = this.state.element
    const val =
      this_element.columns[index].value !==
      this._setValue(this_element.columns[index][key])
        ? this_element.columns[index].value
        : this._setValue(e.target.value)

    this_element.columns[index][key] = e.target.value
    this_element.columns[index].value = val
    this.setState({
      element: this_element,
      dirty: true,
    })
  }

  updateColumn() {
    const this_element = this.state.element
    // to prevent ajax calls with no change
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element)
      this.setState({ dirty: false })
    }
  }

  addColumn(index) {
    const this_element = this.state.element
    this_element.columns.splice(index + 1, 0, {
      value: '',
      text: '',
      key: ID.uuid(),
      width: 1,
    })
    this.props.updateElement.call(this.props.preview, this_element)
  }

  removeColumn(index) {
    const this_element = this.state.element
    this_element.columns.splice(index, 1)
    this.props.updateElement.call(this.props.preview, this_element)
  }

  render() {
    if (this.state.dirty) {
      this.state.element.dirty = true
    }

    return (
      <div className="dynamic-option-list">
        <ul>
          <li>
            <div className="row">
              <div className="col-sm-12">
                <b>Columns</b>
              </div>
            </div>
          </li>
          <li className="clearfix">
            <div className="row">
              <div className="col-sm-3">Header Text</div>
              <div className="col-sm-2">Width</div>
              <div className="col-sm-3">Type</div>
              <div className="col-sm-3"></div>
            </div>
          </li>
          {this.props.element.columns.map((option, index) => {
            const this_key = `edit_${option.key}`
            const val = option.value !== this._setValue(option.text) ? option.value : ''
            return (
              <>
              <li className="clearfix" key={this_key}>
                <div className="row">
                <div className="col-sm-3">
                  <input
                  tabIndex={index + 1}
                  className="form-control"
                  style={{ width: '100%' }}
                  type="text"
                  name={`text_${index}`}
                  placeholder="Option text"
                  value={option.text}
                  onBlur={this.updateColumn.bind(this)}
                  onChange={this.editColumn.bind(this, index, 'text')}
                  />
                </div>
                <div className="col-sm-2">
                  <input
                  tabIndex={index + 1}
                  className="form-control"
                  style={{ width: '100%' }}
                  type="text"
                  name={`text_${index}`}
                  placeholder="Width"
                  value={option.width}
                  onBlur={this.updateColumn.bind(this)}
                  onChange={this.editColumn.bind(this, index, 'width')}
                  />
                </div>
                <div className="col-sm-3">
                  <div className="dynamic-options-actions-buttons">
                  <select
                    className="form-control"
                    value={option.type || 'text'}
                    onChange={this.editColumn.bind(this, index, 'type')}
                    onBlur={this.updateColumn.bind(this)}
                  >
                    <option value="multiple">Multiple Choice</option>
                    <option value="text">Text Input</option>
                    ฒ<option value="textarea">Multi-line Input</option>
                    <option value="number">Number Input</option>
                    <option value="date">Date</option>
                    <option value="signature">Signature</option>
                    <option value="checkbox">Checkboxes</option>
                  </select>
                  <button
                    onClick={() => window.alert(`Column: ${option.text || 'Unnamed column'}`)}
                    className="btn btn-primary"
                  >
                    <i className="fas fa-cog"></i>
                  </button>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="dynamic-options-actions-buttons">
                  <button
                    onClick={this.addColumn.bind(this, index)}
                    className="btn btn-success"
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                  {index > 0 && (
                    <button
                    onClick={this.removeColumn.bind(this, index)}
                    className="btn btn-danger"
                    >
                    <i className="fas fa-minus-circle"></i>
                    </button>
                  )}
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

