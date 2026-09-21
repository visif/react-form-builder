/**
 * useFormValidation Hook
 *
 * Validates form fields using FormContext as the single source of truth.
 */
import { useCallback } from 'react'

import { useFormContext } from '../../../contexts/FormContext'
import type { FormElementData, FormFieldValue, ReactFormGeneratorProps } from '../../../types/form'
import { isSignedSignatureValue } from '../../../utils/signatureCollect'

type CollectedFormItem = {
  id?: string
  element?: string
  value?: unknown
}

const isFilledSectionInput = (item: CollectedFormItem): boolean => {
  if (
    !item ||
    item.element === 'Section' ||
    item.element === 'Table' ||
    item.element === 'Dropdown' ||
    item.element === 'Range'
  ) {
    return false
  }

  const { value } = item
  if (Array.isArray(value) && value.length > 0) {
    return true
  }
  if (typeof value !== 'object' && !Array.isArray(value) && !!value) {
    return true
  }
  if (
    item.element === 'FileUpload' &&
    value &&
    typeof value === 'object' &&
    Array.isArray((value as { fileList?: unknown[] }).fileList) &&
    (value as { fileList: unknown[] }).fileList.length > 0
  ) {
    return true
  }
  if (
    item.element === 'ImageUpload' &&
    value &&
    typeof value === 'object' &&
    !!(value as { filePath?: string }).filePath
  ) {
    return true
  }
  if (item.element === 'Signature' || item.element === 'Signature2') {
    return isSignedSignatureValue(value)
  }
  return false
}

const normalizeCorrectableValue = (item: FormElementData, value: FormFieldValue): string => {
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

export const useFormValidation = (
  props: ReactFormGeneratorProps,
  collectFormItems: (data: FormElementData[]) => CollectedFormItem[]
) => {
  const formContext = useFormContext()

  const isIncorrect = useCallback(
    (item: FormElementData) => {
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
    (item: FormElementData) => {
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

      // Only sections with at least one filled input are "active".
      // Empty sections skip required-field validation. Once the last filled
      // section is found (searching bottom-up), that section and all earlier
      // ones are validated. Fields before the first section are always included.
      const reverseKeys = sectionItems.map((item) => item.id).reverse()
      reverseKeys.push('')
      let activeSectionFound = false

      reverseKeys.forEach((key) => {
        const items = Array.isArray(sectionGroup[key]) ? sectionGroup[key] : []
        let fillingItems = items

        if (key && !activeSectionFound) {
          fillingItems = items.find(isFilledSectionInput)
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
