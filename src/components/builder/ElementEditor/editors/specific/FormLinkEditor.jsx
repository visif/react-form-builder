import React from 'react'

import { Input } from 'antd'

import SelectFieldEditor from './SelectFieldEditor'

/**
 * FormLink element editor
 * Handles form selection and SubForm name
 */
const FormLinkEditor = ({
  element,
  formDataSource,
  onChange,
  onBlur,
  onSubFormNameChange,
  onSubFormNameBlur,
  subFormTagPreview,
}) => (
  <div>
    <div className="form-group">
      <label className="control-label" htmlFor="formLinkSubFormName">
        Subform name
      </label>
      <Input
        id="formLinkSubFormName"
        value={element.uniqueName || ''}
        placeholder="Optional. Default is the Display Label."
        onChange={onSubFormNameChange}
        onBlur={onSubFormNameBlur}
      />
      <p className="help-block">
        Prefix for Dynamic Column Row tags from this SubForm, e.g.
        {' '}
        {subFormTagPreview || '#SubFormName_DynamicColumnRow1_c1#'}
        . Tags without a Subform name belong to the master form.
      </p>
    </div>

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
  </div>
)

export default FormLinkEditor
