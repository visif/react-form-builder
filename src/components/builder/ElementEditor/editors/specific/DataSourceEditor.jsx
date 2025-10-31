import React from 'react'

import CheckboxFieldEditor from './CheckboxFieldEditor'
import SelectFieldEditor from './SelectFieldEditor'

/**
 * DataSource element editor
 * Handles sourceType selection and form field mapping
 */
const DataSourceEditor = ({ element, formDataSource, activeForm, onChange, onBlur }) => {
  return (
    <div>
      {'sourceType' in element && (
        <SelectFieldEditor
          id="sourceType"
          label="Source Type"
          value={element.sourceType}
          options={[
            { value: 'name', label: 'Name', key: 'name' },
            { value: 'department', label: 'Department', key: 'department' },
            { value: 'role', label: 'Role', key: 'role' },
            { value: 'form', label: 'Form', key: 'form' },
          ]}
          onChange={(e) => onChange('sourceType', 'value', e)}
          onBlur={onBlur}
        />
      )}

      {element.sourceType === 'form' && (
        <div>
          {'formSource' in element && (
            <SelectFieldEditor
              id="formSource"
              label="Form Source"
              value={element.formSource}
              options={[
                { value: -1, label: 'Please select', key: -1 },
                ...(formDataSource || []).map((item) => ({
                  value: item.id,
                  label: item.name,
                  key: item.id,
                })),
              ]}
              onChange={(e) => onChange('formSource', 'value', e)}
              onBlur={onBlur}
            />
          )}

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
      )}
    </div>
  )
}

export default DataSourceEditor
