import React from "react";
import { DatePicker as AntDatePicker } from "antd";
import dayjs from "dayjs";
import ComponentHeader from "./component-header";
import ComponentLabel from "./component-label";

const keyDateFormat = "setting_date_format";

const dateFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY", //"DD MMMM yyyy",
  "dd-MMM-yyyy": "DD-MMM-YYYY",
  "dd-MMM-yy": "DD-MMM-YY",
  "yyyy-MM-dd": "YYYY-MM-DD",
  "MM/dd/yyyy": "MM/DD/YYYY", //"MM/DD/yyyy",
  "dd/MM/yyyy": "DD/MM/YYYY", //"DD/MM/yyyy",
  "MMM dd, yyyy": "MMM DD, YYYY", //"MMM DD, yyyy"
};

export const getDateFormat = () => {
  const key = dateFormatList[localStorage.getItem(keyDateFormat)];
  if (!key) {
    return "DD MMMM YYYY";
  } else return key;
};

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();

    const { formatMask } = DatePicker.updateFormat(props, null);
    this.state = DatePicker.updateDateTime(props, formatMask);
  }

  handleChange = (date, dateString) => {
    const { formatMask } = this.state;
    debugger;
    this.setState({
      value: dateString,
      internalValue: date?.$d ? date.$d : undefined,
      placeholder: formatMask.toLowerCase(),
    });
  };

  static updateFormat(props, oldFormatMask) {
    const formatMask = getDateFormat() || "DD MMMM YYYY";
    const updated = formatMask !== oldFormatMask;

    return { updated, formatMask };
  }

  static updateDateTime(props, formatMask) {
    let value;
    let internalValue;
    const { defaultToday } = props.data;
    if (defaultToday && !props.defaultValue) {
      value = dayjs().format(formatMask);
      internalValue = dayjs();
    } else {
      value = props.defaultValue;

      if (!value) {
        internalValue = undefined;
      } else {
        internalValue = dayjs(value, formatMask);
      }
    }
    return {
      value,
      internalValue,
      placeholder: formatMask.toLowerCase(),
      defaultToday,
      formatMask,
      defaultValue: props.defaultValue,
    };
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties &&
      this.props.getActiveUserProperties();

    const savedEditor = this.props.editor;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId;
    }
    const { showTimeSelect } = this.props.data;
    const props = {};
    props.type = "date";
    props.className = "form-control";
    props.name = this.props.data.field_name;
    const readOnly =
      this.props.data.readOnly || this.props.read_only || !isSameEditor;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <div>
            {readOnly && (
              <input
                type="text"
                name={props.name}
                ref={props.ref}
                readOnly={readOnly}
                placeholder={this.state.placeholder}
                value={this.state.value}
                disabled={!isSameEditor}
                className="form-control"
              />
            )}
            {!readOnly && (
              <AntDatePicker
                name={props.name}
                ref={props.ref}
                onChange={this.handleChange}
                // selected={this.state.internalValue}
                value={
                  this.state.internalValue
                    ? dayjs(this.state.internalValue)
                    : null
                }
                className="form-control"
                format={this.state.formatMask}
                showTime={showTimeSelect}
                disabled={!isSameEditor}
                placeholder={this.state.placeholder}
                style={{ display: "inline-block", width: "auto" }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DatePicker;
