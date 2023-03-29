// import React from 'react';
// import { format, parse } from 'date-fns';
// import ReactDatePicker from 'react-datepicker';
// import ComponentHeader from './component-header';
// import ComponentLabel from './component-label';

// class DatePicker extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();

//     const { formatMask } = DatePicker.updateFormat(props, null);
//     this.state = DatePicker.updateDateTime(props, { formatMask }, formatMask);
//   }

//   // formatMask = '';

//   handleChange = (dt) => {
//     let placeholder;
//     const { formatMask } = this.state;
//     if (dt && dt.target) {
//       placeholder = (dt && dt.target && dt.target.value === '') ? formatMask.toLowerCase() : '';
//       const formattedDate = (dt.target.value) ? format(dt.target.value, formatMask) : '';
//       this.setState({
//         value: formattedDate,
//         internalValue: formattedDate,
//         placeholder,
//       });
//     } else {
//       this.setState({
//         value: (dt) ? format(dt, formatMask) : '',
//         internalValue: dt,
//         placeholder,
//       });
//     }
//   };

//   static updateFormat(props, oldFormatMask) {
//     const { showTimeSelect, showTimeSelectOnly } = props.data;
//     const dateFormat = showTimeSelect && showTimeSelectOnly ? '' : props.data.dateFormat;
//     const timeFormat = showTimeSelect ? props.data.timeFormat : '';
//     const formatMask = (`${dateFormat} ${timeFormat}`).trim();
//     const updated = formatMask !== oldFormatMask;

//     return { updated, formatMask };
//   }

//   static updateDateTime(props, state, formatMask) {
//     let value;
//     let internalValue;
//     const { defaultToday } = props.data;
//     if (defaultToday && (props.defaultValue === '' || props.defaultValue === undefined)) {
//       value = format(new Date(), formatMask);
//       internalValue = new Date();
//     } else {
//       value = props.defaultValue;

//       if (value === '' || value === undefined) {
//         internalValue = undefined;
//       } else {
//         internalValue = parse(value, state.formatMask, new Date());
//       }
//     }
//     return {
//       value,
//       internalValue,
//       placeholder: formatMask.toLowerCase(),
//       defaultToday,
//       formatMask: state.formatMask,
//       defaultValue: props.defaultValue,
//     };
//   }

//   static getDerivedStateFromProps(props, state) {
//     const { updated, formatMask } = DatePicker.updateFormat(props, state.formatMask);
//     if (updated
//       || (props.data.defaultToday !== state.defaultToday)
//       || (state.defaultValue !== props.defaultValue)
//     ) {
//       const newState = DatePicker.updateDateTime(props, state, formatMask);
//       return newState;
//     }
//     return null;
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

//     const { showTimeSelect, showTimeSelectOnly } = this.props.data;
//     const props = {};
//     props.type = 'date';
//     props.className = 'form-control';
//     props.name = this.props.data.field_name;
//     //const readOnly = this.props.data.readOnly || this.props.read_only;
//     const readOnly = this.props.data.readOnly || this.props.read_only || !isSameEditor;
//     const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
//     const placeholderText = this.state.formatMask.toLowerCase();

//     if (this.props.mutable) {
//       props.defaultValue = this.props.defaultValue;
//       props.ref = this.inputField;
//     }

//     let baseClasses = 'SortableItem rfb-item';
//     if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <div>
//             {(readOnly) &&
//               <input type="text"
//                 name={props.name}
//                 ref={props.ref}
//                 readOnly={readOnly}
//                 placeholder={this.state.placeholder}
//                 value={this.state.value}
//                 disabled={!isSameEditor}
//                 className="form-control" />
//             }
//             {iOS && !readOnly &&
//               <input type="date"
//                 name={props.name}
//                 ref={props.ref}
//                 onChange={this.handleChange}
//                 dateFormat="MM/DD/YYYY"
//                 placeholder={this.state.placeholder}
//                 value={this.state.value}
//                 disabled={!isSameEditor}
//                 className="form-control" />
//             }
//             {!iOS && !readOnly &&
//               <ReactDatePicker
//                 name={props.name}
//                 ref={props.ref}
//                 onChange={this.handleChange}
//                 selected={this.state.internalValue}
//                 todayButton={'Today'}
//                 className="form-control"
//                 isClearable={true}
//                 showTimeSelect={showTimeSelect}
//                 showTimeSelectOnly={showTimeSelectOnly}
//                 dateFormat={this.state.formatMask}
//                 portalId="root-portal"
//                 autoComplete="off"
//                 disabled={!isSameEditor}
//                 placeholderText={placeholderText} />
//             }
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import ReactDatePicker from "react-datepicker";
import ComponentHeader from "./component-header";
import ComponentLabel from "./component-label";

const DatePicker = (props) => {
  const inputField = useRef();

  const updateFormat = (props, oldFormatMask) => {
    const { showTimeSelect, showTimeSelectOnly } = props.data;
    const dateFormat =
      showTimeSelect && showTimeSelectOnly ? "" : props.data.dateFormat;
    const timeFormat = showTimeSelect ? props.data.timeFormat : "";
    const formatMask = `${dateFormat} ${timeFormat}`.trim();
    const updated = formatMask !== oldFormatMask;

    return { updated, formatMask };
  };

  const updateDateTime = (props, state, formatMask) => {
    let value;
    let internalValue;
    const { defaultToday } = props.data;
    if (
      defaultToday &&
      (props.defaultValue === "" || props.defaultValue === undefined)
    ) {
      value = format(new Date(), formatMask);
      internalValue = new Date();
    } else {
      value = props.defaultValue;

      if (value === "" || value === undefined) {
        internalValue = undefined;
      } else {
        internalValue = parse(value, state.formatMask, new Date());
      }
    }
    return {
      value,
      internalValue,
      placeholder: formatMask.toLowerCase(),
      defaultToday,
      formatMask: state.formatMask,
      defaultValue: props.defaultValue,
    };
  };

  const [state, setState] = useState(() => {
    const { formatMask } = updateFormat(props, null);
    return updateDateTime(props, { formatMask }, formatMask);
  });

  useEffect(() => {
    const { updated, formatMask } = updateFormat(props, state.formatMask);
    if (
      updated ||
      props.data.defaultToday !== state.defaultToday ||
      state.defaultValue !== props.defaultValue
    ) {
      const newState = updateDateTime(props, state, formatMask);
      setState(newState);
    }
  }, [props, state]);

  const handleChange = (dt) => {
    let placeholder;
    const { formatMask } = state;
    if (dt && dt.target) {
      placeholder =
        dt && dt.target && dt.target.value === ""
          ? formatMask.toLowerCase()
          : "";
      const formattedDate = dt.target.value
        ? format(dt.target.value, formatMask)
        : "";
      setState((prevState) => ({
        ...prevState,
        value: formattedDate,
        internalValue: formattedDate,
        placeholder,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        value: dt ? format(dt, formatMask) : "",
        internalValue: dt,
        placeholder,
      }));
    }
  };

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  const { showTimeSelect, showTimeSelectOnly } = props.data;
  const inputProps = {};
  inputProps.type = "date";
  inputProps.className = "form-control";
  inputProps.name = props.data.field_name;
  //const readOnly = props.data.readOnly || props.read_only;
  const readOnly = props.data.readOnly || props.read_only || !isSameEditor;
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const placeholderText = state.formatMask.toLowerCase();

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
        <div>
          {readOnly && (
            <input
              type="text"
              name={inputProps.name}
              ref={inputProps.ref}
              readOnly={readOnly}
              placeholder={state.placeholder}
              value={state.value}
              disabled={!isSameEditor}
              className="form-control"
            />
          )}
          {iOS && !readOnly && (
            <input
              type="date"
              name={inputProps.name}
              ref={inputProps.ref}
              onChange={handleChange}
              dateFormat="MM/DD/YYYY"
              placeholder={state.placeholder}
              value={state.value}
              disabled={!isSameEditor}
              className="form-control"
            />
          )}
          {!iOS && !readOnly && (
            <ReactDatePicker
              name={props.name}
              ref={props.ref}
              onChange={handleChange}
              selected={state.internalValue}
              todayButton={"Today"}
              className="form-control"
              isClearable={true}
              showTimeSelect={showTimeSelect}
              showTimeSelectOnly={showTimeSelectOnly}
              dateFormat={state.formatMask}
              portalId="root-portal"
              autoComplete="off"
              disabled={!isSameEditor}
              placeholderText={placeholderText}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
