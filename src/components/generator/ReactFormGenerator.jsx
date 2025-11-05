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
 * @requires hot-formula-parser for formula fields
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'antd'

import ReactDOM from 'react-dom'

import { Parser } from 'hot-formula-parser'

import { FormProvider, useFormContext } from '../../contexts/FormContext'
import Registry from '../../utils/registry'
import FormElements from '../form-elements/index'
import {
  DynamicColumnRow,
  FourColumnRow,
  ThreeColumnRow,
  TwoColumnRow,
} from '../form-elements/layout'
import CustomElement from '../form-elements/shared/CustomElement'
import FormValidator from './FormValidator'

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

const ReactForm = (props) => {
  // Refs (replacing class properties)
  const formRef = useRef(null)
  const inputsRef = useRef({})

  // Get form context
  const formContext = useFormContext()

  // State (replacing this.state)
  const [answerData, setAnswerData] = useState(() => convert(props.answer_data))

  // Initialize variables in context
  useEffect(() => {
    const ansData = convert(props.answer_data)
    const initialVariables = getVariableValueHelper(ansData, props.data)
    formContext.setAllVariables(initialVariables)
  }, []) // Only on mount

  // Helper function to extract formula variables from answer data
  function getVariableValueHelper(ansData, items) {
    // Safety check: ensure items is an array
    if (!Array.isArray(items)) {
      return {}
    }

    const formularItems = items.filter((item) => !!item.formularKey)
    const variables = {}

    formularItems.forEach((item) => {
      let value = ansData[item.field_name]
      if (value !== undefined) {
        // Check if the value is an object and has a value property
        if (Array.isArray(value) && value.length > 0) {
          // If value is an array, get the first item and check if it has a value property
          const firstItem = value[0]
          if (
            typeof firstItem === 'object' &&
            firstItem !== null &&
            firstItem.hasOwnProperty('value') &&
            typeof firstItem.value === 'boolean'
          ) {
            // Find the item in the items array that matches the field_name
            const matchedItem = items.find((target) => target.field_name === item.field_name)
            if (matchedItem && matchedItem.options) {
              // Find the option where the key matches the firstItem value
              const matchedOption = matchedItem.options.find(
                (option) => option.key === firstItem.key
              )
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
        } else if (typeof value === 'object' && value !== null && value.hasOwnProperty('value')) {
          value = value.value
        }

        variables[item.formularKey] = value
      }
    })

    return variables
  }

  // Update state when props change (replaces getDerivedStateFromProps)
  useEffect(() => {
    const ansData = convert(props.answer_data)
    setAnswerData(ansData)
    const newVariables = getVariableValueHelper(ansData, props.data)
    formContext.setAllVariables(newVariables)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.answer_data, props.data])

  // Handle input changes and update variables via context
  const handleChange = useCallback(
    (propKey, value) => {
      // Update the form context with the new value
      formContext.updateValue(propKey, value)
      // Update variable if this field has a formularKey
      const item = props.data.find((d) => d.field_name === propKey)
      if (item?.formularKey) {
        formContext.updateVariable(item.formularKey, value)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.data]
  )

  // Variable change handler with cascading formula updates
  const handleVariableChange = useCallback(
    (params) => {
      const allVariables = formContext.getAllVariables()
      const newVariables = {
        ...allVariables,
        [params.propKey]: params.value,
      }

      setAnswerData((prevAnswerData) => {
        const newAnswerData = { ...prevAnswerData }

        // Get all formula fields for cascading updates
        const allFormulaFields = props.data.filter(
          (item) => item.element === 'FormulaInput' && item.formula
        )

        // Keep track of which variables have been updated to detect cascading changes
        const updatedVariables = new Set([params.propKey])
        let hasChanges = true

        // Continue recalculating until no more changes occur (cascading updates)
        while (hasChanges) {
          hasChanges = false

          // Find formula fields that depend on any recently updated variables
          const affectedFields = allFormulaFields.filter((formulaField) => {
            return Array.from(updatedVariables).some((varKey) =>
              formulaField.formula.includes(varKey)
            )
          })

          // Clear the updated variables set for this iteration
          updatedVariables.clear()

          affectedFields.forEach((formulaField) => {
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
                variables: newVariables,
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

        // Update context with all new variables
        formContext.setAllVariables(newVariables)

        return newAnswerData
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.data]
  )

  // Subscribe to variable changes via context
  useEffect(() => {
    const unsubscribe = formContext.addVariableListener(handleVariableChange)
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleVariableChange])

  // Helper: Get default value for a field
  const getDefaultValue = useCallback(
    (item) => {
      return answerData[item.field_name]
    },
    [answerData]
  )

  // Helper: Get editor info from answer data
  const getEditor = useCallback(
    (item) => {
      if (!props.answer_data || !Array.isArray(props.answer_data)) {
        return null
      }
      const itemAns = props.answer_data.find((x) => x.name === item.field_name)
      return itemAns && itemAns.editor
    },
    [props.answer_data]
  )

  // Helper: Get default values for checkbox/radio options
  const optionsDefaultValue = useCallback(
    (item) => {
      const defaultValue = getDefaultValue(item)
      if (defaultValue) {
        return defaultValue
      }

      const defaultChecked = []
      item.options.forEach((option) => {
        if (answerData[`option_${option.key}`]) {
          defaultChecked.push(option.key)
        }
      })
      return defaultChecked
    },
    [answerData, getDefaultValue]
  )

  // Helper: Extract value from input element
  const getItemValue = useCallback((item, ref) => {
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
      $item.value = ref.state.img ? ref.state.img.replace('data:image/png;base64,', '') : ''
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
  }, [])

  // Validation: Check if answer is incorrect
  const isIncorrect = useCallback(
    (item) => {
      let incorrect = false
      if (item.canHaveAnswer) {
        const ref = inputsRef.current[item.field_name]
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
          const $item = getItemValue(item, ref)
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
    },
    [getItemValue]
  )

  // Validation: Check if required field is invalid
  const isInvalid = useCallback(
    (item) => {
      let invalid = false
      if (item.required === true) {
        const ref = inputsRef.current[item.field_name]
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
          const $item = getItemValue(item, ref)
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
          } else if ($item.value === undefined || $item.value === null || $item.value.length < 1) {
            invalid = true
          }
        }
      }
      return invalid
    },
    [getItemValue]
  )

  // Collect data from single form element
  const collect = useCallback(
    (item) => {
      // Skip display-only elements that don't have field values
      const displayOnlyElements = [
        'Header',
        'HeaderBar',
        'Label',
        'Paragraph',
        'LineBreak',
        'HyperLink',
        'Section',
        'Download',
        'Image',
      ]

      if (displayOnlyElements.includes(item.element)) {
        return null
      }

      const itemData = {
        name: item.field_name,
        custom_name: item.custom_name || item.field_name,
      }

      // Try to get value from context first
      const contextValue = formContext.getValue(item.field_name)
      const ref = inputsRef.current[item.field_name]

      const activeUser = props.getActiveUserProperties ? props.getActiveUserProperties() : null
      const oldEditor = getEditor(item)

      // If we have a context value, use it (this is the new path)
      if (contextValue !== undefined) {
        itemData.value = contextValue

        // Determine editor based on element type and value
        let hasValue = false
        if (item.element === 'Tags') {
          hasValue = Array.isArray(contextValue) && contextValue.length > 0
        } else if (item.element === 'FileUpload') {
          hasValue = contextValue?.fileList && contextValue.fileList.length > 0
        } else if (item.element === 'ImageUpload') {
          hasValue = !!contextValue?.filePath
        } else if (item.element === 'Signature2') {
          hasValue = !!contextValue?.isSigned
        } else if (item.element === 'DataSource') {
          hasValue = !!contextValue?.value
        } else if (item.element === 'Table') {
          hasValue = Array.isArray(contextValue) && contextValue.some((row) => row.some((val) => !!val))
        } else if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
          hasValue = Array.isArray(contextValue) && contextValue.length > 0
        } else {
          hasValue = !!contextValue
        }

        itemData.editor = oldEditor ? oldEditor : hasValue ? activeUser : null
        return itemData
      }

      // Otherwise fall back to ref-based collection (legacy path)
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
        itemData.editor = oldEditor ? oldEditor : checked_options.length > 0 ? activeUser : null
      } else {
        if (!ref) {
          // If no ref exists, still include the field with empty/default value
          // This ensures all form fields are present in submission data
          if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
            itemData.value = []
          } else if (item.element === 'Tags') {
            itemData.value = []
          } else if (item.element === 'FileUpload') {
            itemData.value = { fileList: [] }
          } else if (item.element === 'ImageUpload') {
            itemData.value = { filePath: '' }
          } else if (item.element === 'Signature' || item.element === 'Signature2') {
            itemData.value = { isSigned: false }
          } else if (item.element === 'Table') {
            itemData.value = []
          } else {
            itemData.value = ''
          }
          itemData.editor = oldEditor || null
          return itemData
        }

        const valueItem = getItemValue(item, ref)

        itemData.value = valueItem.value
        itemData.editor = oldEditor ? oldEditor : valueItem.value ? activeUser : null
        if (item.element === 'Signature2') {
          itemData.editor = oldEditor ? oldEditor : valueItem.value.isSigned ? activeUser : null
        } else if (item.element === 'Tags') {
          itemData.editor = oldEditor
            ? oldEditor
            : Array.isArray(valueItem.value) && valueItem.value.length > 0
              ? activeUser
              : null
        } else if (item.element === 'DataSource' && ref.state.searchText) {
          itemData.editor = oldEditor ? oldEditor : valueItem.value.value ? activeUser : null
        } else if (item.element === 'FileUpload') {
          itemData.editor = oldEditor
            ? oldEditor
            : valueItem.value.fileList && valueItem.value.fileList.length > 0
              ? activeUser
              : null
        } else if (item.element === 'ImageUpload') {
          itemData.editor = oldEditor ? oldEditor : valueItem.value.filePath ? activeUser : null
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props, getEditor, getItemValue, formContext]
  )

  // Collect all form data
  const collectFormData = useCallback(
    (data) => {
      const formData = []
      data.forEach((item) => {
        const item_data = collect(item)
        if (item_data) {
          formData.push(item_data)
        }
      })

      return formData
    },
    [collect]
  )

  // Collect form items with values
  const collectFormItems = useCallback(
    (data) => {
      const formData = []
      data.forEach((item) => {
        const itemValue = collect(item)
        const itemData = {
          id: item.id,
          element: item.element,
          value: itemValue && itemValue.value,
        }

        formData.push(itemData)
      })

      return formData
    },
    [collect]
  )

  // Extract signature canvas data
  const getSignatureImg = useCallback((item) => {
    const ref = inputsRef.current[item.field_name]
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
  }, [])

  // Form submission handler
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()

      const { onSubmit } = props

      // submit with no form
      if (onSubmit) {
        let errors = []
        if (!props.skip_validations) {
          errors = validateForm()
          // Publish errors to context
          formContext.setErrors(errors)
        }

        // Only submit if there are no errors.
        if (errors.length < 1) {
          const data = collectFormData(props.data)
          onSubmit(data, props.parentElementId)
        }
      } else {
        // incase no submit function provided => go to form submit

        let errors = []
        if (!props.skip_validations) {
          errors = validateForm()
          // Publish errors to context
          formContext.setErrors(errors)
        }

        // Only submit if there are no errors.
        if (errors.length < 1) {
          const $form = ReactDOM.findDOMNode(formRef.current)
          $form.submit()
        }
      }
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props, collectFormData]
  )

  // Form validation with section logic
  const validateForm = useCallback(() => {
    const errors = []
    let data_items = props.data

    // re-order items to avoid items inside
    let orderedItems = []
    props.data.forEach((item) => {
      const childItems = props.data.filter((child) => child.parentId === item.id)
      if (childItems?.length > 0) {
        orderedItems = orderedItems.concat(childItems)
      } else if (!item.parentId) {
        orderedItems.push(item)
      }
    })

    // get all input items
    const formItems = collectFormItems(orderedItems)
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
                (typeof item.value !== 'object' && !Array.isArray(item.value) && !!item.value) ||
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
      data_items = props.data.filter((item) => itemIds.includes(item.id))
    }

    data_items.forEach((item) => {
      if (item.element === 'Signature') {
        getSignatureImg(item)
      }

      if (isInvalid(item)) {
        errors.push(`${item.label || item.position} is required!`)
      }

      if (props.validateForCorrectness && isIncorrect(item)) {
        errors.push(`${item.label} was answered incorrectly!`)
      }
    })

    return errors
  }, [props, collectFormItems, getSignatureImg, isInvalid, isIncorrect])

  const getDataById = useCallback(
    (id) => {
      const { data } = props
      const item = data.find((x) => x.id === id)
      return item
    },
    [props]
  )

  // handleChange and handleVariableChange are already defined above in the functional component
  // Removing duplicate class method definitions

  const getCustomElement = useCallback(
    (item) => {
      if (!item.component || typeof item.component !== 'function') {
        item.component = Registry.get(item.key)
        if (!item.component) {
          console.error(`${item.element} was not registered`)
        }
      }

      const inputProps = item.forwardRef && {
        handleChange: handleChange,
        defaultValue: getDefaultValue(item),
        ref: (c) => (inputsRef.current[item.field_name] = c),
      }

      return (
        <CustomElement
          mutable={true}
          read_only={props.read_only}
          key={`form_${item.id}`}
          data={item}
          {...inputProps}
        />
      )
    },
    [props, handleChange, getDefaultValue]
  )

  const getInputElement = useCallback(
    (item) => {
      if (item.custom) {
        return getCustomElement(item)
      }
      const Input = FormElements[item.element]
      return (
        <Input
          handleChange={handleChange}
          ref={(c) => {
            inputsRef.current[item.field_name] = c
          }}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          read_only={props.read_only}
          defaultValue={getDefaultValue(item)}
          editor={getEditor(item)}
          getActiveUserProperties={props.getActiveUserProperties}
          getDataSource={props.getDataSource}
          onUploadFile={props.onUploadFile}
          onDownloadFile={props.onDownloadFile}
          onUploadImage={props.onUploadImage}
          getFormSource={props.getFormSource}
          broadcastChange={props.broadcastChange}
          variables={formContext.getAllVariables()}
        />
      )
    },
    [props, handleChange, getDefaultValue, getEditor, formContext, getCustomElement]
  )

  const getContainerElement = useCallback(
    (item, Element) => {
      const controls = Array.isArray(item.childItems[0])
        ? item.childItems.map((row) => {
            return row.map((x) => {
              const currentItem = getDataById(x)
              return x && currentItem ? getInputElement(currentItem) : <div>&nbsp;</div>
            })
          })
        : [
            item.childItems.map((x) => {
              const currentItem = getDataById(x)
              return x && currentItem ? getInputElement(currentItem) : <div>&nbsp;</div>
            }),
          ]
      return <Element mutable={true} key={`form_${item.id}`} data={item} controls={controls} />
    },
    [getDataById, getInputElement]
  )

  const getSimpleElement = useCallback((item) => {
    const Element = FormElements[item.element]
    return <Element mutable={true} key={`form_${item.id}`} data={item} />
  }, [])

  const handleRenderSubmit = useCallback(() => {
    const { actionName = 'Submit', submitButton = false } = props

    return (
      submitButton || (
        <Button type="primary" htmlType="submit" size="large">
          {actionName}
        </Button>
      )
    )
  }, [props])

  // Render logic
  let data_items = props.data

  if (props.display_short && Array.isArray(props.data)) {
    data_items = props.data.filter((i) => i.alternateForm === true)
  }

  // Ensure data_items is always an array
  if (!Array.isArray(data_items)) {
    data_items = []
  }

  data_items.forEach((item) => {
    if (
      item &&
      item.readOnly &&
      item.variableKey &&
      props.variables &&
      props.variables[item.variableKey]
    ) {
      answerData[item.field_name] = props.variables[item.variableKey]
    }
  })

  const items = data_items
    .filter((x) => !x.parentId)
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
          return getInputElement(item)
        case 'DataSource':
          return (
            <DataSource
              handleChange={handleChange}
              ref={(c) => {
                inputsRef.current[item.field_name] = c
              }}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              read_only={props.read_only}
              defaultValue={getDefaultValue(item)}
              editor={getEditor(item)}
              getDataSource={props.getDataSource}
              getActiveUserProperties={props.getActiveUserProperties}
            />
          )
        case 'CustomElement':
          return getCustomElement(item)
        case 'FourColumnRow':
          return getContainerElement(item, FourColumnRow)
        case 'ThreeColumnRow':
          return getContainerElement(item, ThreeColumnRow)
        case 'TwoColumnRow':
          return getContainerElement(item, TwoColumnRow)
        case 'DynamicColumnRow':
          return getContainerElement(item, DynamicColumnRow)
        case 'Signature':
          return (
            <Signature
              ref={(c) => (inputsRef.current[item.field_name] = c)}
              read_only={props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={getDefaultValue(item)}
              editor={getEditor(item)}
              getActiveUserProperties={props.getActiveUserProperties}
            />
          )
        case 'Signature2':
          return (
            <Signature2
              ref={(c) => (inputsRef.current[item.field_name] = c)}
              read_only={props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={getDefaultValue(item)}
              getActiveUserProperties={props.getActiveUserProperties}
              editor={getEditor(item)}
            />
          )
        case 'Checkboxes':
          return (
            <Checkboxes
              ref={(c) => (inputsRef.current[item.field_name] = c)}
              read_only={props.read_only}
              handleChange={handleChange}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={optionsDefaultValue(item)}
              getActiveUserProperties={props.getActiveUserProperties}
              editor={getEditor(item)}
            />
          )
        case 'Image':
          return (
            <Image
              ref={(c) => (inputsRef.current[item.field_name] = c)}
              handleChange={handleChange}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={getDefaultValue(item)}
              getActiveUserProperties={props.getActiveUserProperties}
              editor={getEditor(item)}
            />
          )
        case 'Download':
          return (
            <Download
              download_path={props.download_path}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              editor={getEditor(item)}
              getActiveUserProperties={props.getActiveUserProperties}
            />
          )
        case 'Camera':
          return (
            <Camera
              ref={(c) => (inputsRef.current[item.field_name] = c)}
              read_only={props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={getDefaultValue(item)}
              editor={getEditor(item)}
            />
          )
        case 'FileUpload':
          return (
            <FileUpload
              ref={(c) => (inputsRef.current[item.field_name] = c)}
              read_only={props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={getDefaultValue(item)}
              onUploadFile={props.onUploadFile}
              onDownloadFile={props.onDownloadFile}
              editor={getEditor(item)}
              getActiveUserProperties={props.getActiveUserProperties}
            />
          )
        case 'FormLink':
          return (
            <FormLink
              ref={(c) => (inputsRef.current[item.field_name] = c)}
              read_only={props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={getDefaultValue(item)}
              onUploadFile={props.onUploadFile}
              onSelectChildForm={props.onSelectChildForm}
              getFormInfo={props.getFormInfo}
              onDownloadFile={props.onDownloadFile}
              editor={getEditor(item)}
              getActiveUserProperties={props.getActiveUserProperties}
              parentElementId={props.parentElementId}
            />
          )
        case 'ImageUpload':
          return (
            <ImageUpload
              ref={(c) => (inputsRef.current[item.field_name] = c)}
              read_only={props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={getDefaultValue(item)}
              onUploadImage={props.onUploadImage}
              editor={getEditor(item)}
              getActiveUserProperties={props.getActiveUserProperties}
            />
          )
        default:
          return getSimpleElement(item)
      }
    })

  const formTokenStyle = {
    display: 'none',
  }

  const backName = props.back_name ? props.back_name : 'Cancel'

  return (
    <div>
      <FormValidator />
      <div className="react-form-builder-form">
        <form
          encType="multipart/form-data"
          ref={formRef}
          action={props.form_action}
          onSubmit={handleSubmit}
          method={props.form_method}
        >
          {props.authenticity_token && (
            <div style={formTokenStyle}>
              <input name="utf8" type="hidden" value="&#x2713;" />
              <input name="authenticity_token" type="hidden" value={props.authenticity_token} />
              <input name="task_id" type="hidden" value={props.task_id} />
            </div>
          )}
          {items}
          <div className="btn-toolbar">
            {!props.hide_actions && handleRenderSubmit()}
            {!props.hide_actions && props.back_action && (
              <Button href={props.back_action} size="large" style={{ marginLeft: 8 }}>
                {backName}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

ReactForm.defaultProps = {
  validateForCorrectness: false,
  data: [],
  answer_data: {},
}

// Wrapper component that provides FormContext
const ReactFormWithContext = (props) => {
  // Convert answer_data to initial values for context
  const initialValues = props.answer_data || {}

  return (
    <FormProvider initialValues={initialValues}>
      <ReactForm {...props} />
    </FormProvider>
  )
}

export default ReactFormWithContext
