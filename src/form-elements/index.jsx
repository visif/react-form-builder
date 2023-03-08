// eslint-disable-next-line max-classes-per-file
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import SignaturePad from "react-signature-canvas";
import ReactBootstrapSlider from "react-bootstrap-slider";
import TextAreaAutosize from "react-textarea-autosize";
import StarRating from "./star-rating";
import HeaderBar from "./header-bar";
import DatePicker from "./date-picker";
import Table from "./table";
import ComponentHeader from "./component-header";
import ComponentLabel from "./component-label";
import myxss from "./myxss";
import Section from "./section";
import Signature2 from "./signature2";
import FileUpload from "./fileUpload2";
import DataSource from "./datasource";
import ImageUpload from "./imageUpload";

const FormElements = {};

// class Header extends React.Component {
//   render() {
//     // const headerClasses = `dynamic-input ${this.props.data.element}-input`;
//     let classNames = "static";
//     if (this.props.data.bold) {
//       classNames += " bold";
//     }
//     if (this.props.data.italic) {
//       classNames += " italic";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <h3
//           className={classNames}
//           dangerouslySetInnerHTML={{
//             __html: myxss.process(this.props.data.content),
//           }}
//         />
//       </div>
//     );
//   }
// }

function Header(props) {
  let classNames = "static";
  if (props.data.bold) {
    classNames += " bold";
  }
  if (props.data.italic) {
    classNames += " italic";
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <h3
        className={classNames}
        dangerouslySetInnerHTML={{
          __html: myxss.process(props.data.content),
        }}
      />
    </div>
  );
}

// class Paragraph extends React.Component {
//   render() {
//     let classNames = "static";
//     if (this.props.data.bold) {
//       classNames += " bold";
//     }
//     if (this.props.data.italic) {
//       classNames += " italic";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <p
//           className={classNames}
//           dangerouslySetInnerHTML={{
//             __html: myxss.process(this.props.data.content),
//           }}
//         />
//       </div>
//     );
//   }
// }

function Paragraph(props) {
  let classNames = "static";
  if (props.data.bold) {
    classNames += " bold";
  }
  if (props.data.italic) {
    classNames += " italic";
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <p
        className={classNames}
        dangerouslySetInnerHTML={{
          __html: myxss.process(props.data.content),
        }}
      />
    </div>
  );
}

// class Label extends React.Component {
//   render() {
//     let classNames = "static";
//     if (this.props.data.bold) {
//       classNames += " bold";
//     }
//     if (this.props.data.italic) {
//       classNames += " italic";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <label
//           className={classNames}
//           dangerouslySetInnerHTML={{
//             __html: myxss.process(this.props.data.content),
//           }}
//         />
//       </div>
//     );
//   }
// }

function Label(props) {
  const classNames =
    "static" +
    (props.data.bold ? " bold" : "") +
    (props.data.italic ? " italic" : "");
  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <label
        className={classNames}
        dangerouslySetInnerHTML={{
          __html: myxss.process(props.data.content),
        }}
      />
    </div>
  );
}

// class LineBreak extends React.Component {
//   render() {
//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <hr />
//       </div>
//     );
//   }
// }

function LineBreak(props) {
  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <hr />
    </div>
  );
}

// class TextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//   }

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.type = "text";
//     props.className = "form-control";
//     props.name = this.props.data.field_name;
//     if (this.props.mutable) {
//       props.defaultValue = this.props.defaultValue;
//       props.ref = this.inputField;
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     if (this.props.read_only || !isSameEditor) {
//       props.disabled = "disabled";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <input {...props} />
//         </div>
//       </div>
//     );
//   }
// }

function TextInput(props) {
  const inputField = useRef(null);

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  const inputProps = {
    type: "text",
    className: "form-control",
    name: props.data.field_name,
  };
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = inputField;
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  if (props.read_only || !isSameEditor) {
    inputProps.disabled = "disabled";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        <input {...inputProps} />
      </div>
    </div>
  );
}

// class NumberInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//   }

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.type = "number";
//     props.className = "form-control";
//     props.name = this.props.data.field_name;

//     if (this.props.mutable) {
//       props.defaultValue = this.props.defaultValue;
//       props.ref = this.inputField;
//     }

//     //if (this.props.read_only) {
//     //  props.disabled = "disabled";
//     //}

//     if (this.props.read_only || !isSameEditor) {
//       props.disabled = "disabled";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <input {...props} />
//         </div>
//       </div>
//     );
//   }
// }

function NumberInput(props) {
  const inputField = useRef(null);

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  const inputProps = {
    type: "number",
    className: "form-control",
    name: props.data.field_name,
  };
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = inputField;
  }

  if (props.read_only || !isSameEditor) {
    inputProps.disabled = "disabled";
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        <input {...inputProps} />
      </div>
    </div>
  );
}

// class TextArea extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//   }
//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.className = "form-control";
//     props.name = this.props.data.field_name;

//     if (this.props.read_only || !isSameEditor) {
//       props.disabled = "disabled";
//     }

//     if (this.props.mutable) {
//       props.defaultValue = this.props.defaultValue;
//       props.ref = this.inputField;
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <TextAreaAutosize {...props} />
//         </div>
//       </div>
//     );
//   }
// }

function TextArea(props) {
  const inputField = useRef(null);

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  const inputProps = {};
  inputProps.className = "form-control";
  inputProps.name = props.data.field_name;

  if (props.read_only || !isSameEditor) {
    inputProps.disabled = "disabled";
  }

  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = inputField;
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        <TextAreaAutosize {...inputProps} />
      </div>
    </div>
  );
}

// class Dropdown extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();

//     this.state = {
//       defaultValue: props.defaultValue,
//       value: props.defaultValue,
//     };
//   }

//   static getDerivedStateFromProps(props, state) {
//     console.log("Dropdown getDerivedStateFromProps");
//     if (
//       JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)
//     ) {
//       console.log(
//         "Dropdown default prop changed",
//         state.defaultValue,
//         props.defaultValue
//       );
//       return {
//         defaultValue: props.defaultValue,
//         value: props.defaultValue,
//       };
//     }
//     return state;
//   }

//   handleChange = (e) => {
//     this.setState({ value: e.target.value });
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.className = "form-control";
//     props.name = this.props.data.field_name;
//     props.value = this.state.value;
//     props.onChange = this.handleChange;

//     if (this.props.mutable) {
//       props.defaultValue = this.state.value;
//       props.ref = this.inputField;
//     }

//     if (this.props.read_only || !isSameEditor) {
//       props.disabled = "disabled";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <select {...props}>
//             <option value="" key="default-0">
//               Please Select
//             </option>
//             {this.props.data.options.map((option) => {
//               const this_key = `preview_${option.key}`;
//               return (
//                 <option value={option.value} key={this_key}>
//                   {option.text}
//                 </option>
//               );
//             })}
//           </select>
//         </div>
//       </div>
//     );
//   }
// }

function Dropdown(props) {
  const inputField = useRef(null);

  const [defaultValue, setDefaultValue] = useState(props.defaultValue);
  const [value, setValue] = useState(props.defaultValue);

  useEffect(() => {
    console.log("Dropdown getDerivedStateFromProps");
    if (JSON.stringify(defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log(
        "Dropdown default prop changed",
        defaultValue,
        props.defaultValue
      );
      setDefaultValue(props.defaultValue);
      setValue(props.defaultValue);
    }
  }, [defaultValue, props.defaultValue]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  const baseClasses =
    "SortableItem rfb-item" +
    (props.data.pageBreakBefore ? " alwaysbreak" : "");

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        <select
          className="form-control"
          name={props.data.field_name}
          value={value}
          onChange={handleChange}
          defaultValue={value}
          ref={inputField}
          disabled={props.read_only || !isSameEditor}
        >
          <option value="" key="default-0">
            Please Select
          </option>
          {props.data.options.map((option) => {
            const this_key = `preview_${option.key}`;
            return (
              <option value={option.value} key={this_key}>
                {option.text}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

// class Signature extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       defaultValue: props.defaultValue,
//     };
//     this.inputField = React.createRef();
//     this.canvas = React.createRef();
//   }

//   clear = () => {
//     if (this.state.defaultValue) {
//       this.setState({ defaultValue: "" });
//     } else if (this.canvas.current) {
//       this.canvas.current.clear();
//     }
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const { defaultValue } = this.state;
//     let canClear = !!defaultValue;
//     const props = {};
//     props.type = "hidden";
//     props.name = this.props.data.field_name;

//     if (this.props.mutable) {
//       props.defaultValue = defaultValue;
//       props.ref = this.inputField;
//     }
//     const pad_props = {};
//     // umd requires canvasProps={{ width: 400, height: 150 }}
//     if (this.props.mutable) {
//       pad_props.defaultValue = defaultValue;
//       pad_props.ref = this.canvas;
//       canClear = !this.props.read_only || isSameEditor;
//     }

//     if (this.props.read_only || !isSameEditor) {
//       props.disabled = "disabled";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     let sourceDataURL;
//     if (defaultValue && defaultValue.length > 0) {
//       sourceDataURL = `data:image/png;base64,${defaultValue}`;
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           {this.props.read_only === true || !isSameEditor || !!sourceDataURL ? (
//             <img src={sourceDataURL} />
//           ) : (
//             <SignaturePad {...pad_props} />
//           )}
//           {canClear && (
//             <i
//               className="fas fa-times clear-signature"
//               onClick={this.clear}
//               title="Clear Signature"
//             ></i>
//           )}
//           <input {...props} />
//         </div>
//       </div>
//     );
//   }
// }

function Signature(props) {
  const [defaultValue, setDefaultValue] = useState(props.defaultValue);
  const inputField = useRef();
  const canvas = useRef();

  const clear = () => {
    if (defaultValue) {
      setDefaultValue("");
    } else if (canvas.current) {
      canvas.current.clear();
    }
  };

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  let canClear = !!defaultValue;
  const inputProps = {};
  inputProps.type = "hidden";
  inputProps.name = props.data.field_name;

  if (props.mutable) {
    inputProps.defaultValue = defaultValue;
    inputProps.ref = inputField;
  }

  const padProps = {};
  if (props.mutable) {
    padProps.defaultValue = defaultValue;
    padProps.ref = canvas;
    canClear = !props.read_only || isSameEditor;
  }

  if (props.read_only || !isSameEditor) {
    inputProps.disabled = "disabled";
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  let sourceDataURL;
  if (defaultValue && defaultValue.length > 0) {
    sourceDataURL = `data:image/png;base64,${defaultValue}`;
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        {props.read_only === true || !isSameEditor || !!sourceDataURL ? (
          <img src={sourceDataURL} />
        ) : (
          <SignaturePad {...padProps} />
        )}
        {canClear && (
          <i
            className="fas fa-times clear-signature"
            onClick={clear}
            title="Clear Signature"
          ></i>
        )}
        <input {...inputProps} />
      </div>
    </div>
  );
}

// class Tags extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//     const { defaultValue, data } = props;
//     this.state = { value: this.getDefaultValue(defaultValue, data.options) };
//   }

//   getDefaultValue(defaultValue, options) {
//     if (defaultValue) {
//       if (typeof defaultValue === "string") {
//         const vals = defaultValue.split(",").map((x) => x.trim());
//         return options.filter((x) => vals.indexOf(x.value) > -1);
//       }
//       return options.filter((x) => defaultValue.indexOf(x.value) > -1);
//     }
//     return [];
//   }

//   // state = { value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(',') : [] };

//   handleChange = (e) => {
//     this.setState({ value: e || [] });
//   };

//   render() {
//     const options = this.props.data.options.map((option) => {
//       option.label = option.text;
//       return option;
//     });
//     const props = {};
//     props.isMulti = true;
//     props.name = this.props.data.field_name;
//     props.onChange = this.handleChange;

//     props.options = options;
//     if (!this.props.mutable) {
//       props.value = options[0].text;
//     } // to show a sample of what tags looks like
//     if (this.props.mutable) {
//       //props.isDisabled = this.props.read_only;
//       props.isDisabled = this.props.read_only || !isSameEditor ? true : false;
//       props.value = this.state.value;
//       props.ref = this.inputField;
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <Select {...props} />
//         </div>
//       </div>
//     );
//   }
// }

const Tags = (props) => {
  const inputField = useRef(null);
  const [value, setValue] = useState(
    getDefaultValue(props.defaultValue, props.data.options)
  );

  function getDefaultValue(defaultValue, options) {
    if (defaultValue) {
      if (typeof defaultValue === "string") {
        const vals = defaultValue.split(",").map((x) => x.trim());
        return options.filter((x) => vals.indexOf(x.value) > -1);
      }
      return options.filter((x) => defaultValue.indexOf(x.value) > -1);
    }
    return [];
  }

  const handleChange = (e) => {
    setValue(e || []);
  };

  const options = props.data.options.map((option) => {
    option.label = option.text;
    return option;
  });

  const selectProps = {
    isMulti: true,
    name: props.data.field_name,
    onChange: handleChange,
    options: options,
    value: value,
  };

  if (!props.mutable) {
    selectProps.value = options[0].text;
  }

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();
  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  if (props.mutable) {
    selectProps.isDisabled = props.read_only || !isSameEditor ? true : false;
    selectProps.value = value;
    selectProps.ref = inputField;
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        <Select {...selectProps} />
      </div>
    </div>
  );
};

// class Checkboxes extends React.Component {
//   constructor(props) {
//     super(props);
//     this.options = {};
//     this.infos = {};
//     this.state = {
//       defaultValue: props.defaultValue,
//       value: props.defaultValue,
//     };
//   }

//   static getDerivedStateFromProps(props, state) {
//     console.log("Checkboxes getDerivedStateFromProps");
//     if (
//       JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)
//     ) {
//       console.log(
//         "Checkboxes default prop changed",
//         state.defaultValue,
//         props.defaultValue
//       );
//       return {
//         defaultValue: props.defaultValue,
//         value: props.defaultValue,
//       };
//     }
//     return state;
//   }

//   getActiveValue = (values, key) => {
//     return values?.find((item) => item.key === key);
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const self = this;
//     let classNames = "custom-control custom-checkbox";
//     if (this.props.data.inline) {
//       classNames += " option-inline";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel className="form-label" {...this.props} />
//           {this.props.data.options.map((option) => {
//             const this_key = `preview_${option.key}`;

//             const props = {};
//             props.name = `option_${option.key}`;
//             props.type = "checkbox";
//             props.value = option.value;

//             const answerItem = self.getActiveValue(
//               self.state.value,
//               option.key
//             );

//             if (self.props.mutable) {
//               props.checked = answerItem?.value ?? false;
//             }

//             //if (this.props.read_only) {
//             //  props.disabled = "disabled";
//             //}

//             if (this.props.read_only || !isSameEditor) {
//               props.disabled = "disabled";
//             }

//             console.log("Checkbox =>> ", props);

//             return (
//               <div
//                 className={classNames}
//                 key={this_key}
//                 style={{ display: "flex", alignItems: "center" }}
//               >
//                 <input
//                   id={"fid_" + this_key}
//                   className="custom-control-input"
//                   ref={(c) => {
//                     if (c && self.props.mutable) {
//                       self.options[`child_ref_${option.key}`] = c;
//                     }
//                   }}
//                   onChange={() => {
//                     if (isSameEditor) {
//                       self.setState((current) => {
//                         const activeVal = self.getActiveValue(
//                           current && current.value,
//                           option.key
//                         );
//                         const newActiveVal = activeVal
//                           ? { ...activeVal, value: !activeVal.value }
//                           : {
//                               key: option.key,
//                               value: true,
//                               info: "",
//                             };

//                         if (!current) {
//                           return current;
//                         }

//                         return {
//                           ...current,
//                           value: [
//                             ...(current.value || []).filter(
//                               (item) => item.key !== option.key
//                             ),
//                             newActiveVal,
//                           ],
//                         };
//                       });
//                     }
//                   }}
//                   {...props}
//                 />
//                 <label
//                   className="custom-control-label"
//                   htmlFor={"fid_" + this_key}
//                 >
//                   {option.text}
//                 </label>
//                 {props.checked && option.info && (
//                   <input
//                     id={"fid_" + this_key + "_info"}
//                     type="text"
//                     class="form-control"
//                     style={{
//                       width: "auto",
//                       marginLeft: 16,
//                       height: "calc(1.5em + .5rem)",
//                       marginBottom: 4,
//                     }}
//                     defaultValue={answerItem.info ?? ""}
//                     ref={(c) => {
//                       if (c && self.props.mutable) {
//                         self.infos[`child_ref_${option.key}_info`] = c;
//                       }
//                     }}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// }

function Checkboxes(props) {
  const [defaultValue, setDefaultValue] = useState(props.defaultValue);
  const [value, setValue] = useState(props.defaultValue);

  const options = {};
  const infos = {};

  const getActiveValue = (values, key) => {
    return values?.value?.find((item) => item.key === key);
  };

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  let classNames = "custom-control custom-checkbox";
  if (props.data.inline) {
    classNames += " option-inline";
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  const handleChange = (option) => {
    if (isSameEditor) {
      setValue((current) => {
        const activeVal = getActiveValue(current && current.value, option.key);
        const newActiveVal = activeVal
          ? { ...activeVal, value: !activeVal.value }
          : {
              key: option.key,
              value: true,
              info: "",
            };

        if (!current) {
          return current;
        }

        return {
          ...current,
          value: [
            ...(current.value || []).filter((item) => item.key !== option.key),
            newActiveVal,
          ],
        };
      });
    }
  };

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel className="form-label" {...props} />
        {props.data.options.map((option) => {
          const this_key = `preview_${option.key}`;

          const inputProps = {
            name: `option_${option.key}`,
            type: "checkbox",
            value: option.value,
          };

          const answerItem = getActiveValue(value, option.key);

          if (props.mutable) {
            inputProps.checked = answerItem?.value ?? false;
          }

          if (props.read_only || !isSameEditor) {
            inputProps.disabled = "disabled";
          }

          return (
            <div
              className={classNames}
              key={this_key}
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                id={"fid_" + this_key}
                className="custom-control-input"
                ref={(c) => {
                  if (c && props.mutable) {
                    options[`child_ref_${option.key}`] = c;
                  }
                }}
                onChange={() => handleChange(option)}
                {...inputProps}
              />
              <label
                className="custom-control-label"
                htmlFor={"fid_" + this_key}
              >
                {option.text}
              </label>
              {inputProps.checked && option.info && (
                <input
                  id={"fid_" + this_key + "_info"}
                  type="text"
                  className="form-control"
                  style={{
                    width: "auto",
                    marginLeft: 16,
                    height: "calc(1.5em + .5rem)",
                    marginBottom: 4,
                  }}
                  defaultValue={answerItem.info ?? ""}
                  ref={(c) => {
                    if (c && props.mutable) {
                      infos[`child_ref_${option.key}_info`] = c;
                    }
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// class RadioButtons extends React.Component {
//   constructor(props) {
//     super(props);
//     this.options = {};
//     this.infos = {};
//     this.state = {
//       defaultValue: props.defaultValue,
//       value: props.defaultValue,
//     };
//   }

//   static getDerivedStateFromProps(props, state) {
//     console.log("RadioButtons getDerivedStateFromProps");
//     if (
//       JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)
//     ) {
//       console.log(
//         "RadioButtons default prop changed",
//         state.defaultValue,
//         props.defaultValue
//       );
//       return {
//         defaultValue: props.defaultValue,
//         value: props.defaultValue,
//       };
//     }
//     return state;
//   }

//   getActiveValue = (values, key) => {
//     return values?.find((item) => item.key === key);
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const self = this;
//     let classNames = "custom-control custom-radio";
//     if (this.props.data.inline) {
//       classNames += " option-inline";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel className="form-label" {...this.props} />
//           {this.props.data.options.map((option) => {
//             const this_key = `preview_${option.key}`;
//             const props = {};
//             props.name = self.props.data.field_name;

//             props.type = "radio";
//             props.value = option.value;

//             const answerItem = self.getActiveValue(
//               self.state.value,
//               option.key
//             );

//             if (self.props.mutable) {
//               props.checked = answerItem?.value ?? false;
//             }
//             //if (this.props.read_only) {
//             //  props.disabled = "disabled";
//             //}
//             if (this.props.read_only || !isSameEditor) {
//               props.disabled = "disabled";
//             }

//             console.log("Radio =>> ", props);

//             return (
//               <div
//                 className={classNames}
//                 key={this_key}
//                 style={{ display: "flex", alignItems: "center" }}
//               >
//                 <input
//                   id={"fid_" + this_key}
//                   className="custom-control-input"
//                   ref={(c) => {
//                     if (c && self.props.mutable) {
//                       self.options[`child_ref_${option.key}`] = c;
//                     }
//                   }}
//                   onChange={() => {
//                     self.setState((current) => {
//                       return {
//                         ...current,
//                         value: [
//                           {
//                             key: option.key,
//                             value: true,
//                             info: "",
//                           },
//                         ],
//                       };
//                     });
//                   }}
//                   {...props}
//                 />
//                 <label
//                   className="custom-control-label"
//                   htmlFor={"fid_" + this_key}
//                 >
//                   {option.text}
//                 </label>
//                 {props.checked && option.info && (
//                   <input
//                     id={"fid_" + this_key + "_info"}
//                     type="text"
//                     class="form-control"
//                     style={{
//                       width: "auto",
//                       marginLeft: 16,
//                       height: "calc(1.5em + .5rem)",
//                     }}
//                     defaultValue={answerItem.info ?? ""}
//                     ref={(c) => {
//                       if (c && self.props.mutable) {
//                         self.infos[`child_ref_${option.key}_info`] = c;
//                       }
//                     }}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// }

function RadioButtons(props) {
  const [defaultValue, setDefaultValue] = useState(props.defaultValue);
  const [value, setValue] = useState(props.defaultValue);
  const optionsRef = useRef({});
  const infosRef = useRef({});

  useEffect(() => {
    console.log("RadioButtons getDerivedStateFromProps");
    if (JSON.stringify(defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log(
        "RadioButtons default prop changed",
        defaultValue,
        props.defaultValue
      );
      setDefaultValue(props.defaultValue);
      setValue(props.defaultValue);
    }
  }, [defaultValue, props.defaultValue]);

  const getActiveValue = (values, key) => {
    return values?.find((item) => item.key === key);
  };

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  let classNames = "custom-control custom-radio";
  if (props.data.inline) {
    classNames += " option-inline";
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel className="form-label" {...props} />
        {props.data.options.map((option) => {
          const this_key = `preview_${option.key}`;
          const inputProps = {};
          inputProps.name = props.data.field_name;
          inputProps.type = "radio";
          inputProps.value = option.value;
          const answerItem = getActiveValue(value, option.key);

          if (props.mutable) {
            inputProps.checked = answerItem?.value ?? false;
          }
          if (props.read_only || !isSameEditor) {
            inputProps.disabled = "disabled";
          }

          return (
            <div
              className={classNames}
              key={this_key}
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                id={"fid_" + this_key}
                className="custom-control-input"
                ref={(c) => {
                  if (c && props.mutable) {
                    optionsRef.current[`child_ref_${option.key}`] = c;
                  }
                }}
                onChange={() => {
                  setValue([
                    {
                      key: option.key,
                      value: true,
                      info: "",
                    },
                  ]);
                }}
                {...inputProps}
              />
              <label
                className="custom-control-label"
                htmlFor={"fid_" + this_key}
              >
                {option.text}
              </label>
              {inputProps.checked && option.info && (
                <input
                  id={"fid_" + this_key + "_info"}
                  type="text"
                  class="form-control"
                  style={{
                    width: "auto",
                    marginLeft: 16,
                    height: "calc(1.5em + .5rem)",
                  }}
                  defaultValue={answerItem.info ?? ""}
                  ref={(c) => {
                    if (c && props.mutable) {
                      infosRef.current[`child_ref_${option.key}_info`] = c;
                    }
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// const Image = (props) => {
//   const style = props.data.center ? { textAlign: "center" } : null;

//   let baseClasses = "SortableItem rfb-item";
//   if (props.data.pageBreakBefore) {
//     baseClasses += " alwaysbreak";
//   }

//   return (
//     <div className={baseClasses} style={style}>
//       <ComponentHeader {...props} />
//       {props.data.src && (
//         <img
//           style={{ maxWidth: "100%", height: "auto" }}
//           src={props.data.src}
//           width={props.data.width}
//           height={props.data.height}
//         />
//       )}
//       {!props.data.src && <div className="no-image">No Image</div>}
//     </div>
//   );
// };

const Image = (props) => {
  const style = props.data.center ? { textAlign: "center" } : null;

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses} style={style}>
      <ComponentHeader {...props} />
      {props.data.src && (
        <img
          style={{ maxWidth: "100%", height: "auto" }}
          src={props.data.src}
          width={props.data.width}
          height={props.data.height}
        />
      )}
      {!props.data.src && <div className="no-image">No Image</div>}
    </div>
  );
};

// class Rating extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//   }

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.name = this.props.data.field_name;
//     props.ratingAmount = 5;

//     if (this.props.mutable) {
//       props.rating =
//         this.props.defaultValue !== undefined
//           ? parseFloat(this.props.defaultValue, 10)
//           : 0;
//       props.editing = true;
//       //props.disabled = this.props.read_only ||;
//       props.disabled = this.props.read_only || !isSameEditor ? true : false;
//       props.ref = this.inputField;
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <StarRating {...props} />
//         </div>
//       </div>
//     );
//   }
// }

const Rating = (props) => {
  const inputField = React.useRef(null);

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  const ratingProps = {};
  ratingProps.name = props.data.field_name;
  ratingProps.ratingAmount = 5;

  if (props.mutable) {
    ratingProps.rating =
      props.defaultValue !== undefined ? parseFloat(props.defaultValue, 10) : 0;
    ratingProps.editing = true;
    ratingProps.disabled = props.read_only || !isSameEditor ? true : false;
    ratingProps.ref = inputField;
  }

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        <StarRating {...ratingProps} />
      </div>
    </div>
  );
};

// class HyperLink extends React.Component {
//   render() {
//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <a target="_blank" href={this.props.data.href}>
//             {this.props.data.content}
//           </a>
//         </div>
//       </div>
//     );
//   }
// }

const HyperLink = (props) => {
  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <a target="_blank" href={props.data.href}>
          {props.data.content}
        </a>
      </div>
    </div>
  );
};

// class Download extends React.Component {
//   render() {
//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <a
//             href={`${this.props.download_path}?id=${this.props.data.file_path}`}
//           >
//             {this.props.data.content}
//           </a>
//         </div>
//       </div>
//     );
//   }
// }

function Download(props) {
  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <a href={`${props.download_path}?id=${props.data.file_path}`}>
          {props.data.content}
        </a>
      </div>
    </div>
  );
}

// class Camera extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { img: null };
//   }

//   displayImage = (e) => {
//     const self = this;
//     const target = e.target;
//     let file;
//     let reader;

//     if (target.files && target.files.length) {
//       file = target.files[0];
//       // eslint-disable-next-line no-undef
//       reader = new FileReader();
//       reader.readAsDataURL(file);

//       reader.onloadend = () => {
//         self.setState({
//           img: reader.result,
//         });
//       };
//     }
//   };

//   clearImage = () => {
//     this.setState({
//       img: null,
//     });
//   };

//   render() {
//     let baseClasses = "SortableItem rfb-item";
//     const name = this.props.data.field_name;
//     const fileInputStyle = this.state.img ? { display: "none" } : null;
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }
//     let sourceDataURL;
//     if (
//       this.props.read_only === true &&
//       this.props.defaultValue &&
//       this.props.defaultValue.length > 0
//     ) {
//       if (this.props.defaultValue.indexOf(name > -1)) {
//         sourceDataURL = this.props.defaultValue;
//       } else {
//         sourceDataURL = `data:image/png;base64,${this.props.defaultValue}`;
//       }
//     }
//     console.log("sourceDataURL", sourceDataURL);
//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           {this.props.read_only === true &&
//           this.props.defaultValue &&
//           this.props.defaultValue.length > 0 ? (
//             <div>
//               <img src={sourceDataURL} />
//             </div>
//           ) : (
//             <div className="image-upload-container">
//               <div style={fileInputStyle}>
//                 <input
//                   name={name}
//                   type="file"
//                   accept="image/*"
//                   capture="camera"
//                   className="image-upload"
//                   onChange={this.displayImage}
//                 />
//                 <div className="image-upload-control">
//                   <div className="btn btn-default">
//                     <i className="fas fa-camera"></i> Upload Photo
//                   </div>
//                   <p>Select an image from your computer or device.</p>
//                 </div>
//               </div>

//               {this.state.img && (
//                 <div>
//                   <img
//                     src={this.state.img}
//                     height="100"
//                     className="image-upload-preview"
//                   />
//                   <br />
//                   <div
//                     className="btn btn-image-clear"
//                     onClick={this.clearImage}
//                   >
//                     <i className="fas fa-times"></i> Clear Photo
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

function Camera(props) {
  const [img, setImg] = useState(null);

  function displayImage(e) {
    const target = e.target;
    let file;
    let reader;

    if (target.files && target.files.length) {
      file = target.files[0];
      reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setImg(reader.result);
      };
    }
  }

  function clearImage() {
    setImg(null);
  }

  let baseClasses = "SortableItem rfb-item";
  const name = props.data.field_name;
  const fileInputStyle = img ? { display: "none" } : null;
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  let sourceDataURL;
  if (
    props.read_only === true &&
    props.defaultValue &&
    props.defaultValue.length > 0
  ) {
    if (props.defaultValue.indexOf(name > -1)) {
      sourceDataURL = props.defaultValue;
    } else {
      sourceDataURL = `data:image/png;base64,${props.defaultValue}`;
    }
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        {props.read_only === true &&
        props.defaultValue &&
        props.defaultValue.length > 0 ? (
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
                onChange={displayImage}
              />
              <div className="image-upload-control">
                <div className="btn btn-default">
                  <i className="fas fa-camera"></i> Upload Photo
                </div>
                <p>Select an image from your computer or device.</p>
              </div>
            </div>

            {img && (
              <div>
                <img src={img} height="100" className="image-upload-preview" />
                <br />
                <div className="btn btn-image-clear" onClick={clearImage}>
                  <i className="fas fa-times"></i> Clear Photo
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// class Range extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//     this.state = {
//       value:
//         props.defaultValue !== undefined
//           ? parseInt(props.defaultValue, 10)
//           : parseInt(props.data.default_value, 10),
//     };
//   }

//   changeValue = (e) => {
//     const { target } = e;
//     this.setState({
//       value: target.value,
//     });
//   };

//   render() {
//     const props = {};
//     const name = this.props.data.field_name;

//     props.type = "range";
//     props.list = `tickmarks_${name}`;
//     props.min = this.props.data.min_value;
//     props.max = this.props.data.max_value;
//     props.step = this.props.data.step;

//     props.value = this.state.value;
//     props.change = this.changeValue;

//     if (this.props.mutable) {
//       props.ref = this.inputField;
//     }

//     const datalist = [];
//     for (
//       let i = parseInt(props.min_value, 10);
//       i <= parseInt(props.max_value, 10);
//       i += parseInt(props.step, 10)
//     ) {
//       datalist.push(i);
//     }

//     const oneBig = 100 / (datalist.length - 1);

//     const _datalist = datalist.map((d, idx) => (
//       <option key={`${props.list}_${idx}`}>{d}</option>
//     ));

//     const visible_marks = datalist.map((d, idx) => {
//       const option_props = {};
//       let w = oneBig;
//       if (idx === 0 || idx === datalist.length - 1) {
//         w = oneBig / 2;
//       }
//       option_props.key = `${props.list}_label_${idx}`;
//       option_props.style = { width: `${w}%` };
//       if (idx === datalist.length - 1) {
//         option_props.style = { width: `${w}%`, textAlign: "right" };
//       }
//       return <label {...option_props}>{d}</label>;
//     });

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <div className="range">
//             <div className="clearfix">
//               <span className="float-left">{this.props.data.min_label}</span>
//               <span className="float-right">{this.props.data.max_label}</span>
//             </div>
//             <ReactBootstrapSlider {...props} />
//           </div>
//           <div className="visible_marks">{visible_marks}</div>
//           <input name={name} value={this.state.value} type="hidden" />
//           <datalist id={props.list}>{_datalist}</datalist>
//         </div>
//       </div>
//     );
//   }
// }

function Range(props) {
  const inputField = useRef();
  const [value, setValue] = useState(
    props.defaultValue !== undefined
      ? parseInt(props.defaultValue, 10)
      : parseInt(props.data.default_value, 10)
  );

  const changeValue = (e) => {
    const { target } = e;
    setValue(target.value);
  };

  const name = props.data.field_name;
  const rangeProps = {
    type: "range",
    list: `tickmarks_${name}`,
    min: props.data.min_value,
    max: props.data.max_value,
    step: props.data.step,
    value: value,
    onChange: changeValue,
  };

  if (props.mutable) {
    rangeProps.ref = inputField;
  }

  const datalist = [];
  for (
    let i = parseInt(rangeProps.min_value, 10);
    i <= parseInt(rangeProps.max_value, 10);
    i += parseInt(rangeProps.step, 10)
  ) {
    datalist.push(i);
  }

  const oneBig = 100 / (datalist.length - 1);

  const _datalist = datalist.map((d, idx) => (
    <option key={`${rangeProps.list}_${idx}`}>{d}</option>
  ));

  const visible_marks = datalist.map((d, idx) => {
    const option_props = {};
    let w = oneBig;
    if (idx === 0 || idx === datalist.length - 1) {
      w = oneBig / 2;
    }
    option_props.key = `${rangeProps.list}_label_${idx}`;
    option_props.style = { width: `${w}%` };
    if (idx === datalist.length - 1) {
      option_props.style = { width: `${w}%`, textAlign: "right" };
    }
    return <label {...option_props}>{d}</label>;
  });

  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group">
        <ComponentLabel {...props} />
        <div className="range">
          <div className="clearfix">
            <span className="float-left">{props.data.min_label}</span>
            <span className="float-right">{props.data.max_label}</span>
          </div>
          <ReactBootstrapSlider {...rangeProps} />
        </div>
        <div className="visible_marks">{visible_marks}</div>
        <input name={name} value={value} type="hidden" />
        <datalist id={rangeProps.list}>{_datalist}</datalist>
      </div>
    </div>
  );
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
FormElements.FileUpload = FileUpload;
FormElements.ImageUpload = ImageUpload;
export default FormElements;
