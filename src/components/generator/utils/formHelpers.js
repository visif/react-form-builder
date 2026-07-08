/**
 * Form Helper Utilities
 *
 * Small utility functions used throughout the form generator
 */

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
          Object.prototype.hasOwnProperty.call(firstItem, 'value') &&
          typeof firstItem.value === 'boolean'
        ) {
          // Find the item in the items array that matches the field_name
          const matchedItem = items.find((target) => target.field_name === item.field_name)
          if (matchedItem && matchedItem.options) {
            // Find the option where the key matches the firstItem value
            const matchedOption = matchedItem.options.find((option) => option.key === firstItem.key)
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
        Object.prototype.hasOwnProperty.call(value, 'value')
      ) {
        value = value.value
      }

      variables[item.formularKey] = value
    }
  })

  return variables
}
