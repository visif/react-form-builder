/**
 * useFormValidation Hook
 *
 * Validates form fields using FormContext as the single source of truth.
 */
import { useCallback } from 'react'

import { useFormContext } from '../../../contexts/FormContext'

const normalizeCorrectableValue = (item, value) => {
  if (item.element === 'Rating') {
    return value == null ? '' : String(value)
  }
  if (typeof value === 'string') {
    return value
  }
  if (value != null && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'value')) {
    return String(value.value ?? '')
  }
  if (value == null) {
    return ''
  }
  return String(value)
}

export const useFormValidation = (props, collectFormItems) => {
  const formContext = useFormContext()

  const isIncorrect = useCallback(
    (item) => {
      if (!item.canHaveAnswer) {
        return false
      }

      const value = formContext.getValue(item.field_name)

      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        const selectedKeys = Array.isArray(value)
          ? value.map((option) => (typeof option === 'object' ? option.key : option))
          : []

        return item.options.some((option) => {
          const isSelected = selectedKeys.includes(option.key)
          const shouldBeSelected = Object.prototype.hasOwnProperty.call(option, 'correct')
          return (shouldBeSelected && !isSelected) || (!shouldBeSelected && isSelected)
        })
      }

      const answer = normalizeCorrectableValue(item, value)
      const expected = String(item.correct ?? '').trim()
      if (item.element === 'Rating') {
        return answer !== expected
      }
      return answer.toLowerCase() !== expected.toLowerCase()
    },
    [formContext]
  )

  const isInvalid = useCallback(
    (item) => {
      let invalid = false
      if (item.required === true) {
        const value = formContext.getValue(item.field_name)

        if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
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
        } else if (item.element === 'Signature') {
          if (typeof value === 'string') {
            invalid = value.trim().length < 1
          } else {
            invalid = !value || !value.isSigned
          }
        } else if (item.element === 'Signature2') {
          invalid = !value || !value.isSigned
        } else if (value === undefined || value === null || value === '') {
          invalid = true
        } else if (typeof value === 'string' && value.trim().length < 1) {
          invalid = true
        }
      }
      return invalid
    },
    [formContext]
  )

  const validateForm = useCallback(() => {
    const errors = []
    let data_items = props.data

    let orderedItems = []
    props.data.forEach((item) => {
      const childItems = props.data.filter((child) => child.parentId === item.id)
      if (childItems?.length > 0) {
        orderedItems = orderedItems.concat(childItems)
      } else if (!item.parentId) {
        orderedItems.push(item)
      }
    })

    const formItems = collectFormItems(orderedItems)
    const sectionItems = formItems.filter((item) => item.element === 'Section')

    const hasAnyUserInput = formItems.some((item) => {
      if (item.element === 'Section') {
        return false
      }

      const { value } = item

      if (Array.isArray(value)) {
        return value.length > 0
      }

      if (item.element === 'FileUpload') {
        return !!(value && value.fileList && value.fileList.length > 0)
      }

      if (item.element === 'ImageUpload') {
        return !!(value && value.filePath)
      }

      if (item.element === 'DataSource' || item.element === 'Dataset') {
        return !!(value && value.value)
      }

      if (item.element === 'FormulaInput') {
        return value && value.value !== undefined && value.value !== null && value.value !== ''
      }

      if (value && typeof value === 'object') {
        return Object.values(value).some((v) => !!v)
      }

      if (typeof value === 'string') {
        return value.trim().length > 0
      }

      return !!value
    })

    if (!hasAnyUserInput) {
      return errors
    }

    if (sectionItems.length > 0) {
      const firstItem = formItems[0]
      let activeSectionKey = firstItem.element === 'Section' ? firstItem.id : ''
      const sectionGroup = {}
      sectionGroup[activeSectionKey] = []

      formItems.forEach((item) => {
        if (item.element === 'Section') {
          activeSectionKey = item.id
          sectionGroup[activeSectionKey] = []
        } else {
          sectionGroup[activeSectionKey].push(item)
        }
      })

      let activeItems = []

      const reverseKeys = sectionItems.map((item) => item.id).reverse()
      reverseKeys.push('')
      let activeSectionFound = false

      reverseKeys.forEach((key) => {
        const items = sectionGroup[key]
        let fillingItems = items

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

      if (activeSectionFound) {
        const itemIds = activeItems.map((item) => item.id)
        data_items = props.data.filter((item) => itemIds.includes(item.id))
      } else {
        const firstSectionId = sectionItems[0]?.id
        const initialItems = [
          ...(Array.isArray(sectionGroup['']) ? sectionGroup[''] : []),
          ...(firstSectionId && Array.isArray(sectionGroup[firstSectionId])
            ? sectionGroup[firstSectionId]
            : []),
        ]

        const initialItemIds = initialItems.map((item) => item.id)
        data_items = props.data.filter((item) => initialItemIds.includes(item.id))
      }
    }

    data_items.forEach((item) => {
      if (isInvalid(item)) {
        errors.push(`${item.label || item.position} is required!`)
      }

      if (props.validateForCorrectness && isIncorrect(item)) {
        errors.push(`${item.label} was answered incorrectly!`)
      }
    })

    return errors
  }, [props, collectFormItems, isInvalid, isIncorrect])

  return {
    isInvalid,
    isIncorrect,
    validateForm,
  }
}
