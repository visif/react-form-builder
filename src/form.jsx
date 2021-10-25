/**
  * <Form />
  */

import React from 'react';
import ReactDOM from 'react-dom';
import { EventEmitter } from 'fbemitter';
import FormValidator from './form-validator';
import FormElements from './form-elements';
import { TwoColumnRow, ThreeColumnRow, FourColumnRow } from './multi-column';
import CustomElement from './form-elements/custom-element';
import Registry from './stores/registry';

const {
  Image, Checkboxes, Signature, Download, Camera,
} = FormElements;

const convert = (answers) => {
  if (Array.isArray(answers)) {
    const result = {};
    answers.forEach(x => {
      if (x.name.indexOf('tags_') > -1) {
        result[x.name] = x.value.map(y => y.value);
      } else {
        result[x.name] = x.value;
      }
    });
    return result;
  }
  return answers || {};
}

export default class ReactForm extends React.Component {
  form;

  inputs = {};

  constructor(props) {
    super(props);
    this.emitter = new EventEmitter();
    this.getDataById = this.getDataById.bind(this);
    this.state = {
      answerData: convert(props.answer_data)
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      answerData: convert(props.answer_data)
    };
  }

  _getDefaultValue(item) {
    return this.state.answerData[item.field_name];
  }

  _optionsDefaultValue(item) {
    const defaultValue = this._getDefaultValue(item);
    if (defaultValue) {
      return defaultValue;
    }

    const defaultChecked = [];
    item.options.forEach(option => {
      if (this.state.answerData[`option_${option.key}`]) {
        defaultChecked.push(option.key);
      }
    });
    return defaultChecked;
  }

  _getItemValue(item, ref) {
    let $item = {
      element: item.element,
      value: '',
    };
    if (item.element === 'Rating') {
      $item.value = ref.inputField.current.state.rating;
    } else if (item.element === 'Tags') {
      $item.value = ref.inputField.current.state.value;
    } else if (item.element === 'DatePicker') {
      $item.value = ref.state.value;
    } else if (item.element === 'Camera') {
      $item.value = ref.state.img ? ref.state.img.replace('data:image/png;base64,', '') : '';
    } else if (ref && ref.inputField && ref.inputField.current) {
      $item = ReactDOM.findDOMNode(ref.inputField.current);
      if ($item && typeof $item.value === 'string') {
        $item.value = $item.value.trim();
      }
    } else if (item.element === 'Table') {
      $item.value = ref.state.inputs;
    }

    return $item;
  }

  _isIncorrect(item) {
    let incorrect = false;
    if (item.canHaveAnswer) {
      const ref = this.inputs[item.field_name];
      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        item.options.forEach(option => {
          const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
          if ((option.hasOwnProperty('correct') && !$option.checked) || (!option.hasOwnProperty('correct') && $option.checked)) {
            incorrect = true;
          }
        });
      } else {
        const $item = this._getItemValue(item, ref);
        if (item.element === 'Rating') {
          if ($item.value.toString() !== item.correct) {
            incorrect = true;
          }
        } else if ($item.value.toLowerCase() !== item.correct.trim().toLowerCase()) {
          incorrect = true;
        }
      }
    }
    return incorrect;
  }

  _isInvalid(item) {
    let invalid = false;
    if (item.required === true) {
      const ref = this.inputs[item.field_name];
      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        let checked_options = 0;
        item.options.forEach(option => {
          const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
          if ($option.checked) {
            checked_options += 1;
          }
        });
        if (checked_options < 1) {
          // errors.push(item.label + ' is required!');
          invalid = true;
        }
      } else {
        const $item = this._getItemValue(item, ref);
        if (item.element === 'Rating') {
          if ($item.value === 0) {
            invalid = true;
          }
        } else if ($item.value === undefined || $item.value === null || $item.value.length < 1) {
          invalid = true;
        }
      }
    }
    return invalid;
  }

  _collect(item) {
    const itemData = {
      name: item.field_name,
      custom_name: item.custom_name || item.field_name,
    };
    const ref = this.inputs[item.field_name];

    if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
      const checked_options = [];

      item.options.forEach(option => {
        const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
        if ($option.checked) {
          let info = '';

          if (option.info) {
            const $info = ReactDOM.findDOMNode(ref.infos[`child_ref_${option.key}_info`]);
            info = $info?.value ?? '';
          }

          checked_options.push({
            key: option.key,
            value: true,
            info: info
          });
        }
      });

      itemData.value = checked_options;

    } else {
      if (!ref) return null;
      itemData.value = this._getItemValue(item, ref).value;
    }
    return itemData;
  }

  _collectFormData(data) {
    const formData = [];
    data.forEach(item => {
      const item_data = this._collect(item);
      if (item_data) {
        formData.push(item_data);
      }
    });
    return formData;
  }

  _collectFormItems(data) {
    const formData = [];
    data.forEach(item => {

      const itemValue = this._collect(item);
      const itemData = {
        id: item.id,
        element: item.element,
        value: itemValue && itemValue.value,
      };

      formData.push(itemData);

    });

    return formData;
  }

  _getSignatureImg(item) {
    const ref = this.inputs[item.field_name];
    const $canvas_sig = ref.canvas.current;
    if ($canvas_sig) {
      const base64 = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
      const isEmpty = $canvas_sig.isEmpty();
      const $input_sig = ReactDOM.findDOMNode(ref.inputField.current);
      if (isEmpty) {
        $input_sig.value = '';
      } else {
        $input_sig.value = base64;
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // let errors = [];
    // if (!this.props.skip_validations) {
    //   errors = this.validateForm();
    //   // Publish errors, if any.
    //   this.emitter.emit('formValidation', errors);
    // }

    // // Only submit if there are no errors.
    // if (errors.length < 1) {
    const { onSubmit } = this.props;

    // submit with no form
    if (onSubmit) {

      let errors = [];
      if (!this.props.skip_validations) {
        errors = this.validateForm();
        // Publish errors, if any.
        this.emitter.emit('formValidation', errors);
      }

      // Only submit if there are no errors.
      if (errors.length < 1) {
        const data = this._collectFormData(this.props.data);
        onSubmit(data);
      }
   
    } else { // incase no submit function provided => go to form submit

      let errors = [];
      if (!this.props.skip_validations) {
        errors = this.validateForm();
        // Publish errors, if any.
        this.emitter.emit('formValidation', errors);
      }

      // Only submit if there are no errors.
      if (errors.length < 1) {
        const $form = ReactDOM.findDOMNode(this.form);
        $form.submit();
      }

    }
    // }
  }

  validateForm() {
    const errors = [];
    let data_items = this.props.data;

    // get all input items
    const formItems = this._collectFormItems(this.props.data);
    const sectionItems = formItems.filter(item => item.element === 'Section' )

    // Validate with special condition when there is any section
    if (sectionItems.length > 0) {

      // split items into groups by section
      const firstItem = formItems[0];
      let activeSectionKey = firstItem.element === 'Section' ? firstItem.id : '';
      const sectionGroup = {};
      sectionGroup[activeSectionKey] = [];

      // group items by section separator
      formItems.forEach(item => {
        if (item.element === 'Section') {
          activeSectionKey = item.id
          sectionGroup[activeSectionKey] = [];
        } else {
          sectionGroup[activeSectionKey].push(item)
        }
      });

      let activeItems = [];

      // find only active section => there is any item with value input
      const keys = Object.keys(sectionGroup); 
      keys.forEach((key) => {
        const items = sectionGroup[key];
        const fillingItems = items.find(item => 
          item.element !== 'Table' 
          && item.element !== "Dropdown"
          && item.element !== "Range"
          && (
            (Array.isArray(item.value) && item.value.length > 0)
            || (!Array.isArray(item.value) && !!item.value)
          )
        );
        if (fillingItems) {
          activeItems = activeItems.concat(items)
        }
      });

      const itemIds = activeItems.map(item => item.id);
      data_items = this.props.data.filter(item => itemIds.includes(item.id));
    }

    data_items.forEach(item => {
      if (item.element === 'Signature') {
        this._getSignatureImg(item);
      }

      if (this._isInvalid(item)) {
        errors.push(`${item.label} is required!`);
      }

      if (this.props.validateForCorrectness && this._isIncorrect(item)) {
        errors.push(`${item.label} was answered incorrectly!`);
      }
    });

    return errors;
  }

  getDataById(id) {
    const { data } = this.props;
    return data.find(x => x.id === id);
  }

  getInputElement(item) {
    if (item.custom) {
      return this.getCustomElement(item);
    }
    const Input = FormElements[item.element];
    return (<Input
      handleChange={this.handleChange}
      ref={c => {
        this.inputs[item.field_name] = c}
      }
      mutable={true}
      key={`form_${item.id}`}
      data={item}
      read_only={this.props.read_only}
      defaultValue={this._getDefaultValue(item)} />);
  }

  getContainerElement(item, Element) {
    const controls = item.childItems.map(x => (x ? this.getInputElement(this.getDataById(x)) : <div>&nbsp;</div>));
    return (<Element mutable={true} key={`form_${item.id}`} data={item} controls={controls} />);
  }

  getSimpleElement(item) {
    const Element = FormElements[item.element];
    return (<Element mutable={true} key={`form_${item.id}`} data={item} />);
  }

  getCustomElement(item) {
    if (!item.component || typeof item.component !== 'function') {
      item.component = Registry.get(item.key);
      if (!item.component) {
        console.error(`${item.element} was not registered`);
      }
    }

    const inputProps = item.forwardRef && {
      handleChange: this.handleChange,
      defaultValue: this._getDefaultValue(item),
      ref: c => this.inputs[item.field_name] = c,
    };
    return (
      <CustomElement
        mutable={true}
        read_only={this.props.read_only}
        key={`form_${item.id}`}
        data={item}
        {...inputProps}
      />
    );
  }

  handleRenderSubmit = () => {
    const {
      actionName = 'Submit',
      submitButton = false,
    } = this.props;

    return submitButton || <input type='submit' className='btn btn-big' value={actionName} />;
  }

  render() {
    let data_items = this.props.data;

    if (this.props.display_short) {
      data_items = this.props.data.filter((i) => i.alternateForm === true);
    }

    data_items.forEach((item) => {
      if (item && item.readOnly && item.variableKey && this.props.variables[item.variableKey]) {
        this.state.answerData[item.field_name] = this.props.variables[item.variableKey];
      }
    });

    const items = data_items.filter(x => !x.parentId).map(item => {
      if (!item) return null;
      switch (item.element) {
        case 'TextInput':
        case 'NumberInput':
        case 'TextArea':
        case 'Table':
        case 'Dropdown':
        case 'DatePicker':
        case 'RadioButtons':
        case 'Rating':
        case 'Tags':
        case 'Range':
          return this.getInputElement(item);
        case 'CustomElement':
          return this.getCustomElement(item);
        case 'FourColumnRow':
          return this.getContainerElement(item, FourColumnRow);
        case 'ThreeColumnRow':
          return this.getContainerElement(item, ThreeColumnRow);
        case 'TwoColumnRow':
          return this.getContainerElement(item, TwoColumnRow);
        case 'Signature':
          return <Signature ref={c => this.inputs[item.field_name] = c} read_only={this.props.read_only || item.readOnly} mutable={true} key={`form_${item.id}`} data={item} defaultValue={this._getDefaultValue(item)} />;
        case 'Checkboxes':
          return (
            <Checkboxes 
              ref={c => this.inputs[item.field_name] = c}
              read_only={this.props.read_only} 
              handleChange={this.handleChange} 
              mutable={true} 
              key={`form_${item.id}`} 
              data={item} 
              defaultValue={this._optionsDefaultValue(item)} 
            />
          );
        case 'Image':
          return <Image ref={c => this.inputs[item.field_name] = c} handleChange={this.handleChange} mutable={true} key={`form_${item.id}`} data={item} defaultValue={this._getDefaultValue(item)} />;
        case 'Download':
          return <Download download_path={this.props.download_path} mutable={true} key={`form_${item.id}`} data={item} />;
        case 'Camera':
          return <Camera ref={c => this.inputs[item.field_name] = c} read_only={this.props.read_only || item.readOnly} mutable={true} key={`form_${item.id}`} data={item} defaultValue={this._getDefaultValue(item)} />;
        default:
          return this.getSimpleElement(item);
      }
    });

    const formTokenStyle = {
      display: 'none',
    };

    const backName = (this.props.back_name) ? this.props.back_name : 'Cancel';

    return (
      <div>
        <FormValidator emitter={this.emitter} />
        <div className='react-form-builder-form'>
          <form encType='multipart/form-data' 
            ref={c => this.form = c} 
            action={this.props.form_action} 
            onSubmit={this.handleSubmit.bind(this)} 
            method={this.props.form_method}
          >
            {this.props.authenticity_token &&
              <div style={formTokenStyle}>
                <input name='utf8' type='hidden' value='&#x2713;' />
                <input name='authenticity_token' type='hidden' value={this.props.authenticity_token} />
                <input name='task_id' type='hidden' value={this.props.task_id} />
              </div>
            }
            {items}
            <div className='btn-toolbar'>
              {!this.props.hide_actions &&
                this.handleRenderSubmit()
              }
              {!this.props.hide_actions && this.props.back_action &&
                <a href={this.props.back_action} className='btn btn-default btn-cancel btn-big'>{backName}</a>
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ReactForm.defaultProps = { validateForCorrectness: false };
