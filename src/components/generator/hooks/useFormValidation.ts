/**
 * useFormValidation Hook
 *
 * Validates form fields using FormContext as the single source of truth.
 */
import { useCallback } from 'react'

import { useFormContext } from '../../../contexts/FormContext'
import type { FormElementData, FormFieldValue, ReactFormGeneratorProps } from '../../../types/form'
import { isSignedSignatureValue } from '../../../utils/signatureCollect'

export type CollectedFormItem = {
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

const isReadOnlyDataItem = (item: FormElementData | undefined): boolean =>
  Boolean(item?.readOnly)

/**
 * Grouped workflow steps lock earlier Sections as read-only. Required fields
 * there must not block the current assignee. Start at the last Section this
 * user actually filled (an editable input) and do not walk back into previous
 * Sections. If nothing editable is filled yet, only editable fields are
 * checked.
 */
export const resolveActiveCollectedItems = (
  formItems: CollectedFormItem[],
  dataById: Map<string, FormElementData>
): CollectedFormItem[] => {
  const sectionItems = formItems.filter((item) => item.element === 'Section')
  if (sectionItems.length === 0) {
    return formItems
  }

  const firstItem = formItems[0]
  let activeSectionKey = firstItem?.element === 'Section' ? firstItem.id : ''
  const sectionGroup: Record<string, CollectedFormItem[]> = {}
  sectionGroup[activeSectionKey || ''] = []

  formItems.forEach((item) => {
    if (item.element === 'Section') {
      activeSectionKey = item.id
      sectionGroup[activeSectionKey || ''] = []
      return
    }
    const key = activeSectionKey || ''
    if (!sectionGroup[key]) {
      sectionGroup[key] = []
    }
    sectionGroup[key].push(item)
  })

  const isEditableFilled = (item: CollectedFormItem): boolean => {
    const data = item.id != null ? dataById.get(String(item.id)) : undefined
    if (isReadOnlyDataItem(data)) {
      return false
    }
    return isFilledSectionInput(item)
  }

  const reverseKeys = sectionItems.map((item) => item.id).reverse()
  for (const key of reverseKeys) {
    const items = Array.isArray(sectionGroup[key || '']) ? sectionGroup[key || ''] : []
    if (items.some(isEditableFilled)) {
      return items
    }
  }

  return formItems.filter((item) => {
    if (item.element === 'Section') {
      return false
    }
    const data = item.id != null ? dataById.get(String(item.id)) : undefined
    return !isReadOnlyDataItem(data)
  })
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
      if (item.readOnly === true) {
        return false
      }
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
    const dataById = new Map(
      (props.data || [])
        .filter((item) => item?.id != null && item.id !== '')
        .map((item) => [String(item.id), item])
    )
    const activeItems = resolveActiveCollectedItems(formItems, dataById)

    if (formItems.some((item) => item.element === 'Section')) {
      const itemIds = new Set(activeItems.map((item) => item.id).filter(Boolean))
      data_items = props.data.filter((item) => itemIds.has(item.id))
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
