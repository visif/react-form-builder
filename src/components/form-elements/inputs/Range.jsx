import React from 'react'

import { Slider } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Range = (props) => {
  const inputField = React.useRef(null)
  const [value, setValue] = React.useState(
    props.defaultValue !== undefined
      ? parseInt(props.defaultValue, 10)
      : parseInt(props.data.default_value, 10)
  )

  // Initialize form context with initial value
  React.useEffect(() => {
    if (props.handleChange) {
      const initialValue =
        props.defaultValue !== undefined
          ? parseInt(props.defaultValue, 10)
          : parseInt(props.data.default_value, 10)
      props.handleChange(props.data.field_name, initialValue)
    }
  }, []) // Only on mount

  const changeValue = React.useCallback(
    (e) => {
      const { target } = e
      const newValue = parseInt(target.value, 10)
      setValue(newValue)

      // Update form context
      if (props.handleChange) {
        props.handleChange(props.data.field_name, newValue)
      }
    },
    [props]
  )

  const rangeProps = {}
  const name = props.data.field_name

  rangeProps.type = 'range'
  rangeProps.list = `tickmarks_${name}`
  rangeProps.min = props.data.min_value
  rangeProps.max = props.data.max_value
  rangeProps.step = props.data.step

  rangeProps.value = value
  rangeProps.change = changeValue

  if (props.mutable) {
    rangeProps.ref = inputField
  }

  const datalist = []
  for (
    let i = parseInt(rangeProps.min, 10);
    i <= parseInt(rangeProps.max, 10);
    i += parseInt(rangeProps.step, 10)
  ) {
    datalist.push(i)
  }

  const oneBig = 100 / (datalist.length - 1)

  const _datalist = datalist.map((d, idx) => <option key={`${rangeProps.list}_${idx}`}>{d}</option>)

  const visible_marks = datalist.map((d, idx) => {
    const option_props = {}
    let w = oneBig
    if (idx === 0 || idx === datalist.length - 1) {
      w = oneBig / 2
    }
    option_props.key = `${rangeProps.list}_label_${idx}`
    option_props.style = { width: `${w}%` }
    if (idx === datalist.length - 1) {
      option_props.style = { width: `${w}%`, textAlign: 'right' }
    }
    return <label {...option_props}>{d}</label>
  })

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        <div className="range">
          <div className="clearfix">
            <span className="float-left">{props.data.min_label}</span>
            <span className="float-right">{props.data.max_label}</span>
          </div>
          <Slider
            min={rangeProps.min}
            max={rangeProps.max}
            step={rangeProps.step}
            value={rangeProps.value}
            onChange={(newValue) => {
              setValue(newValue)

              // Update form context
              if (props.handleChange) {
                props.handleChange(props.data.field_name, newValue)
              }

              if (rangeProps.change) {
                rangeProps.change({ target: { value: newValue } })
              }
            }}
            marks={datalist.reduce((acc, val) => {
              acc[val] = ''
              return acc
            }, {})}
          />
        </div>
        <div className="visible_marks">{visible_marks}</div>
        <input name={name} value={value} type="hidden" />
        <datalist id={rangeProps.list}>{_datalist}</datalist>
      </div>
    </div>
  )
}

export default Range
