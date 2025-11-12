/**
 * useFormDataCollection Hook
 *
 * Handles all form data collection logic including:
 * - Collecting data from individual form elements
 * - Collecting all form data for submission
 * - Collecting form items with values for validation
 */
import { useCallback } from 'react'
import ReactDOM from 'react-dom'
import { useFormContext } from '../../../contexts/FormContext'

export const useFormDataCollection = (props, inputsRef, getItemValue, getEditor) => {
  const formContext = useFormContext()

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

      // Skip container/layout elements that don't have form values
      const containerElements = [
        'TwoColumnRow',
        'ThreeColumnRow',
        'FourColumnRow',
        'DynamicColumnRow',
      ]

      if (displayOnlyElements.includes(item.element) || containerElements.includes(item.element)) {
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
    [props, getEditor, getItemValue, formContext, inputsRef]
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

  return {
    collect,
    collectFormData,
    collectFormItems,
  }
}
