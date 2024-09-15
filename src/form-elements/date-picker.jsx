import React from "react";
import { DatePicker as AntDatePicker } from "antd";
import moment from "moment";
import ComponentHeader from "./component-header";
import ComponentLabel from "./component-label";

const DEFAULT_DATE_FORMAT = "dd MMMM yyyy";

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = DatePicker.updateDateTime(props, DEFAULT_DATE_FORMAT);
  }

  handleChange = (date, dateString) => {
    const { formatMask } = this.state;
    // this.setState({
    //   value: dateString,
    //   internalValue: moment(date, formatMask),
    //   placeholder: formatMask.toLowerCase(),
    // });
    debugger;
    this.setState({
      value: dateString,
      internalValue: moment(date.$d).format(formatMask),
      placeholder: formatMask.toLowerCase(),
    });

    // const onDateExpiredChange = async (value: any, dateString: string): Promise<void> => {
    //   const dateFromObject = calendarType === "EN"? (value? value:""): value.$d;
    //   const newDateExpired = moment(dateFromObject).format(DATE_FORMAT);

    //   setEditableModal({
    //     ...editableModal,
    //     dateExpired: newDateExpired
    //   });
    // };
  };

  // static updateFormat(props, oldFormatMask) {
  //   const { showTimeSelect } = props.data;
  //   const formatMask = showTimeSelect
  //     ? `${props.data.dateFormat} ${props.data.timeFormat}`
  //     : props.data.dateFormat;
  //   const updated = formatMask !== oldFormatMask;

  //   return { updated, formatMask };
  // }

  static updateDateTime(props, formatMask) {
    let value;
    let internalValue;
    const { defaultToday } = props.data;
    if (defaultToday && !props.defaultValue) {
      value = moment().format(formatMask);
      internalValue = moment();
    } else {
      value = props.defaultValue;

      if (!value) {
        internalValue = undefined;
      } else {
        internalValue = moment(value, formatMask);
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

  static getDerivedStateFromProps(props, state) {
    // const { updated, formatMask } = DatePicker.updateFormat(
    //   props,
    //   state.formatMask
    // );
    // if (
    //   updated ||
    //   props.data.defaultToday !== state.defaultToday ||
    //   state.defaultValue !== props.defaultValue
    // ) {
    //   return DatePicker.updateDateTime(props, state, formatMask);
    // }
    // return null;
  }

  render() {
    const { showTimeSelect } = this.props.data;
    const readOnly = this.props.data.readOnly || this.props.read_only;

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) baseClasses += " alwaysbreak";

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <div>
            {readOnly ? (
              <input
                type="text"
                readOnly
                value={this.state.value}
                className="form-control"
              />
            ) : (
              <AntDatePicker
                value={this.state.internalValue}
                format={this.state.formatMask}
                showTime={showTimeSelect}
                onChange={this.handleChange}
                className="form-control"
                placeholder={this.state.placeholder}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DatePicker;
