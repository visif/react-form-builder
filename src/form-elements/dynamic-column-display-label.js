// Parent lookup for a column cell. The builder preview passes getDataById as
// its own prop (mutable is a boolean). The filled form may pass it the same
// way, or on a mutable object.
export function resolveGetDataById(props) {
  if (!props) return null
  if (typeof props.getDataById === 'function') return props.getDataById
  if (props.mutable && typeof props.mutable.getDataById === 'function') {
    return props.mutable.getDataById
  }
  return null
}

export function getParentElement(props) {
  if (!props?.data?.parentId) return null
  const getDataById = resolveGetDataById(props)
  return getDataById ? getDataById(props.data.parentId) : null
}

export function isDynamicColumnChild(data, props) {
  if (!data?.parentId || data.row === undefined || data.col === undefined) {
    return false
  }
  const parent = getParentElement(props)
  if (parent?.element) {
    return parent.element === 'DynamicColumnRow'
  }
  return data.hideLabel === true
}

// Hide a cell's display label unless the Dynamic Column Row opts in, or the
// cell itself opts in. A row-level opt-in overrides the hideLabel flag stamped
// on children when they are dropped. An explicit isShowLabel: false still hides.
export function shouldHideColumnDisplayLabel(data, parentElement) {
  const parentDynamicColumnRow =
    parentElement && parentElement.element === 'DynamicColumnRow' ? parentElement : null
  const rowShowsLabels = parentDynamicColumnRow?.showDisplayLabel === true

  const hideLabelSetting =
    (data?.isShowLabel !== undefined && data.isShowLabel === false) ||
    (data && data.hideLabel === true && !rowShowsLabels)

  const hideBecauseDynamicColumn =
    parentDynamicColumnRow !== null &&
    !rowShowsLabels &&
    data?.displayLabelInColumn !== true

  return hideLabelSetting || hideBecauseDynamicColumn
}
