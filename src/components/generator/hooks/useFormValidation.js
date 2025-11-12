/**
 * useFormValidation Hook
 *
 * Handles all form validation logic including:
 * - Required field validation (isInvalid)
 * - Correctness validation (isIncorrect)
 * - Full form validation with section support
 * - Signature image extraction
 */
import { useCallback } from 'react'
import ReactDOM from 'react-dom'
import { useFormContext } from '../../../contexts/FormContext'

export const useFormValidation = (props, inputsRef, getItemValue, collectFormItems) => {
  const formContext = useFormContext()

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
    [inputsRef, getItemValue]
  )

  // Validation: Check if required field is invalid
  const isInvalid = useCallback(
    (item) => {
      let invalid = false
      if (item.required === true) {
        // Get value from FormContext - single source of truth
        const value = formContext.getValue(item.field_name)

        console.log(`Validating ${item.label}:`, { value, element: item.element, field_name: item.field_name })

        if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
          // Check if array has any checked items
          if (!Array.isArray(value) || value.length < 1) {
            invalid = true
          }
        } else if (item.element === 'Rating') {
          if (value === 0 || value === undefined || value === null) {
            invalid = true
          }
        } else if (item.element === 'FileUpload') {
          if (!value || !value.fileList || value.fileList.length <= 0) {
            invalid = true
          }
        } else if (item.element === 'ImageUpload') {
          if (!value || !value.filePath) {
            invalid = true
          }
        } else if (item.element === 'Tags') {
          if (!Array.isArray(value) || value.length < 1) {
            invalid = true
          }
        } else {
          // For all other elements (TextInput, NumberInput, TextArea, Dropdown, DatePicker, etc.)
          if (value === undefined || value === null || value === '') {
            invalid = true
          } else if (typeof value === 'string' && value.trim().length < 1) {
            invalid = true
          }
        }
      }
      return invalid
    },
    [formContext]
  )

  // Extract signature canvas data
  const getSignatureImg = useCallback((item) => {
    const ref = inputsRef.current[item.field_name]
    if (!ref || !ref.canvas) return // Skip if ref or canvas doesn't exist

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
  }, [inputsRef])

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

  return {
    isInvalid,
    isIncorrect,
    validateForm,
    getSignatureImg,
  }
}
