// eslint-disable-next-line max-classes-per-file
import React, { useState, useEffect, useRef, forwardRef } from "react";
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
import { useFormContext, FORM_ACTION } from "../context/form-context";
import DebouncedInput from "../hook/textInput";

const FormElements = {};

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

const TextInput = forwardRef((props, ref) => {
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
    inputProps.ref = ref;
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
});

const NumberInput = forwardRef((props, ref) => {
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
    inputProps.ref = ref;
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
});

const TextArea = forwardRef((props, ref) => {
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
    inputProps.ref = ref;
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
});

const Dropdown = forwardRef((props, ref) => {
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
          ref={ref}
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
});

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
      this.setState({ defaultValue: "" });
    } else if (this.canvas.current) {
      this.canvas.current.clear();
    }
  };

  render() {
    const userProperties =
      this.props.getActiveUserProperties &&
      this.props.getActiveUserProperties();

    const savedEditor = this.props.editor;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId;
    }

    const { defaultValue } = this.state;
    let canClear = !!defaultValue;
    const props = {};
    props.type = "hidden";
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
      canClear = !this.props.read_only || isSameEditor;
    }

    if (this.props.read_only || !isSameEditor) {
      props.disabled = "disabled";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    let sourceDataURL;
    if (defaultValue && defaultValue.length > 0) {
      sourceDataURL = `data:image/png;base64,${defaultValue}`;
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
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
    );
  }
}

const Tags = forwardRef((props, ref) => {
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
    selectProps.ref = ref;
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
});

const Checkboxes = forwardRef((props, ref) => {
  const { dispatch } = useFormContext();

  const [value, setValue] = useState(props.defaultValue);

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
      let newVal;
      setValue((current) => {
        const activeVal = getActiveValue(current, option.key);
        const newActiveVal = activeVal
          ? {
              ...activeVal,
              value: !activeVal.value,
              info: activeVal.value ? "" : activeVal.info,
            }
          : {
              key: option.key,
              value: true,
              info: "",
            };

        newVal = {
          ...(current || {}),
          value: [
            ...((current && current.value) || []).filter(
              (item) => item.key !== option.key
            ),
            newActiveVal,
          ],
        };

        dispatch({
          type: FORM_ACTION.UPDATE_VALUE,
          name: props.data.field_name,
          value: newVal,
        });

        return newVal;
      });
    }
  };

  const handleInputChange = (option, valueInfo) => {
    if (!isSameEditor) {
      return;
    }

    let newVal;

    setValue((current) => {
      const activeVal = getActiveValue(current, option.key);
      const newActiveVal = activeVal
        ? { ...activeVal, info: valueInfo }
        : {
            key: option.key,
            value: true,
            info: valueInfo,
          };

      newVal = {
        ...(current || {}),
        value: [
          ...((current && current.value) || []).filter(
            (item) => item.key !== option.key
          ),
          newActiveVal,
        ],
      };

      dispatch({
        type: FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: newVal,
      });

      return newVal;
    });
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
                <DebouncedInput
                  id={"fid_" + this_key + "_info"}
                  style={{
                    width: "auto",
                    marginLeft: 16,
                    height: "calc(1.5em + .5rem)",
                    marginBottom: 4,
                  }}
                  onChange={(value) => {
                    handleInputChange(option, value);
                  }}
                  value={answerItem.info ?? ""}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

function RadioButtons(props) {
  const { dispatch } = useFormContext();

  const [value, setValue] = useState(props.defaultValue);

  const getActiveValue = (values, key) => {
    return (values || {}).key === key ? values : null;
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

  const handleChange = (option) => {
    if (!isSameEditor) {
      return;
    }
    setValue((current) => {
      const activeVal = getActiveValue(current, option.key);
      const newActiveVal = {
        key: option.key,
        value: true,
        info: activeVal?.value ? activeVal.info : "",
      };

      dispatch({
        type: FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: { value: [newActiveVal] },
      });

      return newActiveVal;
    });
  };

  const handleInputChange = (option, valueInfo) => {
    if (!isSameEditor) {
      return;
    }
    setValue(() => {
      const newActiveVal = {
        key: option.key,
        value: true,
        info: valueInfo,
      };

      dispatch({
        type: FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: { value: [newActiveVal] },
      });

      return newActiveVal;
    });
  };

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
                <DebouncedInput
                  id={"fid_" + this_key + "_info"}
                  style={{
                    width: "auto",
                    marginLeft: 16,
                    height: "calc(1.5em + .5rem)",
                  }}
                  onChange={(value) => {
                    handleInputChange(option, value);
                  }}
                  value={answerItem.info ?? ""}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Image = forwardRef((props, ref) => {
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
          // ref={ref}
          style={{ maxWidth: "100%", height: "auto" }}
          src={props.data.src}
          width={props.data.width}
          height={props.data.height}
        />
      )}
      {!props.data.src && <div className="no-image">No Image</div>}
    </div>
  );
});

const Rating = forwardRef((props, ref) => {
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
    ratingProps.ref = ref;
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
});

const HyperLink = forwardRef((props, ref) => {
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
});

class Download extends React.Component {
  render() {
    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <a
            href={`${this.props.download_path}?id=${this.props.data.file_path}`}
          >
            {this.props.data.content}
          </a>
        </div>
      </div>
    );
  }
}

const Camera = forwardRef((props, ref) => {
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
            <img src={sourceDataURL} ref={ref} />
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
                <img
                  src={img}
                  height="100"
                  className="image-upload-preview"
                  ref={ref}
                />
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
});

const Range = forwardRef((props, ref) => {
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
    change: changeValue,
  };

  // if (props.mutable) {
  //   rangeProps.ref = ref;
  // }

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
        <input name={name} value={value} type="hidden" ref={ref} />
        <datalist id={rangeProps.list}>{_datalist}</datalist>
      </div>
    </div>
  );
});

FormElements.Header = Header; // migrated, no value
FormElements.HeaderBar = HeaderBar; // migrated, no value
FormElements.Paragraph = Paragraph; // migrated, no value
FormElements.Label = Label; // migrated, no value
FormElements.LineBreak = LineBreak; // migrated, no value
FormElements.Image = Image; // migrated, no value
FormElements.HyperLink = HyperLink; // migrated, no value
FormElements.Section = Section; // migrated, no value

FormElements.TextInput = TextInput; // migrated, value done
FormElements.NumberInput = NumberInput; // migrated, value done
FormElements.TextArea = TextArea; // migrated, value done
FormElements.Dropdown = Dropdown; // migrated, value done
FormElements.DatePicker = DatePicker; // migrated, value done
FormElements.Tags = Tags; // migrated, value done
FormElements.Camera = Camera; // migrated, value done
FormElements.Range = Range; // migrated, value done
FormElements.FileUpload = FileUpload; // migrated, value done
FormElements.Checkboxes = Checkboxes; // migrated, value done
FormElements.RadioButtons = RadioButtons; // migrated, value done
FormElements.Signature2 = Signature2; // migrated, value done

FormElements.DataSource = DataSource; // not migrated yet, value failed
FormElements.ImageUpload = ImageUpload; // not migrated yet, value failed

FormElements.Download = Download; // =======>>> not migrate
FormElements.Rating = Rating; //  =======>>> not migrate
FormElements.Table = Table; // =======>>> not migrate
FormElements.Signature = Signature; // =======>>> not migrate, no used

export default FormElements;
