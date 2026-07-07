import type { ComponentType, ReactElement, ReactNode } from 'react'

export type FormFieldValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, unknown>
  | Record<string, unknown>[]
  | null
  | undefined

export type FormValues = Record<string, FormFieldValue>

export type FormElementData = {
  id?: string
  element?: string
  field_name?: string
  label?: string
  required?: boolean
  options?: Array<Record<string, unknown>>
  variableKey?: string
  alternateForm?: boolean
  formularKey?: string
  [key: string]: unknown
}

export type ToolbarItem = {
  key: string
  name?: string
  icon?: string
  static?: boolean
  [key: string]: unknown
}

export type AnswerDataItem = {
  name: string
  value: FormFieldValue
  editor?: unknown
}

export type AnswerData = FormValues | AnswerDataItem[]

export type ReactFormBuilderProps = {
  url?: string
  saveUrl?: string
  onLoad?: () => unknown | Promise<unknown>
  onPost?: (payload: { task_data: FormElementData[]; action?: string }) => void | Promise<void>
  onChange?: (data: FormElementData[]) => void
  onSubmit?: (data: FormElementData[]) => void
  data?: FormElementData[]
  toolbarItems?: ToolbarItem[]
  customToolbarItems?: ToolbarItem[]
  show_description?: boolean
  editMode?: boolean
  editElement?: FormElementData | null
  locale?: string
  files?: unknown[]
  renderEditForm?: (props: Record<string, unknown>) => ReactNode
  showCorrectColumn?: boolean
  variables?: Record<string, unknown>
  uploadUrl?: string
  onImageUpload?: (...args: unknown[]) => unknown
  getDataSource?: (...args: unknown[]) => unknown
  getFormSource?: (...args: unknown[]) => unknown
  getFormContent?: (...args: unknown[]) => unknown
  getActiveUserProperties?: (...args: unknown[]) => unknown
  onUploadFile?: (...args: unknown[]) => unknown
  onUploadImage?: (...args: unknown[]) => unknown
  onDownloadFile?: (...args: unknown[]) => unknown
}

export type ReactFormGeneratorProps = {
  data?: FormElementData[]
  form_action?: string
  form_method?: string
  action_name?: string
  back_action?: string
  back_name?: string
  onSubmit?: (data: Record<string, unknown>, parentElementId?: unknown) => void
  answer_data?: AnswerData
  parentElementId?: unknown
  actionName?: string
  task_id?: number
  authenticity_token?: string
  hide_actions?: boolean
  skip_validations?: boolean
  display_short?: boolean
  read_only?: boolean
  variables?: Record<string, unknown>
  submitButton?: ReactElement
  onUpdate?: (data: Record<string, unknown>) => void
  validateForCorrectness?: boolean
  getDataSource?: (...args: unknown[]) => unknown
  getActiveUserProperties?: (...args: unknown[]) => unknown
  onUploadFile?: (...args: unknown[]) => unknown
  onDownloadFile?: (...args: unknown[]) => unknown
  onUploadImage?: (...args: unknown[]) => unknown
  getFormSource?: (...args: unknown[]) => unknown
  broadcastChange?: (...args: unknown[]) => unknown
}

export type FormContextValue = {
  values: FormValues
  updateValue: (fieldName: string, value: FormFieldValue) => void
  getValue: (fieldName: string) => FormFieldValue
  getAllValues: () => FormValues
  resetValues: () => void
  variables: Record<string, FormFieldValue>
  updateVariable: (varKey: string, value: FormFieldValue) => void
  getVariable: (varKey: string) => FormFieldValue
  getAllVariables: () => Record<string, FormFieldValue>
  setAllVariables: (variables: Record<string, FormFieldValue>) => void
  addVariableListener: (listener: (event: { propKey: string; value: FormFieldValue }) => void) => () => void
  validationErrors: string[]
  setErrors: (errors: string[]) => void
  getErrors: () => string[]
}

export type FormBuilderState = {
  data: FormElementData[]
  action?: string
}

export type FormBuilderContextValue = {
  state: FormBuilderState
  dispatch: (action: string, payload?: Record<string, unknown>) => void
  subscribe: (callback: (state: { payload: FormBuilderState }) => void) => () => void
  setExternalHandler: (
    onLoad?: () => unknown | Promise<unknown>,
    onPost?: (payload: { task_data: FormElementData[]; action?: string }) => void | Promise<void>
  ) => void
}

export type RegistryApi = {
  register: (name: string, entry: ComponentType<unknown> | Record<string, unknown>) => RegistryApi
  get: (name: string) => ComponentType<unknown> | Record<string, unknown> | undefined
  list: () => string[]
}

export type FormBuildersExport = {
  ReactFormBuilder: ComponentType<ReactFormBuilderProps>
  ReactFormGenerator: ComponentType<ReactFormGeneratorProps> & {
    clearDraftData: (props: Pick<ReactFormGeneratorProps, 'form_action'>) => void
    hasDraft: (props: Pick<ReactFormGeneratorProps, 'form_action'>) => boolean
  }
}
