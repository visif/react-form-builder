import { format } from "date-fns";
import ReactDatePicker from "react-datepicker";
import ComponentHeader from "./component-header";
import ComponentLabel from "./component-label";

const DatePicker = forwardRef((props, ref) => {
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
              ref={ref}
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
});

export default DatePicker;
