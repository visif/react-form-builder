// eslint-disable-next-line max-classes-per-file
import React from 'react'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import Select from 'react-select'
import SignaturePad from 'react-signature-canvas'
import TextAreaAutosize from 'react-textarea-autosize'
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'
import DataSource from './datasource'
import DatePicker from './date-picker'
import FileUpload from './fileUpload2'
import FormulaInput from './formula-input'
import HeaderBar from './header-bar'
import ImageUpload from './imageUpload'
import myxss from './myxss'
import Section from './section'
import Signature2 from './signature2'
import StarRating from './star-rating'
import Table from './table'

const FormElements = {}

class Header extends React.Component {
  render() {
    // const headerClasses = `dynamic-input ${this.props.data.element}-input`;
    let classNames = 'static'
    if (this.props.data.bold) {
      classNames += ' bold'
    }
    if (this.props.data.italic) {
      classNames += ' italic'
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <h3
          className={classNames}
          dangerouslySetInnerHTML={{
            __html: myxss.process(this.props.data.content),
          }}
        />
      </div>
    )
  }
}

class Paragraph extends React.Component {
  render() {
    let classNames = 'static'
    if (this.props.data.bold) {
      classNames += ' bold'
    }
    if (this.props.data.italic) {
      classNames += ' italic'
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <p
          className={classNames}
          dangerouslySetInnerHTML={{
            __html: myxss.process(this.props.data.content),
          }}
        />
      </div>
    )
  }
}

class Label extends React.Component {
  render() {
    let classNames = 'static'
    if (this.props.data.bold) {
      classNames += ' bold'
    }
    if (this.props.data.italic) {
      classNames += ' italic'
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <label
          className={classNames}
          dangerouslySetInnerHTML={{
            __html: myxss.process(this.props.data.content),
          }}
        />
      </div>
    )
  }
}

class LineBreak extends React.Component {
  render() {
    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <hr />
      </div>
    )
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: props.defaultValue || ''
    }
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({ value })
    
    const { data, handleChange } = this.props
    const { formularKey } = data
    if (formularKey && handleChange) {
      handleChange(formularKey, value)
    }
    
    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      // Create updated data object with the new value
      const updatedData = {
        ...this.props.data,
        value: value
      }
      
      // Send it for synchronization across columns
      this.props.onElementChange(updatedData)
      
      // Immediately apply changes to this component's data
      if (this.props.data.dirty === undefined || this.props.data.dirty) {
        updatedData.dirty = true
        if (this.props.updateElement) {
          this.props.updateElement(updatedData)
        }
      }
    }
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    const props = {}
    props.type = 'text'
    props.className = 'form-control'
    props.name = this.props.data.field_name
    props.onChange = this.handleChange
    props.value = this.state.value

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue
      props.ref = this.inputField
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    if (this.props.read_only || !isSameEditor) {
      props.disabled = 'disabled'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          <input {...props} />
        </div>
      </div>
    )
  }
}

class NumberInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: props.defaultValue || ''
    }
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({ value })
    
    const { data, handleChange } = this.props
    const { formularKey } = data
    if (formularKey && handleChange) {
      handleChange(formularKey, value)
    }
    
    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      // Create updated data object with the new value
      const updatedData = {
        ...this.props.data,
        value: value
      }
      
      // Send it for synchronization across columns
      this.props.onElementChange(updatedData)
      
      // Immediately apply changes to this component's data
      if (this.props.data.dirty === undefined || this.props.data.dirty) {
        updatedData.dirty = true
        if (this.props.updateElement) {
          this.props.updateElement(updatedData)
        }
      }
    }
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    const props = {}
    props.type = 'number'
    props.className = 'form-control'
    props.name = this.props.data.field_name
    props.onChange = this.handleChange
    props.value = this.state.value

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue
      props.ref = this.inputField
    }

    if (this.props.read_only || !isSameEditor) {
      props.disabled = 'disabled'
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          <input {...props} />
        </div>
      </div>
    )
  }
}

class TextArea extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: props.defaultValue || ''
    }
  }
  
  handleChange(e) {
    const value = e.target.value
    this.setState({ value })
    
    const { data, handleChange } = this.props
    const { formularKey } = data
    if (formularKey && handleChange) {
      handleChange(formularKey, value)
    }
    
    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      // Create updated data object with the new value
      const updatedData = {
        ...this.props.data,
        value: value
      }
      
      // Send it for synchronization across columns
      this.props.onElementChange(updatedData)
      
      // Immediately apply changes to this component's data
      if (this.props.data.dirty === undefined || this.props.data.dirty) {
        updatedData.dirty = true
        if (this.props.updateElement) {
          this.props.updateElement(updatedData)
        }
      }
    }
  }
  
  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    const props = {}
    props.className = 'form-control'
    props.name = this.props.data.field_name
    props.minRows = 3
    props.onChange = this.handleChange
    props.value = this.state.value

    if (this.props.read_only || !isSameEditor) {
      props.disabled = 'disabled'
    }

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue
      props.ref = this.inputField
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          <TextAreaAutosize {...props} />
        </div>
      </div>
    )
  }
}

class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()

    this.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      return {
        defaultValue: props.defaultValue,
        value: props.defaultValue,
      }
    }
    return state
  }

  handleChange = (e) => {
    const constValue = e.target.value
    this.setState({ value: constValue })

    const { data, handleChange } = this.props
    const { formularKey } = data
    if (formularKey && handleChange) {
      handleChange(formularKey, constValue)
    }
    
    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      // Create updated data object with the new value
      const updatedData = {
        ...this.props.data,
        value: constValue
      }
      
      // Send it for synchronization across columns
      this.props.onElementChange(updatedData)
      
      // Immediately apply changes to this component's data
      // This makes changes visible in edit mode instantly
      if (this.props.data.dirty === undefined || this.props.data.dirty) {
        updatedData.dirty = true
        if (this.props.updateElement) {
          this.props.updateElement(updatedData)
        }
      }
    }
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    const props = {}
    props.className = 'form-control'
    props.name = this.props.data.field_name
    props.value = this.state.value
    props.onChange = this.handleChange

    if (this.props.mutable) {
      props.defaultValue = this.state.value
      props.ref = this.inputField
    }

    if (this.props.read_only || !isSameEditor) {
      props.disabled = 'disabled'
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          <select {...props}>
            <option value="" key="default-0">
              Please Select
            </option>
            {this.props.data.options.map((option) => {
              const this_key = `preview_${option.key}`
              return (
                <option value={option.value} key={this_key}>
                  {option.text}
                </option>
              )
            })}
          </select>
        </div>
      </div>
    )
  }
}

class Signature extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultValue: props.defaultValue,
    }
    this.inputField = React.createRef()
    this.canvas = React.createRef()
  }

  clear = () => {
    if (this.state.defaultValue) {
      this.setState({ defaultValue: '' })
      
      // Immediately apply changes to this component's data when clearing signature
      if (this.props.onElementChange) {
        const updatedData = {
          ...this.props.data,
          value: ''
        }
        
        this.props.onElementChange(updatedData)
        
        if (this.props.data.dirty === undefined || this.props.data.dirty) {
          updatedData.dirty = true
          if (this.props.updateElement) {
            this.props.updateElement(updatedData)
          }
        }
      }
    } else if (this.canvas.current) {
      this.canvas.current.clear()
    }
  }
  
  // Handle signature changes
  handleSignatureChange = () => {
    // Only trigger if canvas is available
    if (!this.canvas.current) return;
    
    // Get the signature data
    const signatureData = this.canvas.current.toDataURL().split(',')[1];
    
    // If onElementChange is provided, call it to synchronize changes across columns
    if (this.props.onElementChange) {
      const updatedData = {
        ...this.props.data,
        value: signatureData
      }
      
      this.props.onElementChange(updatedData)
      
      // Immediately apply changes to this component's data
      if (this.props.data.dirty === undefined || this.props.data.dirty) {
        updatedData.dirty = true
        if (this.props.updateElement) {
          this.props.updateElement(updatedData)
        }
      }
    }
    
    this.setState({ defaultValue: signatureData })
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    const { defaultValue } = this.state
    let canClear = !!defaultValue
    const props = {}
    props.type = 'hidden'
    props.name = this.props.data.field_name

    if (this.props.mutable) {
      props.defaultValue = defaultValue
      props.ref = this.inputField
    }
    const pad_props = {}
    // umd requires canvasProps={{ width: 400, height: 150 }}
    if (this.props.mutable) {
      pad_props.defaultValue = defaultValue
      pad_props.ref = this.canvas
      pad_props.onEnd = this.handleSignatureChange
      canClear = !this.props.read_only || isSameEditor
    }

    if (this.props.read_only || !isSameEditor) {
      props.disabled = 'disabled'
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    let sourceDataURL
    if (defaultValue && defaultValue.length > 0) {
      sourceDataURL = `data:image/png;base64,${defaultValue}`
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          {this.props.read_only === true || !isSameEditor || !!sourceDataURL ? (
            <img src={sourceDataURL} />
          ) : (
            <SignaturePad {...pad_props} />
          )}
          {canClear && (
            <i
              className="fas fa-times clear-signature"
              onClick={this.clear}
              title="Clear Signature"
            ></i>
          )}
          <input {...props} />
        </div>
      </div>
    )
  }
}

class Tags extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
    const { defaultValue, data } = props
    this.state = { value: this.getDefaultValue(defaultValue, data.options) }
  }

  getDefaultValue(defaultValue, options) {
    if (defaultValue) {
      if (typeof defaultValue === 'string') {
        const vals = defaultValue.split(',').map((x) => x.trim())
        return options.filter((x) => vals.indexOf(x.value) > -1)
      }
      return options.filter((x) => defaultValue.indexOf(x.value) > -1)
    }
    return []
  }

  // state = { value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(',') : [] };

  handleChange = (e) => {
    this.setState({ value: e || [] })
  }

  render() {
    const options = this.props.data.options.map((option) => {
      option.label = option.text
      return option
    })
    const props = {}
    props.isMulti = true
    props.name = this.props.data.field_name
    props.onChange = this.handleChange

    props.options = options
    if (!this.props.mutable) {
      props.value = options[0].text
    } // to show a sample of what tags looks like

    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    if (this.props.mutable) {
      //props.isDisabled = this.props.read_only;
      props.isDisabled = this.props.read_only || !isSameEditor ? true : false
      props.value = this.state.value
      props.ref = this.inputField
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          <Select {...props} />
        </div>
      </div>
    )
  }
}

class Checkboxes extends React.Component {
  constructor(props) {
    super(props)
    this.options = {}
    this.infos = {}
    this.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      return {
        defaultValue: props.defaultValue,
        value: props.defaultValue,
      }
    }
    return state
  }

  getActiveValue = (values, key) => {
    return values?.find((item) => item.key === key)
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    const self = this
    let classNames = 'custom-control custom-checkbox'
    if (this.props.data.inline) {
      classNames += ' option-inline'
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel className="form-label" {...this.props} />
          {this.props.data.options.map((option) => {
            const this_key = `preview_${option.key}`

            const props = {}
            props.name = `option_${option.key}`
            props.type = 'checkbox'
            props.value = option.value

            // Check if the option is selected either from state or option properties
            const answerItem = self.getActiveValue(self.state.value, option.key)
            const isCheckedInOptions = option.checked || option.selected

            if (self.props.mutable) {
              props.checked = answerItem?.value ?? isCheckedInOptions ?? false
            }

            if (this.props.read_only || !isSameEditor) {
              props.disabled = 'disabled'
            }

            return (
              <div
                className={classNames}
                key={this_key}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <input
                  id={'fid_' + this_key}
                  className="custom-control-input"
                  ref={(c) => {
                    if (c && self.props.mutable) {
                      self.options[`child_ref_${option.key}`] = c
                    }
                  }}
                  onChange={() => {
                    if (isSameEditor) {
                      self.setState((current) => {
                        const activeVal = self.getActiveValue(
                          current && current.value,
                          option.key
                        )
                        const newActiveVal = activeVal
                          ? { ...activeVal, value: !activeVal.value }
                          : {
                              key: option.key,
                              value: true,
                              info: '',
                            }

                        if (!current) {
                          return current
                        }

                        const newValue = {
                          ...current,
                          value: [
                            ...(current.value || []).filter(
                              (item) => item.key !== option.key
                            ),
                            newActiveVal,
                          ],
                        }
                        
                        // If we're in a dynamic column and this is a UI-only change (selection)
                        // We need to update just this component's internal state without syncing to other rows
                        const isInDynamicColumn = self.props.data.parentId && 
                                                 self.props.data.row !== undefined && 
                                                 self.props.data.col !== undefined;
                        
                        // Always update the local element state for immediate visual feedback
                        if (self.props.updateElement) {
                          // Apply the checked state to just this element's data
                          const updatedData = {
                            ...self.props.data,
                            dirty: true,
                            value: newValue.value
                          };
                          
                          // Update the local options to show selection visually
                          // This only affects THIS element, not others in the column
                          const localOptions = self.props.data.options.map(opt => ({
                            ...opt,
                            checked: opt.key === option.key 
                              ? !activeVal?.value 
                              : self.getActiveValue(newValue.value, opt.key)?.value || false
                          }));
                          updatedData.options = localOptions;
                          
                          // Update just this element
                          self.props.updateElement(updatedData);
                        }
                        
                        // If onElementChange is provided, but we avoid sending selection state
                        if (self.props.onElementChange && isInDynamicColumn) {
                          // For selection changes in dynamic columns, we don't want to sync the selection state
                          // but we still need to notify the system that a change happened for other purposes
                          // Create a copy that doesn't modify the selection state
                          const updatedDataForSync = {
                            ...self.props.data
                            // Deliberately NOT updating options or selection state
                          };
                          
                          // Mark this as a selection-only change that shouldn't be synced
                          updatedDataForSync._selectionChangeOnly = true;
                          
                          // Notify the system about the change, but without selection state changes
                          self.props.onElementChange(updatedDataForSync);
                        }

                        return newValue
                      })
                    }
                  }}
                  {...props}
                />
                <label className="custom-control-label" htmlFor={'fid_' + this_key}>
                  {option.text}
                </label>
                {props.checked && option.info && (
                  <input
                    id={'fid_' + this_key + '_info'}
                    type="text"
                    className="form-control"
                    style={{
                      width: 'auto',
                      marginLeft: 16,
                      height: 'calc(1.5em + .5rem)',
                      marginBottom: 4,
                    }}
                    defaultValue={answerItem?.info ?? ''}
                    ref={(c) => {
                      if (c && self.props.mutable) {
                        self.infos[`child_ref_${option.key}_info`] = c
                      }
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

class RadioButtons extends React.Component {
  constructor(props) {
    super(props)
    this.options = {}
    this.infos = {}
    this.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      return {
        defaultValue: props.defaultValue,
        value: props.defaultValue,
      }
    }
    return state
  }

  getActiveValue = (values, key) => {
    return values?.find((item) => item.key === key)
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    const self = this
    let classNames = 'custom-control custom-radio'
    if (this.props.data.inline) {
      classNames += ' option-inline'
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    const { data, handleChange } = this.props
    const { formularKey } = data

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel className="form-label" {...this.props} />
          {this.props.data.options.map((option) => {
            const this_key = `preview_${option.key}`
            const props = {}
            props.name = self.props.data.field_name

            props.type = 'radio'
            props.value = option.value

            // Check if the option is selected either from state or option properties
            const answerItem = self.getActiveValue(self.state.value, option.key)
            const isCheckedInOptions = option.checked || option.selected

            if (self.props.mutable) {
              props.checked = answerItem?.value ?? isCheckedInOptions ?? false
            }

            if (this.props.read_only || !isSameEditor) {
              props.disabled = 'disabled'
            }

            return (
              <div
                className={classNames}
                key={this_key}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <input
                  id={'fid_' + this_key}
                  className="custom-control-input"
                  ref={(c) => {
                    if (c && self.props.mutable) {
                      self.options[`child_ref_${option.key}`] = c
                    }
                  }}
                  onChange={() => {
                    self.setState((current) => {
                      if (formularKey && handleChange) {
                        handleChange(formularKey, option.value)
                      }

                      const newValue = {
                        ...current,
                        value: [
                          {
                            key: option.key,
                            value: true,
                            info: '',
                          },
                        ],
                      };

                      // If we're in a dynamic column and this is a UI-only change (selection)
                      // We need to update just this component's internal state without syncing to other rows
                      const isInDynamicColumn = self.props.data.parentId && 
                                               self.props.data.row !== undefined && 
                                               self.props.data.col !== undefined;
                      
                      // Always update the local element state for immediate visual feedback
                      if (self.props.updateElement) {
                        // Apply the checked state to just this element's data
                        const updatedData = {
                          ...self.props.data,
                          dirty: true,
                          value: [{
                            key: option.key,
                            value: true
                          }]
                        };
                        
                        // Update the local options to show selection visually
                        // This only affects THIS element, not others in the column
                        const localOptions = self.props.data.options.map(opt => ({
                          ...opt,
                          checked: opt.key === option.key,
                          selected: opt.key === option.key
                        }));
                        updatedData.options = localOptions;
                        
                        // Update just this element
                        self.props.updateElement(updatedData);
                      }
                      
                      // If onElementChange is provided, but we avoid sending selection state
                      if (self.props.onElementChange && isInDynamicColumn) {
                        // For selection changes in dynamic columns, we don't want to sync the selection state
                        // but we still need to notify the system that a change happened for other purposes
                        // Create a copy that doesn't modify the selection state
                        const updatedDataForSync = {
                          ...self.props.data
                          // Deliberately NOT updating options or selection state
                        };
                        
                        // Mark this as a selection-only change that shouldn't be synced
                        updatedDataForSync._selectionChangeOnly = true;
                        
                        // Notify the system about the change, but without selection state changes
                        self.props.onElementChange(updatedDataForSync);
                      }

                      return newValue;
                    })
                  }}
                  {...props}
                />
                <label className="custom-control-label" htmlFor={'fid_' + this_key}>
                  {option.text}
                </label>
                {props.checked && option.info && (
                  <input
                    id={'fid_' + this_key + '_info'}
                    type="text"
                    className="form-control"
                    style={{
                      width: 'auto',
                      marginLeft: 16,
                      height: 'calc(1.5em + .5rem)',
                    }}
                    defaultValue={answerItem?.info ?? ''}
                    ref={(c) => {
                      if (c && self.props.mutable) {
                        self.infos[`child_ref_${option.key}_info`] = c
                      }
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const Image = (props) => {
  const style = props.data.center ? { textAlign: 'center' } : null

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses} style={style}>
      <ComponentHeader {...props} />
      {props.data.src && (
        <img
          style={{ maxWidth: '100%', height: 'auto' }}
          src={props.data.src}
          width={props.data.width}
          height={props.data.height}
        />
      )}
      {!props.data.src && <div className="no-image">No Image</div>}
    </div>
  )
}

class Rating extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    const props = {}
    props.name = this.props.data.field_name
    props.ratingAmount = 5

    if (this.props.mutable) {
      props.rating =
        this.props.defaultValue !== undefined
          ? parseFloat(this.props.defaultValue, 10)
          : 0
      props.editing = true
      //props.disabled = this.props.read_only ||;
      props.disabled = this.props.read_only || !isSameEditor ? true : false
      props.ref = this.inputField
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          <StarRating {...props} />
        </div>
      </div>
    )
  }
}

class HyperLink extends React.Component {
  render() {
    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <a target="_blank" href={this.props.data.href}>
            {this.props.data.content}
          </a>
        </div>
      </div>
    )
  }
}

class Download extends React.Component {
  render() {
    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <a href={`${this.props.download_path}?id=${this.props.data.file_path}`}>
            {this.props.data.content}
          </a>
        </div>
      </div>
    )
  }
}

class Camera extends React.Component {
  constructor(props) {
    super(props)
    this.state = { img: null }
  }

  displayImage = (e) => {
    const self = this
    const target = e.target
    let file
    let reader

    if (target.files && target.files.length) {
      file = target.files[0]
      // eslint-disable-next-line no-undef
      reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = () => {
        self.setState({
          img: reader.result,
        })
      }
    }
  }

  clearImage = () => {
    this.setState({
      img: null,
    })
  }

  render() {
    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    const name = this.props.data.field_name
    const fileInputStyle = this.state.img ? { display: 'none' } : null
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }
    let sourceDataURL
    if (
      this.props.read_only === true &&
      this.props.defaultValue &&
      this.props.defaultValue.length > 0
    ) {
      if (this.props.defaultValue.indexOf(name > -1)) {
        sourceDataURL = this.props.defaultValue
      } else {
        sourceDataURL = `data:image/png;base64,${this.props.defaultValue}`
      }
    }
    console.log('sourceDataURL', sourceDataURL)
    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          {this.props.read_only === true &&
          this.props.defaultValue &&
          this.props.defaultValue.length > 0 ? (
            <div>
              <img src={sourceDataURL} />
            </div>
          ) : (
            <div className="image-upload-container">
              <div style={fileInputStyle}>
                <input
                  name={name}
                  type="file"
                  accept="image/*"
                  capture="camera"
                  className="image-upload"
                  onChange={this.displayImage}
                />
                <div className="image-upload-control">
                  <div className="btn btn-default">
                    <i className="fas fa-camera"></i> Upload Photo
                  </div>
                  <p>Select an image from your computer or device.</p>
                </div>
              </div>

              {this.state.img && (
                <div>
                  <img
                    src={this.state.img}
                    height="100"
                    className="image-upload-preview"
                  />
                  <br />
                  <div className="btn btn-image-clear" onClick={this.clearImage}>
                    <i className="fas fa-times"></i> Clear Photo
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

class Range extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
    this.state = {
      value:
        props.defaultValue !== undefined
          ? parseInt(props.defaultValue, 10)
          : parseInt(props.data.default_value, 10),
    }
  }

  changeValue = (e) => {
    const { target } = e
    this.setState({
      value: target.value,
    })
  }

  render() {
    const props = {}
    const name = this.props.data.field_name

    props.type = 'range'
    props.list = `tickmarks_${name}`
    props.min = this.props.data.min_value
    props.max = this.props.data.max_value
    props.step = this.props.data.step

    props.value = this.state.value
    props.change = this.changeValue

    if (this.props.mutable) {
      props.ref = this.inputField
    }

    const datalist = []
    for (
      let i = parseInt(props.min_value, 10);
      i <= parseInt(props.max_value, 10);
      i += parseInt(props.step, 10)
    ) {
      datalist.push(i)
    }

    const oneBig = 100 / (datalist.length - 1)

    const _datalist = datalist.map((d, idx) => (
      <option key={`${props.list}_${idx}`}>{d}</option>
    ))

    const visible_marks = datalist.map((d, idx) => {
      const option_props = {}
      let w = oneBig
      if (idx === 0 || idx === datalist.length - 1) {
        w = oneBig / 2
      }
      option_props.key = `${props.list}_label_${idx}`
      option_props.style = { width: `${w}%` }
      if (idx === datalist.length - 1) {
        option_props.style = { width: `${w}%`, textAlign: 'right' }
      }
      return <label {...option_props}>{d}</label>
    })

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          <div className="range">
            <div className="clearfix">
              <span className="float-left">{this.props.data.min_label}</span>
              <span className="float-right">{this.props.data.max_label}</span>
            </div>
            <ReactBootstrapSlider {...props} />
          </div>
          <div className="visible_marks">{visible_marks}</div>
          <input name={name} value={this.state.value} type="hidden" />
          <datalist id={props.list}>{_datalist}</datalist>
        </div>
      </div>
    )
  }
}

FormElements.Header = Header
FormElements.HeaderBar = HeaderBar
FormElements.Paragraph = Paragraph
FormElements.Label = Label
FormElements.LineBreak = LineBreak
FormElements.TextInput = TextInput
FormElements.NumberInput = NumberInput
FormElements.TextArea = TextArea
FormElements.Dropdown = Dropdown
FormElements.Signature = Signature
FormElements.Checkboxes = Checkboxes
FormElements.DatePicker = DatePicker
FormElements.RadioButtons = RadioButtons
FormElements.Image = Image
FormElements.Rating = Rating
FormElements.Tags = Tags
FormElements.HyperLink = HyperLink
FormElements.Download = Download
FormElements.Camera = Camera
FormElements.Range = Range
FormElements.Table = Table
FormElements.Section = Section
FormElements.Signature2 = Signature2
FormElements.DataSource = DataSource
FormElements.FileUpload = FileUpload
FormElements.ImageUpload = ImageUpload
FormElements.FormulaInput = FormulaInput
export default FormElements
