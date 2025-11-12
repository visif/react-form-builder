/**
 * Form Helper Utilities
 *
 * Small utility functions used throughout the form generator
 */
import ReactDOM from 'react-dom'

/**
 * Convert answer data from array to object format
 */
export const convertAnswerData = (answers) => {
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

/**
 * Extract formula variables from answer data
 */
export const getVariableValueHelper = (ansData, items) => {
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

/**
 * Extract value from input element (legacy ref-based)
 */
export const getItemValue = (item, ref) => {
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
}
