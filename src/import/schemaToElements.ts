/**
 * Convert an ImportedFormSchema into builder element data.
 *
 * Elements are created through the same factory the Toolbox uses so the
 * generated form behaves exactly like one assembled by hand.
 */
import { buildElementOptions, findDefaultItem } from '../components/builder/Toolbar/toolbarItems'
import type { FormElementData } from '../types/form'
import ID from '../utils/uuid'
import type { ImportedField, ImportedFieldType, ImportedFormSchema } from './types'

const ELEMENT_BY_TYPE: Record<Exclude<ImportedFieldType, 'row'>, string> = {
  header: 'Header',
  section: 'Section',
  paragraph: 'Paragraph',
  label: 'Label',
  linebreak: 'LineBreak',
  text: 'TextInput',
  textarea: 'TextArea',
  number: 'NumberInput',
  date: 'DatePicker',
  dropdown: 'Dropdown',
  checkboxes: 'Checkboxes',
  radio: 'RadioButtons',
  rating: 'Rating',
  signature: 'Signature2',
  fileupload: 'FileUpload',
  imageupload: 'ImageUpload',
  camera: 'Camera',
  table: 'Table',
}

const ROW_ELEMENT_BY_SIZE: Record<number, string> = {
  2: 'TwoColumnRow',
  3: 'ThreeColumnRow',
  4: 'FourColumnRow',
}

const escapeHtml = (text: string): string =>
  String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const optionKeyPrefix = (element: string): string => {
  switch (element) {
    case 'Dropdown':
      return 'dropdown_option'
    case 'Checkboxes':
      return 'checkboxes_option'
    case 'RadioButtons':
      return 'radiobuttons_option'
    default:
      return 'option'
  }
}

const buildOptions = (element: string, options: string[]) =>
  options.map((text, index) => ({
    value: String(index + 1),
    text,
    key: `${optionKeyPrefix(element)}_${ID.uuid()}`,
  }))

export type SchemaToElementsOptions = {
  /** Existing form data – used for DynamicColumnRow unique names */
  existingData?: FormElementData[]
  /** Forward the toolbar-wide showDescription flag */
  showDescription?: boolean
}

function createLeaf(field: ImportedField, options: SchemaToElementsOptions): FormElementData | null {
  if (field.type === 'row') return null
  const elementName = ELEMENT_BY_TYPE[field.type] || 'TextInput'
  const item = findDefaultItem(elementName)
  if (!item) return null

  const el = buildElementOptions(item, {
    showDescription: options.showDescription,
    existingData: options.existingData || [],
  }) as FormElementData

  const label = (field.label || '').trim()

  switch (field.type) {
    case 'header':
      el.content = escapeHtml(label || 'Header')
      break
    case 'paragraph':
    case 'label':
      el.content = escapeHtml(label)
      break
    case 'section':
      el.header = label || 'Section'
      break
    case 'linebreak':
      break
    case 'signature':
      el.position = label || 'Signature'
      break
    case 'table': {
      const columns = (field.columns && field.columns.length > 0 ? field.columns : ['Column1', 'Column2', 'Column3']).map(
        (text) => ({
          text,
          key: `table_column_${ID.uuid()}`,
          width: 1,
          isSync: true,
          required: false,
        })
      )
      el.columns = columns
      if (field.rowLabels && field.rowLabels.length > 0) {
        el.rowLabels = field.rowLabels.map((text) => ({
          text,
          value: text,
          key: `table_row_${ID.uuid()}`,
        }))
        el.rows = field.rowLabels.length
      } else {
        el.rowLabels = []
        el.rows = field.rows && field.rows > 0 ? field.rows : 3
      }
      if (label) el.label = escapeHtml(label)
      break
    }
    default: {
      if (label) el.label = escapeHtml(label)
      if (field.options && ['Dropdown', 'Checkboxes', 'RadioButtons'].includes(elementName)) {
        if (field.options.length > 0) {
          el.options = buildOptions(elementName, field.options)
        }
      }
    }
  }

  if (field.required && !el.static && field.type !== 'linebreak') {
    el.required = true
  }
  if (field.description && !el.static) {
    el.description = escapeHtml(field.description)
    el.showDescription = true
  }

  return el
}

/**
 * Build builder elements for a schema. Column-row children are appended after
 * all top-level elements with `parentId` / `row` / `col` set, matching what the
 * canvas produces when fields are dropped into a Two/Three/FourColumnRow.
 */
export function schemaToFormElements(
  schema: ImportedFormSchema,
  options: SchemaToElementsOptions = {}
): FormElementData[] {
  const topLevel: FormElementData[] = []
  const children: Array<{ child: FormElementData; parent: FormElementData }> = []
  const existing = [...(options.existingData || [])]

  const context: SchemaToElementsOptions = { ...options, existingData: existing }

  schema.fields.forEach((field) => {
    if (field.type === 'row') {
      const kids = (field.children || []).slice(0, 4)
      if (kids.length === 0) return
      if (kids.length === 1) {
        const single = createLeaf(kids[0], context)
        if (single) {
          topLevel.push(single)
          existing.push(single)
        }
        return
      }
      const rowItem = findDefaultItem(ROW_ELEMENT_BY_SIZE[kids.length])
      if (!rowItem) return
      const rowEl = buildElementOptions(rowItem, { existingData: existing }) as FormElementData
      rowEl.isContainer = true
      const childIds: Array<string | null> = kids.map(() => null)
      kids.forEach((kid, col) => {
        const childEl = createLeaf(kid, context)
        if (!childEl) return
        childEl.parentId = rowEl.id
        childEl.row = 0
        childEl.col = col
        childIds[col] = childEl.id as string
        children.push({ child: childEl, parent: rowEl })
      })
      rowEl.childItems = [childIds]
      topLevel.push(rowEl)
      existing.push(rowEl)
      return
    }

    const el = createLeaf(field, context)
    if (el) {
      topLevel.push(el)
      existing.push(el)
    }
  })

  const result = [...topLevel]
  children.forEach(({ child, parent }) => {
    child.parentIndex = result.indexOf(parent)
    result.push(child)
  })
  return result
}

export default schemaToFormElements
