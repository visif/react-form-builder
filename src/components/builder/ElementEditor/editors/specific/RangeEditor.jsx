import React from 'react'
import { InputNumber, Input } from 'antd'

import NumberFieldEditor from './NumberFieldEditor'
import TextFieldEditor from './TextFieldEditor'

/**
 * Range element editor with min/max values, labels, step, and default
 */
const RangeEditor = ({ element, onChange, onBlur }) => {
  return (
    <div>
      {'step' in element && (
        <NumberFieldEditor
          id="rangeStep"
          label="Step"
          value={element.step}
          onChange={(e) => onChange('step', 'value', e)}
          onBlur={onBlur}
        />
      )}

      {'min_value' in element && (
        <div className="form-group">
          <div className="form-group-range">
            <label className="control-label" htmlFor="rangeMin">
              Min
            </label>
            <InputNumber
              id="rangeMin"
              defaultValue={element.min_value}
              onBlur={onBlur}
              onChange={(value) => onChange('min_value', 'value', { target: { value } })}
              style={{ width: '100%', marginBottom: '4px' }}
            />
            <Input
              defaultValue={element.min_label}
              onBlur={onBlur}
              onChange={(e) => onChange('min_label', 'value', e)}
            />
          </div>
        </div>
      )}

      {'max_value' in element && (
        <div className="form-group">
          <div className="form-group-range">
            <label className="control-label" htmlFor="rangeMax">
              Max
            </label>
            <InputNumber
              id="rangeMax"
              defaultValue={element.max_value}
              onBlur={onBlur}
              onChange={(value) => onChange('max_value', 'value', { target: { value } })}
              style={{ width: '100%', marginBottom: '4px' }}
            />
            <Input
              defaultValue={element.max_label}
              onBlur={onBlur}
              onChange={(e) => onChange('max_label', 'value', e)}
            />
          </div>
        </div>
      )}

      {'default_value' in element && (
        <NumberFieldEditor
          id="defaultSelected"
          label="Default Selected"
          value={element.default_value}
          onChange={(e) => onChange('default_value', 'value', e)}
          onBlur={onBlur}
        />
      )}
    </div>
  )
}

export default RangeEditor
