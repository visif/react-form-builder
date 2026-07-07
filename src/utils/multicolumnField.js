/** True when a field is rendered inside a multi-column row cell. */
export const isMulticolumnChild = (data) =>
  data?.parentId != null && data?.row !== undefined && data?.col !== undefined

/** Field types that must stay clickable inside multi-column preview cells. */
export const isInteractiveMulticolumnField = (element) =>
  [
    'DatePicker',
    'Dropdown',
    'DataSource',
    'Dataset',
    'RadioButtons',
    'Checkboxes',
    'Tags',
  ].includes(element)

export const getPickerPopupContainer = () => document.body
