import React from 'react'
import CheckboxFieldEditor from './CheckboxFieldEditor'
import WysiwygEditor from './WysiwygEditor'

/**
 * Label and requirement settings editor
 * Common component for elements with label and required checkbox
 */
const LabelEditor = ({
  element,
  labelEditorState,
  editorStates,
  toolbar,
  onChange,
  onEditorStateChange,
  onBlur,
  canHaveDisplayHorizontal = false
}) => {
  const checked_required = element.hasOwnProperty('required') ? element.required : false
  const checked_inline = element.hasOwnProperty('inline') ? element.inline : false
  const checked_show_time_select = element.hasOwnProperty('showTimeSelect') ? element.showTimeSelect : false
  const checked_show_time_select_only = element.hasOwnProperty('showTimeSelectOnly') ? element.showTimeSelectOnly : false

  return (
    <div className="form-group">
      {element.element !== 'Signature2' && (
        <>
          <label>Display Label</label>
          <WysiwygEditor
            toolbar={toolbar}
            defaultEditorState={labelEditorState}
            editorState={editorStates.label || labelEditorState}
            onBlur={onBlur}
            onChange={(es) => onEditorStateChange('label', es)}
            stripPastedStyles={false}
          />
          <br />
        </>
      )}

      <CheckboxFieldEditor
        id="is-required"
        label="Required"
        checked={checked_required}
        onChange={(e) => onChange('required', 'checked', e)}
      />

      {element.hasOwnProperty('showTimeSelect') && (
        <CheckboxFieldEditor
          id="show-time-select"
          label="Show Time Select?"
          checked={checked_show_time_select}
          onChange={(e) => onChange('showTimeSelect', 'checked', e)}
        />
      )}

      {checked_show_time_select && element.hasOwnProperty('showTimeSelectOnly') && (
        <CheckboxFieldEditor
          id="show-time-select-only"
          label="Show Time Select Only?"
          checked={checked_show_time_select_only}
          onChange={(e) => onChange('showTimeSelectOnly', 'checked', e)}
        />
      )}

      {element.hasOwnProperty('overdueNotification') && (
        <CheckboxFieldEditor
          id="overdueNotification"
          label="Overdue Notification"
          checked={!!element.overdueNotification}
          onChange={(e) => onChange('overdueNotification', 'checked', e)}
        />
      )}

      {(element.element === 'RadioButtons' || element.element === 'Checkboxes') &&
        canHaveDisplayHorizontal && (
          <CheckboxFieldEditor
            id="display-horizontal"
            label="Display horizontal"
            checked={checked_inline}
            onChange={(e) => onChange('inline', 'checked', e)}
          />
        )}
    </div>
  )
}

export default LabelEditor
