const Checkboxes = forwardRef((props, ref) => {
  const { dispatch } = useFormContext();

  const [value, setValue] = useState(props.defaultValue);

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
      let newVal;
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
          newVal = current;
          return current;
        }

        newVal = {
          ...current,
          value: [
            ...(current.value || []).filter((item) => item.key !== option.key),
            newActiveVal,
          ],
        };
        return newVal;
      });

      dispatch({
        type: FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: newVal,
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
                    ref[`child_ref_${option.key}`] = c;
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
                  // ref={(c) => {
                  //   if (c && props.mutable) {
                  //     infos[`child_ref_${option.key}_info`] = c;
                  //   }
                  // }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
