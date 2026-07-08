/**
 * Form Helper Utilities
 *
 * Small utility functions used throughout the form generator
 */
import type { AnswerData, FormElementData, FormValues } from '../../../types/form'

/**
 * Convert answer data from array to object format
 */
export const convertAnswerData = (answers?: AnswerData | null): FormValues => {
  if (Array.isArray(answers)) {
    const result: FormValues = {}
    answers.forEach((x) => {
      if (x.name && x.name.indexOf('tags_') > -1) {
        const tags = Array.isArray(x.value) ? x.value : []
        result[x.name] = tags.map((y) =>
          typeof y === 'object' && y !== null && 'value' in y ? (y as { value: unknown }).value : y
        ) as FormValues[string]
      } else if (x.name) {
        result[x.name] = x.value
      }
    })
    return result
  }
  return (answers || {}) as FormValues
}

/**
 * Extract formula variables from answer data
 */
export const getVariableValueHelper = (
  ansData: FormValues,
  items?: FormElementData[] | null
): Record<string, unknown> => {
  // Safety check: ensure items is an array
  if (!Array.isArray(items)) {
    return {}
  }

  const formularItems = items.filter((item) => !!item.formularKey)
  const variables: Record<string, unknown> = {}

  formularItems.forEach((item) => {
    let value: unknown = ansData[item.field_name as string]
    if (value !== undefined) {
      // Check if the value is an object and has a value property
      if (Array.isArray(value) && value.length > 0) {
        // If value is an array, get the first item and check if it has a value property
        const firstItem = value[0] as Record<string, unknown>
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
        } else if (typeof firstItem === 'object' && firstItem !== null && 'value' in firstItem) {
          value = firstItem.value
        }
      } else if (
        typeof value === 'object' &&
        value !== null &&
        Object.prototype.hasOwnProperty.call(value, 'value')
      ) {
        value = (value as { value: unknown }).value
      }

      if (item.formularKey) {
        variables[item.formularKey] = value
      }
    }
  })

  return variables
}
