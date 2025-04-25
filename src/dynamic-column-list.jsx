/**
 * <DynamicColumnList />
 */
import React from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line import/no-cycle
import FormElementsEdit from './form-elements-edit'
import ID from './UUID'

export default class DynamicColumnList extends React.Component {
  constructor(props) {
    super(props)
    const { element } = props
    this.state = {
      element,
      showEditModal: false,
      editingColumn: null,
      dirty: false,
    }
  }

  handleEditModalClose = () => {
    this.setState({
      showEditModal: false,
      editingColumn: null,
    })
  }

  _setValue = (text) => `${text}`.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()

  editColumn = (index, key, e) => {
    const { element } = this.state
    const val =
      element.columns[index].value !== this._setValue(element.columns[index][key])
        ? element.columns[index].value
        : this._setValue(e.target.value)

    element.columns[index][key] = e.target.value
    element.columns[index].value = val
    this.setState({ element, dirty: true })
  }

  updateColumn = () => {
    const { element, dirty } = this.state
    const { updateElement, preview } = this.props
    if (dirty) {
      updateElement.call(preview, element)
      this.setState({ dirty: false })
    }
  }

  addColumn = (index) => {
    const { element } = this.state
    const { updateElement, preview } = this.props
    element.columns.splice(index + 1, 0, {
      value: '',
      text: '',
      key: ID.uuid(),
      width: 1,
    })
    updateElement.call(preview, element)
  }

  removeColumn = (index) => {
    const { element } = this.state
    const { updateElement, preview } = this.props
    element.columns.splice(index, 1)
    updateElement.call(preview, element)
  }

  editColumnSettings = (column) => {
    this.setState({
      showEditModal: true,
      editingColumn: column,
    })
  }

  render() {
    const { element, dirty, showEditModal, editingColumn } = this.state
    const { preview } = this.props

    if (dirty) {
      element.dirty = true
    }

    return (
      <>
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
                <div className="col-sm-3" />
              </div>
            </li>
            {element.columns.map((option, index) => {
              const editKey = `edit_${option.key}`
              return (
                <li className="clearfix" key={editKey}>
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
                        onBlur={this.updateColumn}
                        onChange={(e) => this.editColumn(index, 'text', e)}
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
                        onBlur={this.updateColumn}
                        onChange={(e) => this.editColumn(index, 'width', e)}
                      />
                    </div>
                    <div className="col-sm-3">
                      <div className="dynamic-options-actions-buttons">
                        <select
                          className="form-control"
                          value={option.type || 'text'}
                          onChange={(e) => this.editColumn(index, 'type', e)}
                          onBlur={this.updateColumn}
                        >
                          <option value="multiple">Multiple Choice</option>
                          <option value="text">Text Input</option>
                          <option value="textarea">Multi-line Input</option>
                          <option value="number">Number Input</option>
                          <option value="date">Date</option>
                          <option value="signature">Signature</option>
                          <option value="checkbox">Checkboxes</option>
                        </select>
                        <button
                          onClick={() => this.editColumnSettings(option)}
                          className="btn btn-primary"
                        >
                          <i className="fas fa-cog" />
                        </button>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="dynamic-options-actions-buttons">
                        <button
                          onClick={() => this.addColumn(index)}
                          className="btn btn-success"
                        >
                          <i className="fas fa-plus-circle" />
                        </button>
                        {index > 0 && (
                          <button
                            onClick={() => this.removeColumn(index)}
                            className="btn btn-danger"
                          >
                            <i className="fas fa-minus-circle" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {showEditModal && editingColumn && (
          <div className="modal show d-block">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <FormElementsEdit
                  element={editingColumn}
                  updateElement={(updatedElement) => {
                    const { element } = this.state
                    const columns = [...element.columns]
                    const index = columns.findIndex(
                      (col) => col.key === updatedElement.key
                    )
                    if (index !== -1) {
                      columns[index] = updatedElement
                      this.setState(
                        (prevState) => {
                          const newElement = { ...prevState.element }
                          newElement.columns = columns
                          return { element: newElement, dirty: true }
                        },
                        () => {
                          this.updateColumn()
                          this.handleEditModalClose()
                        }
                      )
                    }
                  }}
                  manualEditModeOff={this.handleEditModalClose}
                  preview={preview}
                />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

DynamicColumnList.propTypes = {
  element: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        type: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  preview: PropTypes.shape({}).isRequired,
  updateElement: PropTypes.func.isRequired,
}
