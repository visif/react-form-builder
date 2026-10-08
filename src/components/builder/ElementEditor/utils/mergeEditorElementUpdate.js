/**
 * Column, option, and row editors keep their own element copy and pass it to
 * updateElement. Blur handlers pass a DOM event to the same function.
 * Only a real element with a new columns array should replace stored columns.
 */
export const isEditableFormElement = (value) =>
  Boolean(
    value &&
    typeof value === 'object' &&
    !value.nativeEvent &&
    value.id != null &&
    typeof value.element === 'string'
  )

export const mergeEditorElementUpdate = (current, incoming) => {
  if (!current) return current
  if (!isEditableFormElement(incoming) || incoming.id !== current.id) {
    return current
  }
  if (incoming.columns === undefined || incoming.columns === current.columns) {
    return current
  }
  return { ...current, columns: incoming.columns }
}
