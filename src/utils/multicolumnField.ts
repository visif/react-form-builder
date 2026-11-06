import type { FormElementData } from '../types/form'

/** True when a field is rendered inside a multi-column row cell. */
export const isMulticolumnChild = (data?: FormElementData | null): boolean =>
  data?.parentId != null && data?.row !== undefined && data?.col !== undefined

/** Field types that must stay clickable inside multi-column preview cells. */
export const isInteractiveMulticolumnField = (element?: string): boolean =>
  [
    'DatePicker',
    'Dropdown',
    'DataSource',
    'Dataset',
    'RadioButtons',
    'Checkboxes',
    'Tags',
  ].includes(element ?? '')

export const getPickerPopupContainer = (): HTMLElement => document.body

/**
 * antd derives popup z-index from a React context supplied by the host app's own
 * antd copy. The form builder ships its own antd, so that context is not shared
 * and Select/DatePicker popups fall back to 1050 -- below host Drawers/Modals
 * (1100+), which hides the open popup. Pin it above any host overlay.
 */
export const FORM_POPUP_Z_INDEX = 2100

export const FORM_POPUP_STYLES = { popup: { root: { zIndex: FORM_POPUP_Z_INDEX } } }
