/**
 * <DynamicOptionList />
 */
import React from 'react'
import ID from './UUID'

export default class DynamicOptionList extends React.Component {
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

  editOption(option_index, e) {
    const this_element = this.state.element
    const val =
      this_element.options[option_index].value !==
      this._setValue(this_element.options[option_index].text)
        ? this_element.options[option_index].value
        : this._setValue(e.target.value)

    this_element.options[option_index].text = e.target.value
    this_element.options[option_index].value = val
    this.setState({
      element: this_element,
      dirty: true,
    })

    // Sync with other elements in the same column immediately if this element is part of a dynamic column
    if (this.props.preview && this.props.element.parentId) {
      this.syncOptionsWithSameColumnElements(this_element.options)
    }
  }

  editValue(option_index, e) {
    const this_element = this.state.element
    const val =
      e.target.value === ''
        ? this._setValue(this_element.options[option_index].text)
        : e.target.value
    this_element.options[option_index].value = val
    this.setState({
      element: this_element,
      dirty: true,
    })

    // Sync with other elements in the same column immediately if this element is part of a dynamic column
    if (this.props.preview && this.props.element.parentId) {
      this.syncOptionsWithSameColumnElements(this_element.options)
    }
  }

  // eslint-disable-next-line no-unused-vars
  editOptionCorrect(option_index, e) {
    const this_element = this.state.element
    if (this_element.options[option_index].hasOwnProperty('correct')) {
      delete this_element.options[option_index].correct
    } else {
      this_element.options[option_index].correct = true
    }
    this.setState({ element: this_element })
    this.props.updateElement.call(this.props.preview, this_element)

    // Sync with other elements in the same column if this element is part of a dynamic column
    if (this.props.preview && this.props.element.parentId) {
      this.syncOptionsWithSameColumnElements(this_element.options)
    }
  }

  editOptionInfo(option_index, e) {
    const this_element = this.state.element
    if (this_element.options[option_index].hasOwnProperty('info')) {
      delete this_element.options[option_index].info
    } else {
      this_element.options[option_index].info = true
    }
    this.setState({ element: this_element })
    this.props.updateElement.call(this.props.preview, this_element)
  }

  updateOption() {
    const this_element = this.state.element
    // to prevent ajax calls with no change
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element)
      this.setState({ dirty: false })

      // Sync with other elements in the same column if this element is part of a dynamic column
      if (this.props.preview && this.props.element.parentId) {
        this.syncOptionsWithSameColumnElements(this_element.options)
      }
    }
  }

  addOption(index) {
    const this_element = this.state.element
    const nextValue =
      Math.max(
        ...this_element.options.map(({ value }) => (isNaN(value) ? 0 : parseInt(value)))
      ) + 1

    this_element.options.splice(index + 1, 0, {
      value: nextValue,
      text: '',
      key: ID.uuid(),
    })

    this.setState({
      element: this_element,
      dirty: true,
    })

    // Sync with other elements in the same column if this element is part of a dynamic column
    if (this.props.preview && this.props.element.parentId) {
      this.syncOptionsWithSameColumnElements(this_element.options)
    }
  }

  removeOption(index) {
    const this_element = this.state.element
    this_element.options.splice(index, 1)
    this.setState({
      element: this_element,
      dirty: true,
    })

    // Sync with other elements in the same column if this element is part of a dynamic column
    if (this.props.preview && this.props.element.parentId) {
      this.syncOptionsWithSameColumnElements(this_element.options)
    }
  }

  syncOptionsWithSameColumnElements(options) {
    // Check if we have the necessary context and if the element is in a dynamic column
    if (!this.props.preview || !this.props.element.parentId) {
      return
    }

    // Get the parent element and verify it's available
    let parentElement
    const getDataById =
      this.props.preview.getDataById ||
      (this.props.preview.state &&
        this.props.preview.state.data &&
        ((id) => this.props.preview.state.data.find((x) => x.id === id)))

    if (typeof getDataById === 'function') {
      parentElement = getDataById(this.props.element.parentId)
    }

    if (
      !parentElement ||
      !parentElement.childItems ||
      parentElement.element !== 'DynamicColumnRow'
    ) {
      // Not a dynamic column or cannot access parent data
      return
    }

    // Get the current element's column index
    const columnIndex = this.props.element.col
    if (columnIndex === undefined) return

    // Get the current element's row index
    const currentRowIndex = this.props.element.row
    if (currentRowIndex === undefined) return

    // Access update function - check both direct references and nested objects
    const updateElement =
      typeof this.props.preview.updateElement === 'function'
        ? this.props.preview.updateElement
        : this.props.updateElement

    if (!updateElement) {
      return
    }

    // Loop through all rows in this column and update options
    parentElement.childItems.forEach((row, rowIndex) => {
      // Skip the current element's row
      if (rowIndex === currentRowIndex) return

      // Get the element ID at this position
      const elementId = row[columnIndex]
      if (!elementId) return

      // Get the element data
      const elementData = getDataById(elementId)

      // Verify it's the same type of element and has options
      if (
        !elementData ||
        elementData.element !== this.props.element.element ||
        !Array.isArray(elementData.options)
      ) {
        return
      }

      // Create a deep copy of options with all properties preserved
      const newOptions = options.map((option, i) => {
        // Handle case where target has fewer options than source
        if (i >= elementData.options.length) {
          // Create a new option with all properties from the source
          return {
            ...option,
            key: ID.uuid(),
          }
        } else {
          // For existing options, preserve the key but copy all other properties
          const key = elementData.options[i].key
          return {
            ...option,
            key: key || ID.uuid(),
            // Explicitly copy these properties to ensure they're synchronized
            info: option.hasOwnProperty('info') ? option.info : undefined,
            correct: option.hasOwnProperty('correct') ? option.correct : undefined,
          }
        }
      })

      // Create a new element with updated options
      const updatedElement = {
        ...elementData,
        options: newOptions,
        dirty: true,
      }

      // Update the element
      updateElement(updatedElement)
    })
  }

  render() {
    if (this.state.dirty) {
      this.state.element.dirty = true
    }

    // Determine if the element is inside a dynamic column
    const isInDynamicColumn =
      this.props.element &&
      this.props.element.parentId &&
      this.props.element.col !== undefined &&
      this.props.element.row !== undefined

    // For checkboxes in dynamic columns, we always want to show the Info option
    const shouldShowInfo =
      this.props.canHaveInfo ||
      (isInDynamicColumn && this.props.element.element === 'Checkboxes')

    // For checkboxes in dynamic columns, we always want to show the Correct option too
    const shouldShowCorrect =
      this.props.canHaveOptionCorrect ||
      (isInDynamicColumn && this.props.element.element === 'Checkboxes')

    return (
      <div className="dynamic-option-list">
        <ul>
          <li>
            <div className="row">
              <div className="col-sm-5">
                <b>Options</b>
              </div>
              {this.props.canHaveOptionValue && (
                <div className="col-sm-2">
                  <b>Value</b>
                </div>
              )}
              {shouldShowInfo && (
                <div className="col-sm-1">
                  <b>Info</b>
                </div>
              )}
              {shouldShowCorrect && (
                <div className="col-sm-1">
                  <b>Correct</b>
                </div>
              )}
            </div>
          </li>
          {this.state.element.options.map((option, index) => {
            const this_key = `edit_${option.key}`
            const val = option.value !== this._setValue(option.text) ? option.value : ''
            return (
              <li className="clearfix" key={this_key}>
                <div className="row">
                  <div className="col-sm-5">
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: '100%' }}
                      value={option.text}
                      onChange={this.editOption.bind(this, index)}
                      onBlur={this.updateOption.bind(this)}
                    />
                  </div>
                  {this.props.canHaveOptionValue && (
                    <div className="col-sm-2">
                      <input
                        type="text"
                        className="form-control"
                        style={{ width: '100%' }}
                        value={val}
                        onChange={this.editValue.bind(this, index)}
                        onBlur={this.updateOption.bind(this)}
                      />
                    </div>
                  )}

                  {this.props.canHaveOptionValue && this.props.canHaveInfo && (
                    <div className="col-sm-1">
                      <input
                        className="form-control"
                        type="checkbox"
                        value="1"
                        checked={option.hasOwnProperty('info')}
                        onChange={this.editOptionInfo.bind(this, index)}
                      />
                    </div>
                  )}
                  {this.props.canHaveOptionValue && this.props.canHaveOptionCorrect && (
                    <div className="col-sm-1">
                      <input
                        className="form-control"
                        type="checkbox"
                        value="1"
                        checked={option.hasOwnProperty('correct')}
                        onChange={this.editOptionCorrect.bind(this, index)}
                      />
                    </div>
                  )}

                  <div className="col-sm-3">
                    <div className="dynamic-options-actions-buttons">
                      <button
                        onClick={this.addOption.bind(this, index)}
                        className="btn btn-success"
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                      {index > 0 && (
                        <button
                          onClick={this.removeOption.bind(this, index)}
                          className="btn btn-danger"
                        >
                          <i className="fas fa-minus-circle"></i>
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
    )
  }
}
