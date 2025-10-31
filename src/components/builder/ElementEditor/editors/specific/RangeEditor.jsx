import React from 'react'

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
            <input
              id="rangeMin"
              type="number"
              className="form-control"
              defaultValue={element.min_value}
              onBlur={onBlur}
              onChange={(e) => onChange('min_value', 'value', e)}
            />
            <input
              type="text"
              className="form-control"
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
            <input
              id="rangeMax"
              type="number"
              className="form-control"
              defaultValue={element.max_value}
              onBlur={onBlur}
              onChange={(e) => onChange('max_value', 'value', e)}
            />
            <input
              type="text"
              className="form-control"
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
