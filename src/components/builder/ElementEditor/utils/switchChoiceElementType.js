/**
 * Utilities for converting a choice element between Checkboxes and RadioButtons (Multiple Choice)
 * inside the FormElementsEdit drawer while preserving its id, field_name, placement, label, and options.
 */

export const isSwitchableChoiceElement = (elementType) =>
  elementType === 'Checkboxes' || elementType === 'RadioButtons'

export const getOppositeChoiceElementType = (elementType) => {
  if (elementType === 'Checkboxes') return 'RadioButtons'
  if (elementType === 'RadioButtons') return 'Checkboxes'
  return null
}

export const resolveChoiceElementTitle = (targetType, toolbarItems) => {
  if (Array.isArray(toolbarItems)) {
    const match = toolbarItems.find(
      (item) => item && (item.element === targetType || item.key === targetType)
    )
    if (match && typeof match.name === 'string' && match.name.trim()) {
      return match.name.trim()
    }
  }
  return targetType === 'RadioButtons' ? 'Multiple Choice' : 'Checkboxes'
}

export const normalizeSwitchedChoiceOptions = (options, targetType) => {
  if (!Array.isArray(options)) {
    return []
  }
  let keptSingleSelection = false
  return options.map((opt) => {
    const cloned = { ...opt }
    if (targetType === 'RadioButtons') {
      const wasSelected = Boolean(cloned.checked || cloned.selected)
      if (wasSelected && !keptSingleSelection) {
        keptSingleSelection = true
        cloned.checked = true
        cloned.selected = true
      } else if ('checked' in cloned || 'selected' in cloned) {
        cloned.checked = false
        cloned.selected = false
      }
    }
    return cloned
  })
}

export const buildSwitchedChoiceElement = (currentElement, liveElement, toolbarItems) => {
  const source = currentElement || liveElement
  if (!source || !isSwitchableChoiceElement(source.element)) {
    return null
  }

  const targetType = getOppositeChoiceElementType(source.element)
  if (!targetType) {
    return null
  }

  const sourceOptions = Array.isArray(liveElement?.options)
    ? liveElement.options
    : Array.isArray(source.options)
      ? source.options
      : []

  const next = {
    ...(liveElement || {}),
    ...source,
    element: targetType,
    text: resolveChoiceElementTitle(targetType, toolbarItems),
    canHaveAnswer: true,
    canHaveInfo: source.canHaveInfo ?? liveElement?.canHaveInfo ?? true,
    canHaveDisplayHorizontal: source.canHaveDisplayHorizontal !== false,
    canHaveOptionValue: source.canHaveOptionValue !== false,
    canHaveOptionCorrect: source.canHaveOptionCorrect !== false,
    canHaveDefaultValue: Boolean(source.canHaveDefaultValue),
    options: normalizeSwitchedChoiceOptions(sourceOptions, targetType),
    dirty: false,
  }

  if (targetType === 'RadioButtons') {
    if (next.formularKey === undefined) {
      next.formularKey = ''
    }
    if (Array.isArray(next.value) && next.value.length > 1) {
      next.value = next.value.slice(0, 1)
    }
  } else if (next.formularKey === '') {
    delete next.formularKey
  }

  return next
}
