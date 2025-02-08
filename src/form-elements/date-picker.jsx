import React from "react";
import { DatePicker as AntDatePicker } from "antd";
import dayjs from "dayjs";
import ComponentHeader from "./component-header";
import ComponentLabel from "./component-label";

const keyDateFormat = "setting_date_format";

const dateFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY",
  "dd-MMM-yyyy": "DD-MMM-YYYY",
  "dd-MMM-yy": "DD-MMM-YY",
  "yyyy-MM-dd": "YYYY-MM-DD",
  "MM/dd/yyyy": "MM/DD/YYYY",
  "dd/MM/yyyy": "DD/MM/YYYY",
  "MMM dd, yyyy": "MMM DD, YYYY",
};

export const getDateFormat = () => {
  const key = dateFormatList[localStorage.getItem(keyDateFormat)];
  return key || "DD MMMM YYYY";
};

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.mounted = false;

    const { formatMask } = DatePicker.updateFormat(props, null);
    this.state = {
      ...DatePicker.updateDateTime(props, formatMask),
      loading: true
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.checkForValue();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  checkForValue = () => {
    const { defaultValue } = this.props;
    if (!this.state.value && defaultValue) {
      // If value hasn't loaded yet, check again in a moment
      setTimeout(() => {
        if (this.mounted && !this.state.value) {
          const { formatMask } = this.state;
          this.setState({
            ...DatePicker.updateDateTime(this.props, formatMask),
            loading: false
          });
          // Keep checking if still no value
          if (!this.state.value) {
            this.checkForValue();
          }
        }
      }, 500);
    } else {
      this.setState({ loading: false });
    }
  }

  handleChange = (date) => {
    const { formatMask } = this.state;
    const isoDate = date ? date.toISOString() : null;
    this.setState({
      value: isoDate,
      placeholder: formatMask.toLowerCase(),
    });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.defaultValue && props.defaultValue !== state.defaultValue) {
      const { formatMask } = DatePicker.updateFormat(props, null);
      return DatePicker.updateDateTime(props, formatMask);
    }
    return null;
  }

  static updateFormat(props, oldFormatMask) {
    const formatMask = getDateFormat();
    const updated = formatMask !== oldFormatMask;
    return { updated, formatMask };
  }

  static updateDateTime(props, formatMask) {
    let value;
    const { defaultToday } = props.data;
    
    if (defaultToday && !props.defaultValue) {
      value = dayjs().toISOString();
    } else if (props.defaultValue) {
      try {
        const isMMDDYYYY = /^\d{2}\/\d{2}\/\d{4}$/.test(props.defaultValue);
        value = dayjs(
          props.defaultValue,
          isMMDDYYYY ? "MM/DD/YYYY" : undefined
        ).toISOString();
      } catch (error) {
        console.warn('Invalid date value:', props.defaultValue);
        value = null;
      }
    }

    return {
      value,
      placeholder: formatMask.toLowerCase(),
      defaultToday,
      formatMask,
      defaultValue: props.defaultValue,
    };
  }

  render() {
    const { showTimeSelect } = this.props.data;
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    
    const savedEditor = this.props.editor;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId;
    }

    const props = {
      type: "date",
      className: "form-control",
      name: this.props.data.field_name,
    };

    const readOnly = this.props.data.readOnly || this.props.read_only || !isSameEditor;

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
            {readOnly ? (
              <input
                type="text"
                name={props.name}
                ref={props.ref}
                readOnly={readOnly}
                placeholder={this.state.placeholder}
                value={
                  this.state.value
                    ? dayjs(this.state.value).format(this.state.formatMask)
                    : ""
                }
                disabled={!isSameEditor}
                className="form-control"
              />
            ) : (
              <AntDatePicker
                name={props.name}
                ref={props.ref}
                onChange={this.handleChange}
                value={this.state.value ? dayjs(this.state.value) : null}
                className="form-control"
                format={this.state.formatMask}
                showTime={showTimeSelect}
                disabled={!isSameEditor || this.state.loading}
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
