import React from 'react'

import CheckboxFieldEditor from './CheckboxFieldEditor'
import SelectFieldEditor from './SelectFieldEditor'

// Strip HTML tags and decode common entities to produce a plain-text label
// e.g. "<span style="font-size:16px;">Judgement :</span>" → "Judgement :"
const toPlainText = (str) => {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

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
  const hasSelectedSource =
    element.formSource !== undefined && element.formSource !== null && element.formSource !== ''
  const matchedSource = hasSelectedSource
    ? (formDataSource || []).find((item) => item.id == element.formSource)
    : null
  const formSourceValue = hasSelectedSource
    ? (matchedSource ? matchedSource.id : element.formSource)
    : -1

  return (
    <div>
      {/* sourceType: Determines the data source type (name, department, role, dataset, or form)
            Defaults to 'name' if not set */}
      {'sourceType' in element && (
      <SelectFieldEditor
        id="sourceType"
        label="Source Type"
        value={element.sourceType || 'name'}
        options={[
              { value: 'name', label: 'Name', key: 'name' },
              { value: 'email', label: 'Email', key: 'email' },
              { value: 'department', label: 'Department', key: 'department' },
              { value: 'role', label: 'Role', key: 'role' },
              { value: 'dataset', label: 'Dataset', key: 'dataset' },
              { value: 'form', label: 'Form', key: 'form' },
            ]}
        onChange={(e) => onChange('sourceType', 'value', e)}
        onBlur={onBlur}
      />
        )}

      {(element.sourceType === 'form' || element.sourceType === 'dataset') && (
      <div>
        {'formSource' in element && (
        <SelectFieldEditor
          id="formSource"
          label={element.sourceType === 'dataset' ? 'Dataset Source' : 'Form Source'}
          value={formSourceValue}
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
          <label className="control-label">
            {element.sourceType === 'dataset' ? 'Select Dataset Keys' : 'Select Fields'}
          </label>
          {activeForm.columns
                  .filter((item) => toPlainText(item.label || item.text || item.field_name || '') !== '')
                  .map((item) => (
                    <CheckboxFieldEditor
                      key={item.field_name}
                      id={item.field_name}
                      label={toPlainText(item.label || item.text || item.field_name || '')}
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
