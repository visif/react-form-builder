import React from 'react'

import CheckboxFieldEditor from './CheckboxFieldEditor'
import SelectFieldEditor from './SelectFieldEditor'

/**
 * DataSource element editor
 * Handles sourceType selection and form field mapping
 *
 * @param {Object} element - The DataSource element being edited
 * @param {Array} formDataSource - Available forms to select from when sourceType is 'form'
 * @param {Object} activeForm - The currently selected form's structure and columns
 * @param {Function} onChange - Handler for field value changes
 * @param {Function} onBlur - Handler for field blur events
 */
const DataSourceEditor = ({ element, formDataSource, activeForm, onChange, onBlur }) => {
  return (
    <div>
      {/* sourceType: Determines the data source type (name, department, role, or form)
          Defaults to 'name' if not set */}
      {'sourceType' in element && (
        <SelectFieldEditor
          id="sourceType"
          label="Source Type"
          value={element.sourceType || 'name'}
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

      {/* Show form-specific fields only when sourceType is 'form' */}
      {element.sourceType === 'form' && (
        <div>
          {/* formSource: ID of the selected form to pull data from
              Defaults to -1 (Please select) when first shown */}
          {'formSource' in element && (
            <SelectFieldEditor
              id="formSource"
              label="Form Source"
              value={element.formSource || -1}
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

          {/* Form field selection: Show checkboxes for each column in the selected form
              Allows selecting which fields from the source form should be displayed
              Field names are stored as formField{field_name} properties on the element */}
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
