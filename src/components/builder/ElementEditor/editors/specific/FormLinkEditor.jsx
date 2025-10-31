import React from 'react'

import CheckboxFieldEditor from './CheckboxFieldEditor'
import SelectFieldEditor from './SelectFieldEditor'

/**
 * FormLink element editor
 * Handles form selection and field mapping
 */
const FormLinkEditor = ({ element, formDataSource, activeForm, onChange, onBlur }) => {
  return (
    <div>
      <SelectFieldEditor
        id="formLinkSource"
        label="Select Form"
        value={element.formSource || ''}
        options={[
          { value: '', label: 'Select a form...', key: -1 },
          ...(formDataSource || []).map((form) => ({
            value: form.id,
            label: form.name || form.title,
            key: form.id,
          })),
        ]}
        onChange={(e) => onChange('formSource', 'value', e)}
        onBlur={onBlur}
      />

      {activeForm && activeForm.columns && (
        <div className="form-group">
          <label className="control-label">Select Fields</label>
          {activeForm.columns.map((item) => (
            <CheckboxFieldEditor
              key={item.field_name}
              id={item.field_name}
              label={item.label || item.text || ''}
              checked={
                `formField${item.field_name}` in element
                  ? element[`formField${item.field_name}`]
                  : false
              }
              onChange={(e) => onChange(`formField${item.field_name}`, 'checked', e)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FormLinkEditor
