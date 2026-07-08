/**
 * useFormDataCollection Hook
 *
 * Collects form values from FormContext (single source of truth).
 * Fields never touched by the user get element-specific empty defaults
 * so submission payloads remain complete.
 */
import { useCallback } from 'react'

import { useFormContext } from '../../../contexts/FormContext'

const DISPLAY_ONLY_ELEMENTS = [
  'Header',
  'HeaderBar',
  'Label',
  'Paragraph',
  'LineBreak',
  'HyperLink',
  'Section',
  'Download',
  'Image',
  'FormLink',
]

const CONTAINER_ELEMENTS = [
  'TwoColumnRow',
  'ThreeColumnRow',
  'FourColumnRow',
  'DynamicColumnRow',
]

const getEmptyDefaultValue = (item) => {
  if (item.element === 'Checkboxes' || item.element === 'RadioButtons' || item.element === 'Tags') {
    return []
  }
  if (item.element === 'FileUpload') {
    return { fileList: [] }
  }
  if (item.element === 'ImageUpload') {
    return { filePath: '' }
  }
  if (item.element === 'Signature' || item.element === 'Signature2') {
    return { isSigned: false }
  }
  if (item.element === 'Table') {
    return []
  }
  if (item.element === 'FormulaInput') {
    return { formula: item.formula || '', value: '', variables: {} }
  }
  return ''
}

const hasCollectedValue = (item, contextValue) => {
  if (item.element === 'Tags') {
    return Array.isArray(contextValue) && contextValue.length > 0
  }
  if (item.element === 'FileUpload') {
    return contextValue?.fileList && contextValue.fileList.length > 0
  }
  if (item.element === 'ImageUpload') {
    return !!contextValue?.filePath
  }
  if (item.element === 'Signature2') {
    return !!contextValue?.isSigned
  }
  if (item.element === 'Signature') {
    return typeof contextValue === 'string' ? contextValue.length > 0 : !!contextValue?.isSigned
  }
  if (item.element === 'DataSource' || item.element === 'Dataset') {
    return !!contextValue?.value
  }
  if (item.element === 'Table') {
    return Array.isArray(contextValue) && contextValue.some((row) => row.some((val) => !!val))
  }
  if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
    return Array.isArray(contextValue) && contextValue.length > 0
  }
  if (item.element === 'FormulaInput') {
    return contextValue?.value !== undefined && contextValue?.value !== ''
  }
  return !!contextValue
}

export const useFormDataCollection = (props, getEditor) => {
  const formContext = useFormContext()

  const collect = useCallback(
    (item) => {
      if (
        DISPLAY_ONLY_ELEMENTS.includes(item.element) ||
        CONTAINER_ELEMENTS.includes(item.element)
      ) {
        return null
      }

      const itemData = {
        name: item.field_name,
        custom_name: item.custom_name || item.field_name,
      }

      const contextValue = formContext.getValue(item.field_name)
      const activeUser = props.getActiveUserProperties ? props.getActiveUserProperties() : null
      const oldEditor = getEditor(item)

      if (contextValue !== undefined) {
        itemData.value = contextValue
        itemData.editor = oldEditor || (hasCollectedValue(item, contextValue) ? activeUser : null)
        return itemData
      }

      itemData.value = getEmptyDefaultValue(item)
      itemData.editor = oldEditor || null
      return itemData
    },
    [props, getEditor, formContext]
  )

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

  const collectFormItems = useCallback(
    (data) => {
      const formData = []
      data.forEach((item) => {
        const itemValue = collect(item)
        formData.push({
          id: item.id,
          element: item.element,
          value: itemValue && itemValue.value,
        })
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
