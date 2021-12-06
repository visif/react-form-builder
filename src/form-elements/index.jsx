// eslint-disable-next-line max-classes-per-file
import React from 'react';
import Select from 'react-select';
import SignaturePad from 'react-signature-canvas';
import ReactBootstrapSlider from 'react-bootstrap-slider';

import StarRating from './star-rating';
import HeaderBar from './header-bar';
import DatePicker from './date-picker';
import Table from './table';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import myxss from './myxss';
import Section from './section';
import Signature2 from './signature2';
import DataSource from './datasource';

const FormElements = {};

class Header extends React.Component {
  render() {
    // const headerClasses = `dynamic-input ${this.props.data.element}-input`;
    let classNames = 'static';
    if (this.props.data.bold) { classNames += ' bold'; }
    if (this.props.data.italic) { classNames += ' italic'; }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <h3 className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.data.content) }} />
      </div>
    );
  }
}

class Paragraph extends React.Component {
  render() {
    let classNames = 'static';
    if (this.props.data.bold) { classNames += ' bold'; }
    if (this.props.data.italic) { classNames += ' italic'; }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <p className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.data.content) }} />
      </div>
    );
  }
}

class Label extends React.Component {
  render() {
    let classNames = 'static';
    if (this.props.data.bold) { classNames += ' bold'; }
    if (this.props.data.italic) { classNames += ' italic'; }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <label className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.data.content) }} />
      </div>
    );
  }
}

class LineBreak extends React.Component {
  render() {
    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <hr />
      </div>
    );
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.type = 'text';
    props.className = 'form-control';
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    if (this.props.read_only) {
      props.disabled = 'disabled';
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <input {...props} />
        </div>
      </div>
    );
  }
}

class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.type = 'number';
    props.className = 'form-control';
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    if (this.props.read_only) {
      props.disabled = 'disabled';
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <input {...props} />
        </div>
      </div>
    );
  }
}

class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.className = 'form-control';
    props.name = this.props.data.field_name;

    if (this.props.read_only) {
      props.disabled = 'disabled';
    }

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <textarea {...props} />
        </div>
      </div>
    );
  }
}


class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();

    this.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue
    };
  }

  static getDerivedStateFromProps(props, state) {
    console.log('Dropdown getDerivedStateFromProps')
    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log('Dropdown default prop changed', state.defaultValue, props.defaultValue)
      return {
        defaultValue: props.defaultValue,
        value: props.defaultValue 
      }
    }
    return state;
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  render() {
    const props = {};
    props.className = 'form-control';
    props.name = this.props.data.field_name;
    props.value = this.state.value;
    props.onChange = this.handleChange;

    if (this.props.mutable) {
      props.defaultValue = this.state.value;
      props.ref = this.inputField;
    }

    if (this.props.read_only) {
      props.disabled = 'disabled';
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <select {...props}>
            {this.props.data.options.map((option) => {
              const this_key = `preview_${option.key}`;
              return <option value={option.value} key={this_key}>{option.text}</option>;
            })}
          </select>
        </div>
      </div>
    );
  }
}

class Signature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue,
    };
    this.inputField = React.createRef();
    this.canvas = React.createRef();
  }

  clear = () => {
    if (this.state.defaultValue) {
      this.setState({ defaultValue: '' });
    } else if (this.canvas.current) {
      this.canvas.current.clear();
    }
  }

  render() {
    const { defaultValue } = this.state;
    let canClear = !!defaultValue;
    const props = {};
    props.type = 'hidden';
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = defaultValue;
      props.ref = this.inputField;
    }
    const pad_props = {};
    // umd requires canvasProps={{ width: 400, height: 150 }}
    if (this.props.mutable) {
      pad_props.defaultValue = defaultValue;
      pad_props.ref = this.canvas;
      canClear = !this.props.read_only;
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    let sourceDataURL;
    if (defaultValue && defaultValue.length > 0) {
      sourceDataURL = `data:image/png;base64,${defaultValue}`;
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          {this.props.read_only === true || !!sourceDataURL
            ? (<img src={sourceDataURL} />)
            : (<SignaturePad {...pad_props} />)
          }
          {canClear && (
            <i className="fas fa-times clear-signature" onClick={this.clear} title="Clear Signature"></i>)}
          <input {...props} />
        </div>
      </div>
    );
  }
}

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    const { defaultValue, data } = props;
    this.state = { value: this.getDefaultValue(defaultValue, data.options) };
  }

  getDefaultValue(defaultValue, options) {
    if (defaultValue) {
      if (typeof defaultValue === 'string') {
        const vals = defaultValue.split(',').map(x => x.trim());
        return options.filter(x => vals.indexOf(x.value) > -1);
      }
      return options.filter(x => defaultValue.indexOf(x.value) > -1);
    }
    return [];
  }

  // state = { value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(',') : [] };

  handleChange = (e) => {
    this.setState({ value: e || [] });
  };

  render() {
    const options = this.props.data.options.map(option => {
      option.label = option.text;
      return option;
    });
    const props = {};
    props.isMulti = true;
    props.name = this.props.data.field_name;
    props.onChange = this.handleChange;

    props.options = options;
    if (!this.props.mutable) { props.value = options[0].text; } // to show a sample of what tags looks like
    if (this.props.mutable) {
      props.isDisabled = this.props.read_only;
      props.value = this.state.value;
      props.ref = this.inputField;
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <Select {...props} />
        </div>
      </div>
    );
  }
}

class Checkboxes extends React.Component {
  constructor(props) {
    super(props);
    this.options = {};
    this.infos = {};
    this.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue
    };
  }

  static getDerivedStateFromProps(props, state) {
    console.log('Checkboxes getDerivedStateFromProps')
    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log('Checkboxes default prop changed', state.defaultValue, props.defaultValue)
      return {
        defaultValue: props.defaultValue,
        value: props.defaultValue 
      }
    }
    return state;
  }

  getActiveValue = (values, key) => {
    return values?.find(item => item.key === key)
  }

  render() {
    const self = this;
    let classNames = 'custom-control custom-checkbox';
    if (this.props.data.inline) { classNames += ' option-inline'; }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel className="form-label" {...this.props} />
          {
            this.props.data.options.map((option) => {
              const this_key = `preview_${option.key}`;

              const props = {};
              props.name = `option_${option.key}`;
              props.type = 'checkbox';
              props.value = option.value;

              const answerItem = self.getActiveValue(self.state.value, option.key)

              if (self.props.mutable) {
                props.checked = answerItem?.value ?? false;
              }

              if (this.props.read_only) {
                props.disabled = 'disabled';
              }

              console.log('Checkbox =>> ', props);

              return (
                <div className={classNames} key={this_key} style={{ display: "flex", alignItems: "center" }}>
                  <input 
                    id={"fid_" + this_key} 
                    className="custom-control-input" 
                    ref={c => {
                      if (c && self.props.mutable) {
                        self.options[`child_ref_${option.key}`] = c;
                      }
                    }}
                    onChange={() => {
                      self.setState((current) => { 
                        const activeVal = self.getActiveValue(current.value, option.key)
                        const newActiveVal = activeVal ? { ...activeVal, value: !activeVal.value} : {
                          key: option.key, value: true, info: ''
                        }

                        return {
                          ...current,
                          value: [ 
                            ...(current.value).filter(item => item.key !== option.key),
                            newActiveVal
                          ]
                        };
                      })
                    }} 
                    {...props}
                  />
                  <label className="custom-control-label" htmlFor={"fid_" + this_key}>{option.text}</label>
                  {
                    props.checked && option.info && 
                      <input 
                        id={"fid_" + this_key + "_info"} 
                        type="text" 
                        class="form-control" 
                        style={{ width: "auto", marginLeft: 16, height: "calc(1.5em + .5rem)", marginBottom: 4 }}
                        defaultValue={answerItem.info ?? ''}
                        ref={c => {
                          if (c && self.props.mutable) {
                            self.infos[`child_ref_${option.key}_info`] = c;
                          }
                        }}
                      />
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

class RadioButtons extends React.Component {
  constructor(props) {
    super(props);
    this.options = {};
    this.infos = {};
    this.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue,
    };
  }

  static getDerivedStateFromProps(props, state) {
    console.log('RadioButtons getDerivedStateFromProps')
    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log('RadioButtons default prop changed', state.defaultValue, props.defaultValue)
      return {
        defaultValue: props.defaultValue,
        value: props.defaultValue 
      }
    }
    return state;
  }

  getActiveValue = (values, key) => {
    return values?.find(item => item.key === key)
  }
  
  render() {
    const self = this;
    let classNames = 'custom-control custom-radio';
    if (this.props.data.inline) { classNames += ' option-inline'; }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel className="form-label" {...this.props} />
          {
            this.props.data.options.map((option) => {
              const this_key = `preview_${option.key}`;
              const props = {};
              props.name = self.props.data.field_name;

              props.type = 'radio';
              props.value = option.value;

              const answerItem = self.getActiveValue(self.state.value, option.key)

              if (self.props.mutable) {
                props.checked = answerItem?.value ?? false;
              }
              if (this.props.read_only) {
                props.disabled = 'disabled';
              }

              console.log('Radio =>> ', props);

              return (
                <div className={classNames} key={this_key} style={{ display: "flex", alignItems: "center" }}>
                  <input 
                    id={"fid_" + this_key} 
                    className="custom-control-input" 
                    ref={c => {
                      if (c && self.props.mutable) {
                        self.options[`child_ref_${option.key}`] = c;
                      }
                    }} 
                    onChange={() => {
                      self.setState((current) => { 
                        return {
                          ...current,
                          value: [{
                            key: option.key, value: true, info: ''
                          }]
                        };
                      })
                    }} 
                    {...props} 
                  />
                  <label className="custom-control-label" htmlFor={"fid_" + this_key}>{option.text}</label>
                  {
                    props.checked && option.info &&
                     <input 
                      id={"fid_" + this_key + "_info"} 
                      type="text" class="form-control" 
                      style={{ width: "auto", marginLeft: 16, height: "calc(1.5em + .5rem)" }} 
                      defaultValue={answerItem.info ?? ''}
                      ref={c => {
                        if (c && self.props.mutable) {
                          self.infos[`child_ref_${option.key}_info`] = c;
                        }
                      }}
                    />
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

const Image = (props) => {
  const style = (props.data.center) ? { textAlign: 'center' } : null;

  let baseClasses = 'SortableItem rfb-item';
  if (props.data.pageBreakBefore) { 
    baseClasses += ' alwaysbreak'; 
  }

  return (
    <div 
      className={baseClasses} 
      style={style}
    >
      <ComponentHeader {...props} />
      {
        props.data.src &&
        <img 
          src={props.data.src} 
          width={props.data.width} 
          height={props.data.height} 
        />
      }
      {
        !props.data.src &&
        <div className="no-image">No Image</div>
      }
    </div>
  )
}

class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.name = this.props.data.field_name;
    props.ratingAmount = 5;

    if (this.props.mutable) {
      props.rating = (this.props.defaultValue !== undefined) ? parseFloat(this.props.defaultValue, 10) : 0;
      props.editing = true;
      props.disabled = this.props.read_only;
      props.ref = this.inputField;
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <StarRating {...props} />
        </div>
      </div>
    );
  }
}

class HyperLink extends React.Component {
  render() {
    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <a target="_blank" href={this.props.data.href}>{this.props.data.content}</a>
        </div>
      </div>
    );
  }
}

class Download extends React.Component {
  render() {
    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <a href={`${this.props.download_path}?id=${this.props.data.file_path}`}>{this.props.data.content}</a>
        </div>
      </div>
    );
  }
}

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = { img: null };
  }

  displayImage = (e) => {
    const self = this;
    const target = e.target;
    let file; let
      reader;

    if (target.files && target.files.length) {
      file = target.files[0];
      // eslint-disable-next-line no-undef
      reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        self.setState({
          img: reader.result,
        });
      };
    }
  };

  clearImage = () => {
    this.setState({
      img: null,
    });
  };

  render() {
    let baseClasses = 'SortableItem rfb-item';
    const name = this.props.data.field_name;
    const fileInputStyle = this.state.img ? { display: 'none' } : null;
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }
    let sourceDataURL;
    if (this.props.read_only === true && this.props.defaultValue && this.props.defaultValue.length > 0) {
      if (this.props.defaultValue.indexOf(name > -1)) {
        sourceDataURL = this.props.defaultValue;
      } else {
        sourceDataURL = `data:image/png;base64,${this.props.defaultValue}`;
      }
    }
    console.log('sourceDataURL', sourceDataURL);
    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          {this.props.read_only === true && this.props.defaultValue && this.props.defaultValue.length > 0
            ? (<div><img src={sourceDataURL} /></div>)
            : (<div className="image-upload-container">

              <div style={fileInputStyle}>
                <input name={name} type="file" accept="image/*" capture="camera" className="image-upload" onChange={this.displayImage} />
                <div className="image-upload-control">
                  <div className="btn btn-default"><i className="fas fa-camera"></i> Upload Photo</div>
                  <p>Select an image from your computer or device.</p>
                </div>
              </div>

              {this.state.img &&
                <div>
                  <img src={this.state.img} height="100" className="image-upload-preview" /><br />
                  <div className="btn btn-image-clear" onClick={this.clearImage}>
                    <i className="fas fa-times"></i> Clear Photo
                  </div>
                </div>
              }
            </div>)
          }
        </div>
      </div>
    );
  }
}

class Range extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = {
      value: props.defaultValue !== undefined ? parseInt(props.defaultValue, 10) : parseInt(props.data.default_value, 10),
    };
  }

  changeValue = (e) => {
    const { target } = e;
    this.setState({
      value: target.value,
    });
  }

  render() {
    const props = {};
    const name = this.props.data.field_name;

    props.type = 'range';
    props.list = `tickmarks_${name}`;
    props.min = this.props.data.min_value;
    props.max = this.props.data.max_value;
    props.step = this.props.data.step;

    props.value = this.state.value;
    props.change = this.changeValue;

    if (this.props.mutable) {
      props.ref = this.inputField;
    }

    const datalist = [];
    for (let i = parseInt(props.min_value, 10); i <= parseInt(props.max_value, 10); i += parseInt(props.step, 10)) {
      datalist.push(i);
    }

    const oneBig = 100 / (datalist.length - 1);

    const _datalist = datalist.map((d, idx) => <option key={`${props.list}_${idx}`}>{d}</option>);

    const visible_marks = datalist.map((d, idx) => {
      const option_props = {};
      let w = oneBig;
      if (idx === 0 || idx === datalist.length - 1) { w = oneBig / 2; }
      option_props.key = `${props.list}_label_${idx}`;
      option_props.style = { width: `${w}%` };
      if (idx === datalist.length - 1) { option_props.style = { width: `${w}%`, textAlign: 'right' }; }
      return <label {...option_props}>{d}</label>;
    });

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <div className="range">
            <div className="clearfix">
              <span className="float-left">{this.props.data.min_label}</span>
              <span className="float-right">{this.props.data.max_label}</span>
            </div>
            <ReactBootstrapSlider {...props} />
          </div>
          <div className="visible_marks">
            {visible_marks}
          </div>
          <input name={name} value={this.state.value} type="hidden" />
          <datalist id={props.list}>
            {_datalist}
          </datalist>
        </div>
      </div>
    );
  }
}


FormElements.Header = Header;
FormElements.HeaderBar = HeaderBar;
FormElements.Paragraph = Paragraph;
FormElements.Label = Label;
FormElements.LineBreak = LineBreak;
FormElements.TextInput = TextInput;
FormElements.NumberInput = NumberInput;
FormElements.TextArea = TextArea;
FormElements.Dropdown = Dropdown;
FormElements.Signature = Signature;
FormElements.Checkboxes = Checkboxes;
FormElements.DatePicker = DatePicker;
FormElements.RadioButtons = RadioButtons;
FormElements.Image = Image;
FormElements.Rating = Rating;
FormElements.Tags = Tags;
FormElements.HyperLink = HyperLink;
FormElements.Download = Download;
FormElements.Camera = Camera;
FormElements.Range = Range;
FormElements.Table = Table;
FormElements.Section = Section;
FormElements.Signature2 = Signature2;
FormElements.DataSource = DataSource;
export default FormElements;
