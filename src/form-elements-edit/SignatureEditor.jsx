import React from 'react'
import TextFieldEditor from './TextFieldEditor'
import SelectFieldEditor from './SelectFieldEditor'

/**
 * Signature element editor
 * Handles position, specificRole, and variableKey for signature fields
 */
const SignatureEditor = ({
  element,
  onChange,
  onBlur
}) => {
  return (
    <div>
      {'position' in element && (
        <TextFieldEditor
          id="position"
          label="Role / Position"
          value={element.position}
          onChange={(e) => onChange('position', 'value', e)}
          onBlur={onBlur}
        />
      )}

      {'specificRole' in element && (
        <SelectFieldEditor
          id="specificRole"
          label={`Pre Defined User / Role ${Boolean(element.specificRole)}`}
          value={element.specificRole}
          options={[
            { value: 'specific', label: 'Specific role only', key: 'specific' },
            { value: 'notSpecific', label: 'Anyone can sign', key: 'notSpecific' }
          ]}
          onChange={(e) => onChange('specificRole', 'value', e)}
          onBlur={onBlur}
        />
      )}

      {element.element === 'Signature' && element.readOnly && (
        <TextFieldEditor
          id="variableKey"
          label="Variable Key:"
          value={element.variableKey}
          onChange={(e) => onChange('variableKey', 'value', e)}
          onBlur={onBlur}
          helpText="This will give the element a key that can be used to replace the content with a runtime value."
        />
      )}
    </div>
  )
}

export default SignatureEditor
