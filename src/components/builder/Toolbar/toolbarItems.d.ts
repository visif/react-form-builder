import type { FormElementData, ToolbarItem } from '../../../types/form'

export function defaultItemOptions(element: string): Array<Record<string, unknown>>
export function defaultItemColumns(): Array<Record<string, unknown>>
export function buildElementOptions(
  item: ToolbarItem | Record<string, unknown>,
  context?: { showDescription?: boolean; existingData?: FormElementData[] }
): FormElementData
export function defaultItems(): ToolbarItem[]
export function findDefaultItem(key: string): ToolbarItem | undefined
