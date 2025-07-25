import React from "react";
import { DatePicker as AntDatePicker, TimePicker as AntTimePicker } from "antd";
import dayjs from "dayjs";
import ComponentHeader from "./component-header";
import ComponentLabel from "./component-label";
import utc from 'dayjs/plugin/utc';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(utc);
dayjs.extend(buddhistEra);

const keyDateFormat = "setting_date_format";
const keyCalendarType = "setting_calendar_type";

const dateFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY",
  "dd-MMM-yyyy": "DD-MMM-YYYY",
  "dd-MMM-yy": "DD-MMM-YY",
  "yyyy-MM-dd": "YYYY-MM-DD",
  "MM/dd/yyyy": "MM/DD/YYYY",
  "dd/MM/yyyy": "DD/MM/YYYY",
  "MMM dd, yyyy": "MMM DD, YYYY",
};

const dateTimeFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY HH:MM",
  "dd-MMM-yyyy": "DD-MMM-YYYY HH:MM",
  "dd-MMM-yy": "DD-MMM-YY HH:MM",
  "yyyy-MM-dd": "YYYY-MM-DD HH:MM",
  "MM/dd/yyyy": "MM/DD/YYYY HH:MM",
  "dd/MM/yyyy": "DD/MM/YYYY HH:MM",
  "MMM dd, yyyy": "MMM DD, YYYY HH:MM",
};

export const getDateFormat = (showTimeSelect) => {
  const key = showTimeSelect
    ? dateTimeFormatList[localStorage.getItem(keyDateFormat)]
    : dateFormatList[localStorage.getItem(keyDateFormat)];
  return key || (showTimeSelect ? "DD MMMM YYYY HH:MM" : "DD MMMM YYYY");
};

export const getCalendarType = () => {
  var key = localStorage.getItem(keyCalendarType);
  return key || "EN";
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

  checkForValue = (attempt = 0) => {
    const { defaultValue } = this.props;
    const maxRetries = 3;

    if (!this.state.value && defaultValue) {
      // If value hasn't loaded yet, check again in a moment
      setTimeout(() => {
        if (this.mounted && !this.state.value) {
          const { formatMask } = this.state;
          this.setState({
            ...DatePicker.updateDateTime(this.props, formatMask),
            loading: false
          });
          // Keep checking if still no value and attempts are less than maxRetries
          if (!this.state.value && attempt < maxRetries) {
            this.checkForValue(attempt + 1);
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

  handleTimeChange = (time) => {
    const isoTime = time ? time.toISOString() : null;
    this.setState({
      value: isoTime,
      placeholder: "HH:MM",
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
    const formatMask = getDateFormat(props.data.showTimeSelect);
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
        if (isMMDDYYYY) {
          value = dayjs(props.defaultValue, "MM/DD/YYYY").toISOString();
        } else {
          value = dayjs(props.defaultValue).utc(true).toISOString();
        }
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

  formatDate = (date, formatMask) => {
    if (!date) return "";;

    if (getCalendarType() === "EN") {
      return dayjs(date).utc(true).format(formatMask);
    } else {
      // Convert to Buddhist calendar (add 543 years)
      return dayjs(date).utc(true).format(formatMask.replace('YYYY', 'BBBB'));
    }
  }

  render() {
    const { showTimeSelect, showTimeSelectOnly } = this.props.data;
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();

    const savedEditor = this.props.editor;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
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
                value={this.state.value ? this.formatDate(this.state.value, this.state.formatMask) : ""}
                disabled={!isSameEditor}
                className="form-control"
              />
            ) : !showTimeSelectOnly ? (
              <AntDatePicker
                name={props.name}
                ref={props.ref}
                onChange={this.handleChange}
                value={this.state.value ? dayjs(this.state.value).utc(true) : null}
                className="form-control bold-date-picker"
                format={(value) => this.formatDate(value, this.state.formatMask)}
                showTime={showTimeSelect? { format: "HH:mm", showSecond: false } : null}
                disabled={!isSameEditor || this.state.loading}
                placeholder={this.state.placeholder}
                style={{ display: "inline-block", width: "auto" }}
              />
            ) : (
              <AntTimePicker
                name={props.name}
                ref={props.ref}
                onChange={this.handleTimeChange}
                value={this.state.value ? dayjs(this.state.value).utc(true) : null}
                className="form-control bold-time-picker"
                disabled={!isSameEditor || this.state.loading}
                placeholder={this.state.placeholder}
                style={{ display: "inline-block", width: "auto" }}
                format="HH:mm"
                minuteStep={1}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DatePicker;

