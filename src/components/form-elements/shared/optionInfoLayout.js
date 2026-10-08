export const OPTION_INFO_ROW_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '8px',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
}

export const INFO_TEXTAREA_STYLE = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
  color: 'rgba(0, 0, 0, 0.85)',
  WebkitTextFillColor: 'rgba(0, 0, 0, 0.85)',
  opacity: 1,
}

/** Layout for a single checkbox or multiple-choice option. */
export function getChoiceOptionLayout(inline) {
  if (inline) {
    return {
      className: 'option-inline',
      style: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: '16px',
        marginBottom: '4px',
        maxWidth: '100%',
      },
      rowStyle: {
        ...OPTION_INFO_ROW_STYLE,
        width: 'auto',
      },
    }
  }

  return {
    className: undefined,
    style: { display: 'block', marginBottom: '4px' },
    rowStyle: OPTION_INFO_ROW_STYLE,
  }
}
