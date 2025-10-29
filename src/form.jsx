/**
 * ReactForm (Form Generator) - Renders forms from JSON data structure
 *
 * @component
 * @class
 * @description Generates interactive forms from JSON configuration. Supports validation,
 * dynamic fields, formula parsing, and variable replacement. Handles form submission
 * and answer data pre-population.
 *
 * @example
 * // Basic usage
 * import { ReactFormGenerator } from 'react-form-builder2';
 * import 'react-form-builder2/dist/app.css';
 *
 * function DisplayForm({ formData }) {
 *   return (
 *     <ReactFormGenerator
 *       data={formData}
 *       form_action="/submit"
 *       form_method="POST"
 *     />
 *   );
 * }
 *
 * @example
 * // With answer data and custom submit handler
 * <ReactFormGenerator
 *   data={formData}
 *   answer_data={previousAnswers}
 *   onSubmit={(data) => {
 *     console.log('Submitted:', data);
 *     // Custom submission logic
 *   }}
 *   skip_validations={false}
 *   read_only={false}
 * />
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Form structure data (required)
 * @param {string} [props.form_action] - Form submission URL
 * @param {string} [props.form_method='POST'] - HTTP method for form submission
 * @param {string} [props.action_name='Submit'] - Submit button text
 * @param {string} [props.back_action] - URL for cancel/back button
 * @param {string} [props.back_name='Cancel'] - Cancel button text
 * @param {Function} [props.onSubmit] - Custom submit handler (overrides form POST)
 * @param {Array} [props.answer_data] - Pre-existing answers to populate form
 * @param {number} [props.task_id] - Hidden task ID to submit with form
 * @param {string} [props.authenticity_token] - CSRF token for Rails
 * @param {boolean} [props.hide_actions=false] - Hide submit/cancel buttons
 * @param {boolean} [props.skip_validations=false] - Skip form validation on submit
 * @param {boolean} [props.display_short=false] - Show only critical fields
 * @param {boolean} [props.read_only=false] - Render as read-only form
 * @param {Object} [props.variables] - Variables for signature replacement
 * @param {React.ReactElement} [props.submitButton] - Custom submit button component
 * @param {Function} [props.onUpdate] - Callback when form data changes
 *
 * @returns {React.ReactElement} The rendered form with all configured elements
 *
 * @since 0.1.0
 * @todo Convert to functional component with hooks (Phase 18)
 * @note This component still uses class-based patterns and will be modernized in a future release
 * @requires hot-formula-parser for formula fields
 * @requires fbemitter for variable change events
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { EventEmitter } from 'fbemitter'
import { Parser } from 'hot-formula-parser'
import FormElements from './form-elements'
import CustomElement from './form-elements/custom-element'
import FormValidator from './form-validator'
import {
  DynamicColumnRow,
  FourColumnRow,
  ThreeColumnRow,
  TwoColumnRow,
} from './multi-column'
import Registry from './stores/registry'

const {
  Image,
  Checkboxes,
  Signature,
  Signature2,
  FileUpload,
  ImageUpload,
  Download,
  Camera,
  DataSource,
  FormLink,
} = FormElements

const convert = (answers) => {
  if (Array.isArray(answers)) {
    const result = {}
    answers.forEach((x) => {
      if (x.name && x.name.indexOf('tags_') > -1) {
        result[x.name] = x.value.map((y) => y.value)
      } else {
        result[x.name] = x.value
      }
    })
    return result
  }
  return answers || {}
}

export default class ReactForm extends React.Component {
  form

  inputs = {}

  constructor(props) {
    super(props)
    this.emitter = new EventEmitter()
    this.getDataById = this.getDataById.bind(this)
    this.handleVariableChange = this.handleVariableChange.bind(this)
    const ansData = convert(props.answer_data)
    this.state = {
      answerData: ansData,
      variables: this._getVariableValue(ansData, props.data),
    }
  }

  componentDidMount() {
    // Listen to variable changes to update the form's variables state
    if (this.emitter && typeof this.emitter.addListener === 'function') {
      this.variableSubscription = this.emitter.addListener('variableChange', this.handleVariableChange)
    }
  }

  componentWillUnmount() {
    if (this.variableSubscription && typeof this.variableSubscription.remove === 'function') {
      this.variableSubscription.remove()
    }
  }

  static getDerivedStateFromProps(props) {
    const ansData = convert(props.answer_data)

    return {
      answerData: ansData,
      variables: ReactForm.prototype._getVariableValue.call(
        { props },
        ansData,
        props.data
      ),
    }
  }

  _getVariableValue(ansData, items) {
    const formularItems = items.filter((item) => !!item.formularKey)
    const variables = {}

    formularItems.forEach((item) => {
      let value = ansData[item.field_name]
      if (value !== undefined) {

        // Check if the value is an object and has a value property
        if (Array.isArray(value) && value.length > 0) {
          // If value is an array, get the first item and check if it has a value property
          const firstItem = value[0]
          if (typeof firstItem === 'object' &&
            firstItem !== null &&
            firstItem.hasOwnProperty('value') &&
            typeof firstItem.value === 'boolean') {
              // Find the item in the items array that matches the field_name
              const matchedItem = items.find(target => target.field_name === item.field_name)
              if (matchedItem && matchedItem.options) {
                // Find the option where the key matches the firstItem value
                const matchedOption = matchedItem.options.find(option => option.key === firstItem.key)
                if (matchedOption) {
                  value = matchedOption.value || matchedOption.text || firstItem.value
                } else {
                  value = firstItem.value
                }
              } else {
                value = firstItem.value
              }
            } else {
              value = firstItem.value
            }
        } else if (
          typeof value === 'object' &&
          value !== null &&
          value.hasOwnProperty('value')
        ) {
          value = value.value
        }

        variables[item.formularKey] = value
      }
    })

    return variables
  }

  _getDefaultValue(item) {
    return this.state.answerData[item.field_name]
  }

  _getEditor(item) {
    if (!this.props.answer_data || !Array.isArray(this.props.answer_data)) {
      return null
    }
    const itemAns = this.props.answer_data.find((x) => x.name === item.field_name)
    return itemAns && itemAns.editor
  }

  _optionsDefaultValue(item) {
    const defaultValue = this._getDefaultValue(item)
    if (defaultValue) {
      return defaultValue
    }

    const defaultChecked = []
    item.options.forEach((option) => {
      if (this.state.answerData[`option_${option.key}`]) {
        defaultChecked.push(option.key)
      }
    })
    return defaultChecked
  }

  _getItemValue(item, ref) {
    let $item = {
      element: item.element,
      value: '',
    }
    if (item.element === 'Rating') {
      $item.value = ref.inputField.current.state.rating
    } else if (item.element === 'Tags') {
      $item.value = ref.inputField.current.state.value
    } else if (item.element === 'DatePicker') {
      $item.value = ref.state.value
    } else if (item.element === 'Camera') {
      $item.value = ref.state.img
        ? ref.state.img.replace('data:image/png;base64,', '')
        : ''
    } else if (item.element === 'Table') {
      $item.value = ref.state.inputs
    } else if (item.element === 'Signature2' && ref.state.isSigned) {
      $item.value = {
        isSigned: ref.state.isSigned,
        signedPerson: ref.state.signedPerson,
        signedPersonId: ref.state.signedPersonId,
        signedDateTime: ref.state.signedDateTime,
      }
    } else if (item.element === 'DataSource' && ref.state.searchText) {
      $item.value = {
        type: ref.props.data.sourceType,
        value: ref.state.searchText,
        selectedItem: ref.state.selectedItem,
      }
    } else if (item.element === 'FileUpload') {
      $item.value = {
        fileList: ref.state.fileList,
      }
    } else if (item.element === 'ImageUpload') {
      $item.value = {
        filePath: ref.state.filePath,
        fileName: ref.state.fileName,
        blobUrl: ref.state.blobUrl,
      }
    } else if (item.element === 'FormulaInput') {
      $item.value = {
        formula: ref.state.formula,
        value: ref.state.value,
        variables: ref.state.variables,
      }
    } else if (ref && ref.inputField && ref.inputField.current) {
      $item = ReactDOM.findDOMNode(ref.inputField.current)
      if ($item && typeof $item.value === 'string') {
        $item.value = $item.value.trim()
      }
    }

    return $item
  }

  _isIncorrect(item) {
    let incorrect = false
    if (item.canHaveAnswer) {
      const ref = this.inputs[item.field_name]
      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        item.options.forEach((option) => {
          const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`])
          if (
            (option.hasOwnProperty('correct') && !$option.checked) ||
            (!option.hasOwnProperty('correct') && $option.checked)
          ) {
            incorrect = true
          }
        })
      } else {
        const $item = this._getItemValue(item, ref)
        if (item.element === 'Rating') {
          if ($item.value.toString() !== item.correct) {
            incorrect = true
          }
        } else if ($item.value.toLowerCase() !== item.correct.trim().toLowerCase()) {
          incorrect = true
        }
      }
    }
    return incorrect
  }

  _isInvalid(item) {
    let invalid = false
    if (item.required === true) {
      const ref = this.inputs[item.field_name]
      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        let checked_options = 0
        item.options.forEach((option) => {
          const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`])
          if ($option.checked) {
            checked_options += 1
          }
        })
        if (checked_options < 1) {
          // errors.push(item.label + ' is required!');
          invalid = true
        }
      } else {
        const $item = this._getItemValue(item, ref)
        if (item.element === 'Rating') {
          if ($item.value === 0) {
            invalid = true
          }
        } else if (
          $item.element === 'FileUpload' &&
          (!$item.value.fileList || $item.value.fileList.length <= 0)
        ) {
          invalid = true
        } else if (item.element === 'ImageUpload' && !item.value.filePath) {
          invalid = true
        } else if (
          $item.value === undefined ||
          $item.value === null ||
          $item.value.length < 1
        ) {
          invalid = true
        }
      }
    }
    return invalid
  }

  _collect(item) {
    const itemData = {
      name: item.field_name,
      custom_name: item.custom_name || item.field_name,
    }
    const ref = this.inputs[item.field_name]
    const activeUser = this.props.getActiveUserProperties()
    const oldEditor = this._getEditor(item)

    if ((item.element === 'Checkboxes' || item.element === 'RadioButtons') && !!ref) {
      const checked_options = []

      item.options.forEach((option) => {
        const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`])
        if ($option?.checked) {
          let info = ''

          if (option.info) {
            const $info = ReactDOM.findDOMNode(ref.infos[`child_ref_${option.key}_info`])
            info = $info?.value ?? ''
          }

          checked_options.push({
            key: option.key,
            value: option.value,
            info: info,
          })
        }
      })

      itemData.value = checked_options
      itemData.editor = oldEditor
        ? oldEditor
        : checked_options.length > 0
          ? activeUser
          : null
    } else {
      if (!ref) {
        return null
      }

      const valueItem = this._getItemValue(item, ref)

      itemData.value = valueItem.value
      itemData.editor = oldEditor ? oldEditor : valueItem.value ? activeUser : null
      if (item.element === 'Signature2') {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.isSigned
            ? activeUser
            : null
      } else if (item.element === 'DataSource' && ref.state.searchText) {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.value
            ? activeUser
            : null
      } else if (item.element === 'FileUpload') {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.fileList && valueItem.value.fileList.length > 0
            ? activeUser
            : null
      } else if (item.element === 'ImageUpload') {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.filePath
            ? activeUser
            : null
      } else if (item.element === 'Table') {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.find((itemRow) => {
                return itemRow.find((val) => !!val)
              })
            ? activeUser
            : null
      }
    }

    return itemData
  }

  _collectFormData(data) {
    const formData = []
    data.forEach((item) => {
      const item_data = this._collect(item)
      if (item_data) {
        formData.push(item_data)
      }
    })

    console.log('Collected Form Data:', formData)
    return formData
  }

  _collectFormItems(data) {
    const formData = []
    data.forEach((item) => {
      const itemValue = this._collect(item)
      const itemData = {
        id: item.id,
        element: item.element,
        value: itemValue && itemValue.value,
      }

      formData.push(itemData)
    })

    return formData
  }

  _getSignatureImg(item) {
    const ref = this.inputs[item.field_name]
    const $canvas_sig = ref.canvas.current
    if ($canvas_sig) {
      const base64 = $canvas_sig.toDataURL().replace('data:image/png;base64,', '')
      const isEmpty = $canvas_sig.isEmpty()
      const $input_sig = ReactDOM.findDOMNode(ref.inputField.current)
      if (isEmpty) {
        $input_sig.value = ''
      } else {
        $input_sig.value = base64
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    const { onSubmit } = this.props

    // submit with no form
    if (onSubmit) {
      let errors = []
      if (!this.props.skip_validations) {
        errors = this.validateForm()
        // Publish errors, if any.
        this.emitter.emit('formValidation', errors)
      }

      // Only submit if there are no errors.
      if (errors.length < 1) {
        const data = this._collectFormData(this.props.data)
        onSubmit(data, this.props.parentElementId)
      }
    } else {
      // incase no submit function provided => go to form submit

      let errors = []
      if (!this.props.skip_validations) {
        errors = this.validateForm()
        // Publish errors, if any.
        this.emitter.emit('formValidation', errors)
      }

      // Only submit if there are no errors.
      if (errors.length < 1) {
        const $form = ReactDOM.findDOMNode(this.form)
        $form.submit()
      }
    }
    // }
  }

  validateForm() {
    const errors = []
    let data_items = this.props.data

    // re-order items to avoid items inside
    let orderedItems = []
    this.props.data.forEach((item) => {
      const childItems = this.props.data.filter((child) => child.parentId === item.id)
      if (childItems?.length > 0) {
        orderedItems = orderedItems.concat(childItems)
      } else if (!item.parentId) {
        orderedItems.push(item)
      }
    })

    // get all input items
    const formItems = this._collectFormItems(orderedItems)
    const sectionItems = formItems.filter((item) => item.element === 'Section')

    // Validate with special condition when there is any section
    if (sectionItems.length > 0) {
      // split items into groups by section
      const firstItem = formItems[0]
      let activeSectionKey = firstItem.element === 'Section' ? firstItem.id : ''
      const sectionGroup = {}
      sectionGroup[activeSectionKey] = []

      // group items by section separator
      formItems.forEach((item) => {
        if (item.element === 'Section') {
          activeSectionKey = item.id
          sectionGroup[activeSectionKey] = []
        } else {
          sectionGroup[activeSectionKey].push(item)
        }
      })

      let activeItems = []

      // find only active section => there is any item with value input
      const reverseKeys = sectionItems.map((item) => item.id).reverse()
      reverseKeys.push('')
      let activeSectionFound = false

      reverseKeys.forEach((key) => {
        const items = sectionGroup[key]
        let fillingItems = items

        // incase of section separator
        if (key && !activeSectionFound) {
          fillingItems = items.find(
            (item) =>
              item.element !== 'Table' &&
              item.element !== 'Dropdown' &&
              item.element !== 'Range' &&
              ((Array.isArray(item.value) && item.value.length > 0) ||
                (typeof item.value !== 'object' &&
                  !Array.isArray(item.value) &&
                  !!item.value) ||
                (item.element === 'FileUpload' &&
                  item.value.fileList &&
                  item.value.fileList.length > 0) ||
                (item.element === 'ImageUpload' && !!item.value.filePath))
          )

          activeSectionFound = !!fillingItems
        }

        if (fillingItems) {
          activeItems = activeItems.concat(items)
        }
      })

      const itemIds = activeItems.map((item) => item.id)
      data_items = this.props.data.filter((item) => itemIds.includes(item.id))
    }

    data_items.forEach((item) => {
      if (item.element === 'Signature') {
        this._getSignatureImg(item)
      }

      if (this._isInvalid(item)) {
        errors.push(`${item.label || item.position} is required!`)
      }

      if (this.props.validateForCorrectness && this._isIncorrect(item)) {
        errors.push(`${item.label} was answered incorrectly!`)
      }
    })

    return errors
  }

  getDataById(id) {
    const { data } = this.props
    const item = data.find((x) => x.id === id)
    return item
  }

  handleChange = (propKey, value) => {
    this.emitter.emit('variableChange', { propKey, value })
  }

  handleVariableChange = (params) => {
    // Update the form's variables state when any variable changes
    this.setState(prevState => {
      const newVariables = {
        ...prevState.variables,
        [params.propKey]: params.value
      }
      const newAnswerData = { ...prevState.answerData }

      // Get all formula fields for cascading updates
      const allFormulaFields = this.props.data.filter(item =>
        item.element === 'FormulaInput' && item.formula
      )

      // Keep track of which variables have been updated to detect cascading changes
      const updatedVariables = new Set([params.propKey])
      let hasChanges = true

      // Continue recalculating until no more changes occur (cascading updates)
      while (hasChanges) {
        hasChanges = false

        // Find formula fields that depend on any recently updated variables
        const affectedFields = allFormulaFields.filter(formulaField => {
          return Array.from(updatedVariables).some(varKey =>
            formulaField.formula.includes(varKey)
          )
        })

        // Clear the updated variables set for this iteration
        updatedVariables.clear()

        affectedFields.forEach(formulaField => {
          try {
            // Use same formula parsing logic as FormulaInput component
            const parser = new Parser()

            // Set all current variables in parser
            Object.entries(newVariables).forEach(([key, value]) => {
              const parsedValue = parseFloat(value)
              if (!Number.isNaN(parsedValue)) {
                parser.setVariable(key, parsedValue)
              }
            })

            // Calculate new formula result
            const parseResult = parser.parse(formulaField.formula)
            const newValue = parseResult?.result || 0

            // Update the answer data for this formula field
            newAnswerData[formulaField.field_name] = {
              formula: formulaField.formula,
              value: newValue,
              variables: newVariables
            }

            // If this formula field has a formularKey, update variables with its new value
            if (formulaField.formularKey) {
              const oldValue = newVariables[formulaField.formularKey]
              const valueChanged = Math.abs((oldValue || 0) - newValue) > 0.0001

              if (valueChanged) {
                newVariables[formulaField.formularKey] = newValue
                updatedVariables.add(formulaField.formularKey)
                hasChanges = true
              }
            }
          } catch (error) {
            console.warn(`Error calculating formula for ${formulaField.field_name}:`, error)
          }
        })
      }

      return {
        variables: newVariables,
        answerData: newAnswerData
      }
    })
  }

  getInputElement(item) {
    if (item.custom) {
      return this.getCustomElement(item)
    }
    const Input = FormElements[item.element]
    return (
      <Input
        handleChange={this.handleChange}
        ref={(c) => {
          this.inputs[item.field_name] = c
        }}
        mutable={true}
        key={`form_${item.id}`}
        data={item}
        read_only={this.props.read_only}
        defaultValue={this._getDefaultValue(item)}
        editor={this._getEditor(item)}
        getActiveUserProperties={this.props.getActiveUserProperties}
        getDataSource={this.props.getDataSource}
        onUploadFile={this.props.onUploadFile}
        onDownloadFile={this.props.onDownloadFile}
        onUploadImage={this.props.onUploadImage}
        getFormSource={this.props.getFormSource}
        broadcastChange={this.broadcastChange}
        emitter={this.emitter}
        variables={this.state.variables}
      />
    )
  }

  getContainerElement(item, Element) {
    const controls = Array.isArray(item.childItems[0])
      ? item.childItems.map((row) => {
          return row.map((x) => {
            const currentItem = this.getDataById(x)
            return x && currentItem ? (
              this.getInputElement(currentItem)
            ) : (
              <div>&nbsp;</div>
            )
          })
        })
      : [
          item.childItems.map((x) => {
            const currentItem = this.getDataById(x)
            return x && currentItem ? (
              this.getInputElement(currentItem)
            ) : (
              <div>&nbsp;</div>
            )
          }),
        ]
    return (
      <Element mutable={true} key={`form_${item.id}`} data={item} controls={controls} />
    )
  }

  getSimpleElement(item) {
    const Element = FormElements[item.element]
    return <Element mutable={true} key={`form_${item.id}`} data={item} />
  }

  getCustomElement(item) {
    if (!item.component || typeof item.component !== 'function') {
      item.component = Registry.get(item.key)
      if (!item.component) {
        console.error(`${item.element} was not registered`)
      }
    }

    const inputProps = item.forwardRef && {
      handleChange: this.handleChange,
      defaultValue: this._getDefaultValue(item),
      ref: (c) => (this.inputs[item.field_name] = c),
    }

    return (
      <CustomElement
        mutable={true}
        read_only={this.props.read_only}
        key={`form_${item.id}`}
        data={item}
        {...inputProps}
      />
    )
  }

  handleRenderSubmit = () => {
    const { actionName = 'Submit', submitButton = false } = this.props

    return (
      submitButton || <input type="submit" className="btn btn-big" value={actionName} />
    )
  }

  render() {
    let data_items = this.props.data

    if (this.props.display_short) {
      data_items = this.props.data.filter((i) => i.alternateForm === true)
    }

    data_items?.forEach((item) => {
      if (
        item &&
        item.readOnly &&
        item.variableKey &&
        this.props.variables[item.variableKey]
      ) {
        this.state.answerData[item.field_name] = this.props.variables[item.variableKey]
      }
    })

    const items = data_items
      ?.filter((x) => !x.parentId)
      .map((item) => {
        if (!item) return null
        switch (item.element) {
          case 'TextInput':
          case 'NumberInput':
          case 'TextArea':
          case 'Table':
          case 'Dropdown':
          case 'DatePicker':
          case 'RadioButtons':
          case 'Rating':
          case 'Tags':
          case 'FormulaInput':
          case 'Range':
            return this.getInputElement(item)
          case 'DataSource':
            return (
              <DataSource
                handleChange={this.handleChange}
                ref={(c) => {
                  this.inputs[item.field_name] = c
                }}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                read_only={this.props.read_only}
                defaultValue={this._getDefaultValue(item)}
                editor={this._getEditor(item)}
                getDataSource={this.props.getDataSource}
                getActiveUserProperties={this.props.getActiveUserProperties}
                emitter={this.emitter}
              />
            )
          case 'CustomElement':
            return this.getCustomElement(item)
          case 'FourColumnRow':
            return this.getContainerElement(item, FourColumnRow)
          case 'ThreeColumnRow':
            return this.getContainerElement(item, ThreeColumnRow)
          case 'TwoColumnRow':
            return this.getContainerElement(item, TwoColumnRow)
          case 'DynamicColumnRow':
            return this.getContainerElement(item, DynamicColumnRow)
          case 'Signature':
            return (
              <Signature
                ref={(c) => (this.inputs[item.field_name] = c)}
                read_only={this.props.read_only || item.readOnly}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                defaultValue={this._getDefaultValue(item)}
                editor={this._getEditor(item)}
                getActiveUserProperties={this.props.getActiveUserProperties}
              />
            )
          case 'Signature2':
            return (
              <Signature2
                ref={(c) => (this.inputs[item.field_name] = c)}
                read_only={this.props.read_only || item.readOnly}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                defaultValue={this._getDefaultValue(item)}
                getActiveUserProperties={this.props.getActiveUserProperties}
                editor={this._getEditor(item)}
              />
            )
          case 'Checkboxes':
            return (
              <Checkboxes
                ref={(c) => (this.inputs[item.field_name] = c)}
                read_only={this.props.read_only}
                handleChange={this.handleChange}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                defaultValue={this._optionsDefaultValue(item)}
                getActiveUserProperties={this.props.getActiveUserProperties}
                editor={this._getEditor(item)}
              />
            )
          case 'Image':
            return (
              <Image
                ref={(c) => (this.inputs[item.field_name] = c)}
                handleChange={this.handleChange}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                defaultValue={this._getDefaultValue(item)}
                getActiveUserProperties={this.props.getActiveUserProperties}
                editor={this._getEditor(item)}
              />
            )
          case 'Download':
            return (
              <Download
                download_path={this.props.download_path}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                editor={this._getEditor(item)}
                getActiveUserProperties={this.props.getActiveUserProperties}
              />
            )
          case 'Camera':
            return (
              <Camera
                ref={(c) => (this.inputs[item.field_name] = c)}
                read_only={this.props.read_only || item.readOnly}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                defaultValue={this._getDefaultValue(item)}
                editor={this._getEditor(item)}
              />
            )
          case 'FileUpload':
            return (
              <FileUpload
                ref={(c) => (this.inputs[item.field_name] = c)}
                read_only={this.props.read_only || item.readOnly}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                defaultValue={this._getDefaultValue(item)}
                onUploadFile={this.props.onUploadFile}
                onDownloadFile={this.props.onDownloadFile}
                editor={this._getEditor(item)}
                getActiveUserProperties={this.props.getActiveUserProperties}
              />
            )
          case 'FormLink':
            return (
              <FormLink
                ref={(c) => (this.inputs[item.field_name] = c)}
                read_only={this.props.read_only || item.readOnly}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                defaultValue={this._getDefaultValue(item)}
                onUploadFile={this.props.onUploadFile}
                onSelectChildForm={this.props.onSelectChildForm}
                getFormInfo={this.props.getFormInfo}
                onDownloadFile={this.props.onDownloadFile}
                editor={this._getEditor(item)}
                getActiveUserProperties={this.props.getActiveUserProperties}
                parentElementId={this.props.parentElementId}
              />
            )
          case 'ImageUpload':
            return (
              <ImageUpload
                ref={(c) => (this.inputs[item.field_name] = c)}
                read_only={this.props.read_only || item.readOnly}
                mutable={true}
                key={`form_${item.id}`}
                data={item}
                defaultValue={this._getDefaultValue(item)}
                onUploadImage={this.props.onUploadImage}
                editor={this._getEditor(item)}
                getActiveUserProperties={this.props.getActiveUserProperties}
              />
            )
          default:
            return this.getSimpleElement(item)
        }
      })

    const formTokenStyle = {
      display: 'none',
    }

    const backName = this.props.back_name ? this.props.back_name : 'Cancel'

    return (
      <div>
        <FormValidator emitter={this.emitter} />
        <div className="react-form-builder-form">
          <form
            encType="multipart/form-data"
            ref={(c) => (this.form = c)}
            action={this.props.form_action}
            onSubmit={this.handleSubmit.bind(this)}
            method={this.props.form_method}
          >
            {this.props.authenticity_token && (
              <div style={formTokenStyle}>
                <input name="utf8" type="hidden" value="&#x2713;" />
                <input
                  name="authenticity_token"
                  type="hidden"
                  value={this.props.authenticity_token}
                />
                <input name="task_id" type="hidden" value={this.props.task_id} />
              </div>
            )}
            {items}
            <div className="btn-toolbar">
              {!this.props.hide_actions && this.handleRenderSubmit()}
              {!this.props.hide_actions && this.props.back_action && (
                <a
                  href={this.props.back_action}
                  className="btn btn-default btn-cancel btn-big"
                >
                  {backName}
                </a>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

ReactForm.defaultProps = { validateForCorrectness: false }
