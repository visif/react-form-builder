/**
 * <DynamicOptionList />
 */
import React from 'react'
import PropTypes from 'prop-types'
import ID from './UUID'

export default class DynamicOptionList extends React.Component {
  static propTypes = {
    element: PropTypes.shape({
      options: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          key: PropTypes.string,
        })
      ).isRequired,
      parentId: PropTypes.string,
      col: PropTypes.number,
      row: PropTypes.number,
      element: PropTypes.string,
    }).isRequired,
    data: PropTypes.shape({}),
    updateElement: PropTypes.func,
    preview: PropTypes.shape({
      state: PropTypes.shape({
        data: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
          })
        ),
      }),
      getDataById: PropTypes.func,
      updateElement: PropTypes.func,
    }),
    canHaveOptionValue: PropTypes.bool,
    canHaveOptionCorrect: PropTypes.bool,
    canHaveInfo: PropTypes.bool,
  }

  static defaultProps = {
    data: {},
    updateElement: () => {},
    preview: null,
    canHaveOptionValue: false,
    canHaveOptionCorrect: false,
    canHaveInfo: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
    }
    this.previousTime = 0
    this.timeoutId = null
  }

  // Throttle utility function
  throttle =
    (func, wait) =>
    (...args) => {
      const now = Date.now()
      const remaining = wait - (now - this.previousTime)

      if (remaining <= 0 || remaining > wait) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
        }
        this.previousTime = now
        func.apply(this, args)
      } else if (!this.timeoutId) {
        this.timeoutId = setTimeout(() => {
          this.previousTime = now
          this.timeoutId = null
          func.apply(this, args)
        }, remaining)
      }
    }

  // Clean up any pending timeouts
  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  setValue = (text) => text.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()

  handleOptionChange = this.throttle((optionIndex, { target: { value } }) => {
    const { element } = this.state
    const newElement = { ...element }
    const val =
      newElement.options[optionIndex].value !==
      this.setValue(newElement.options[optionIndex].text)
        ? newElement.options[optionIndex].value
        : this.setValue(value)

    newElement.options[optionIndex].text = value
    newElement.options[optionIndex].value = val

    this.setState({ element: newElement, dirty: true }, () => {
      this.syncOptionsWithSameColumnElements(newElement.options)
    })
  }, 200)

  handleValueChange = this.throttle((optionIndex, { target: { value } }) => {
    const { element } = this.state
    const newElement = { ...element }
    const val = value === '' ? this.setValue(newElement.options[optionIndex].text) : value
    newElement.options[optionIndex].value = val

    this.setState({ element: newElement, dirty: true }, () => {
      this.syncOptionsWithSameColumnElements(newElement.options)
    })
  }, 200)

  handleOptionCorrect = (optionIndex) => {
    this.setState(
      (prevState) => {
        const newElement = { ...prevState.element }
        const option = newElement.options[optionIndex]

        if (Object.prototype.hasOwnProperty.call(option, 'correct')) {
          delete option.correct
        } else {
          option.correct = true
        }

        return { element: newElement }
      },
      () => {
        const { updateElement, preview } = this.props
        const { element } = this.state
        updateElement.call(preview, element)
        this.syncOptionsWithSameColumnElements(element.options)
      }
    )
  }

  handleOptionInfo = (optionIndex) => {
    this.setState(
      (prevState) => {
        const newElement = { ...prevState.element }
        const option = newElement.options[optionIndex]

        if (Object.prototype.hasOwnProperty.call(option, 'info')) {
          delete option.info
        } else {
          option.info = true
        }

        return { element: newElement }
      },
      () => {
        const { updateElement, preview } = this.props
        const { element } = this.state
        updateElement.call(preview, element)
        this.syncOptionsWithSameColumnElements(element.options)
      }
    )
  }

  updateOption = () => {
    const { updateElement, preview } = this.props
    const { element, dirty } = this.state

    if (dirty) {
      updateElement.call(preview, element)
      this.setState({ dirty: false }, () => {
        this.syncOptionsWithSameColumnElements(element.options)
      })
    }
  }

  addOption = (index) => {
    this.setState(
      (prevState) => {
        const newElement = { ...prevState.element }
        const nextValue =
          Math.max(
            ...newElement.options.map(({ value }) =>
              Number.isNaN(Number(value)) ? 0 : parseInt(value, 10)
            )
          ) + 1

        newElement.options.splice(index + 1, 0, {
          value: nextValue,
          text: '',
          key: ID.uuid(),
        })

        return { element: newElement, dirty: true }
      },
      () => {
        const { element } = this.state
        this.syncOptionsWithSameColumnElements(element.options)
      }
    )
  }

  removeOption = (index) => {
    this.setState(
      (prevState) => {
        const newElement = { ...prevState.element }
        newElement.options.splice(index, 1)
        return { element: newElement, dirty: true }
      },
      () => {
        const { element } = this.state
        this.syncOptionsWithSameColumnElements(element.options)
      }
    )
  }

  syncOptionsWithSameColumnElements = (options) => {
    const {
      preview,
      element: propsElement,
      updateElement: propsUpdateElement,
    } = this.props

    if (!preview || !propsElement.parentId) {
      return
    }

    let parentElement
    const getDataById =
      preview.getDataById ||
      (preview.state?.data && ((id) => preview.state.data.find((x) => x.id === id)))

    if (typeof getDataById === 'function') {
      parentElement = getDataById(propsElement.parentId)
    }

    if (!parentElement?.childItems || parentElement.element !== 'DynamicColumnRow') {
      return
    }

    const { col: columnIndex, row: currentRowIndex } = propsElement
    if (columnIndex === undefined || currentRowIndex === undefined) {
      return
    }

    const updateElement =
      typeof preview.updateElement === 'function'
        ? preview.updateElement
        : propsUpdateElement

    if (!updateElement) {
      return
    }

    parentElement.childItems.forEach((row, rowIndex) => {
      if (rowIndex === currentRowIndex) return

      const elementId = row[columnIndex]
      if (!elementId) return

      const elementData = getDataById(elementId)

      if (
        !elementData ||
        elementData.element !== propsElement.element ||
        !Array.isArray(elementData.options)
      ) {
        return
      }

      const newOptions = options.map((option, i) => {
        if (i >= elementData.options.length) {
          return {
            ...option,
            key: ID.uuid(),
          }
        }

        const { key } = elementData.options[i]
        return {
          ...option,
          key: key || ID.uuid(),
          info: option.info ?? false,
          correct: option.correct ?? false,
        }
      })

      const updatedElement = {
        ...elementData,
        options: newOptions,
        dirty: true,
      }

      updateElement(updatedElement)
    })
  }

  render() {
    const { element, dirty } = this.state
    const {
      canHaveOptionValue,
      canHaveInfo,
      canHaveOptionCorrect,
      element: propsElement,
    } = this.props

    const isInDynamicColumn = !!(
      propsElement?.parentId &&
      propsElement?.col !== undefined &&
      propsElement?.row !== undefined
    )

    const shouldShowInfo =
      canHaveInfo || (isInDynamicColumn && propsElement?.element === 'Checkboxes')

    const shouldShowCorrect =
      canHaveOptionCorrect ||
      (isInDynamicColumn && propsElement?.element === 'Checkboxes')

    return (
      <div className="dynamic-option-list">
        <ul>
          <li>
            <div className="row">
              <div className="col-sm-5">
                <b>Options</b>
              </div>
              {canHaveOptionValue && (
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
          {element.options.map((option, index) => {
            const itemKey = `edit_${option.key}`
            const val = option.value !== this.setValue(option.text) ? option.value : ''
            return (
              <li className="clearfix" key={itemKey}>
                <div className="row">
                  <div className="col-sm-5">
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: '100%' }}
                      value={option.text}
                      onChange={(e) => this.handleOptionChange(index, e)}
                      onBlur={this.updateOption}
                    />
                  </div>
                  {canHaveOptionValue && (
                    <div className="col-sm-2">
                      <input
                        type="text"
                        className="form-control"
                        style={{ width: '100%' }}
                        value={val}
                        onChange={(e) => this.handleValueChange(index, e)}
                        onBlur={this.updateOption}
                      />
                    </div>
                  )}

                  {canHaveOptionValue && canHaveInfo && (
                    <div className="col-sm-1">
                      <input
                        className="form-control"
                        type="checkbox"
                        value="1"
                        checked={
                          Object.prototype.hasOwnProperty.call(option, 'info') &&
                          option.info
                        }
                        onChange={() => this.handleOptionInfo(index)}
                      />
                    </div>
                  )}
                  {canHaveOptionValue && canHaveOptionCorrect && (
                    <div className="col-sm-1">
                      <input
                        className="form-control"
                        type="checkbox"
                        value="1"
                        checked={
                          Object.prototype.hasOwnProperty.call(option, 'correct') &&
                          option.correct
                        }
                        onChange={() => this.handleOptionCorrect(index)}
                      />
                    </div>
                  )}

                  <div className="col-sm-3">
                    <div className="dynamic-options-actions-buttons">
                      <button
                        onClick={() => this.addOption(index)}
                        type="button"
                        className="btn btn-success"
                      >
                        <i className="fas fa-plus-circle" />
                      </button>
                      {index > 0 && (
                        <button
                          onClick={() => this.removeOption(index)}
                          type="button"
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
        {dirty && (element.dirty = true)}
      </div>
    )
  }
}
