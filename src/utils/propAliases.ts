/**
 * Public prop alias helpers.
 *
 * Prefer camelCase for new integrations. Legacy snake_case props remain supported.
 * When both are provided, camelCase wins.
 */

type AnyProps = Record<string, unknown>

const pick = <T, >(props: AnyProps, camelKey: string, snakeKey: string): T | undefined => {
  if (Object.prototype.hasOwnProperty.call(props, camelKey) && props[camelKey] !== undefined) {
    return props[camelKey] as T
  }
  if (Object.prototype.hasOwnProperty.call(props, snakeKey) && props[snakeKey] !== undefined) {
    return props[snakeKey] as T
  }
  return undefined
}

export type NormalizedBuilderProps = {
  showDescription?: boolean
}

export type NormalizedGeneratorProps = {
  formAction?: string
  formMethod?: string
  actionName?: string
  backAction?: string
  backName?: string
  answerData?: unknown
  authenticityToken?: string
  hideActions?: boolean
  skipValidations?: boolean
  displayShort?: boolean
  readOnly?: boolean
  downloadPath?: string
  taskId?: number
}

/** Resolve builder public prop aliases. */
export const normalizeBuilderAliases = (props: AnyProps = {}): NormalizedBuilderProps => ({
  showDescription: pick<boolean>(props, 'showDescription', 'show_description'),
})

/** Resolve generator public prop aliases. */
export const normalizeGeneratorAliases = (props: AnyProps = {}): NormalizedGeneratorProps => ({
  formAction: pick<string>(props, 'formAction', 'form_action'),
  formMethod: pick<string>(props, 'formMethod', 'form_method'),
  actionName: pick<string>(props, 'actionName', 'action_name'),
  backAction: pick<string>(props, 'backAction', 'back_action'),
  backName: pick<string>(props, 'backName', 'back_name'),
  answerData: pick(props, 'answerData', 'answer_data'),
  authenticityToken: pick<string>(props, 'authenticityToken', 'authenticity_token'),
  hideActions: pick<boolean>(props, 'hideActions', 'hide_actions'),
  skipValidations: pick<boolean>(props, 'skipValidations', 'skip_validations'),
  displayShort: pick<boolean>(props, 'displayShort', 'display_short'),
  readOnly: pick<boolean>(props, 'readOnly', 'read_only'),
  downloadPath: pick<string>(props, 'downloadPath', 'download_path'),
  taskId: pick<number>(props, 'taskId', 'task_id'),
})

/**
 * Flatten aliases onto a props object using the legacy snake_case keys
 * so deep internals can keep reading a single shape.
 */
export const withGeneratorLegacyKeys = <T extends AnyProps>(props: T) => {
  const aliases = normalizeGeneratorAliases(props)
  return {
    ...props,
    form_action: aliases.formAction ?? props.form_action,
    form_method: aliases.formMethod ?? props.form_method,
    action_name: aliases.actionName ?? props.action_name ?? props.actionName,
    actionName: aliases.actionName ?? props.actionName ?? props.action_name,
    back_action: aliases.backAction ?? props.back_action,
    back_name: aliases.backName ?? props.back_name,
    answer_data: aliases.answerData ?? props.answer_data,
    authenticity_token: aliases.authenticityToken ?? props.authenticity_token,
    hide_actions: aliases.hideActions ?? props.hide_actions,
    skip_validations: aliases.skipValidations ?? props.skip_validations,
    display_short: aliases.displayShort ?? props.display_short,
    read_only: aliases.readOnly ?? props.read_only,
    download_path: aliases.downloadPath ?? props.download_path,
    task_id: aliases.taskId ?? props.task_id,
  }
}

export const withBuilderLegacyKeys = <T extends AnyProps>(props: T) => {
  const aliases = normalizeBuilderAliases(props)
  return {
    ...props,
    show_description: aliases.showDescription ?? props.show_description,
  }
}
