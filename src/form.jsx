import React, { useRef, useState, useEffect, forwardRef } from "react";
import ReactDOM from "react-dom";
import { EventEmitter } from "fbemitter";
import FormValidator from "./form-validator";
import FormElements from "./form-elements";
import { TwoColumnRow, ThreeColumnRow, FourColumnRow } from "./multi-column";
import CustomElement from "./form-elements/custom-element";
import Registry from "./stores/registry";
import { FormProvider, useFormContext } from "./context/form-context";

const columnsElement = {
  TwoColumnRow: TwoColumnRow,
  ThreeColumnRow: ThreeColumnRow,
  FourColumnRow: FourColumnRow,
};

const {
  Image,
  Checkboxes,
  Signature,
  Signature2,
  FileUpload,
  ImageUpload,
  Download,
  Camera,
  DataSource,
} = FormElements;

const convert = (answers) => {
  if (Array.isArray(answers)) {
    const result = {};
    answers.forEach((x) => {
      if (x.name && x.name.indexOf("tags_") > -1) {
        result[x.name] = x.value.map((y) => y.value);
      } else {
        result[x.name] = x.value;
      }
    });
    return result;
  }
  return answers || {};
};

const emitter = new EventEmitter();

const ReactForm = forwardRef((props, ref) => {
  // const formRef = useRef(null);
  const inputsRef = useRef({});
  const [answerData, setAnswerData] = useState(convert(props.answer_data));

  const { formValues } = useFormContext();

  useEffect(() => {
    setAnswerData(convert(props.answer_data));
  }, [props.answer_data]);

  function _getDefaultValue(item) {
    return answerData[item.field_name];
  }

  function _getEditor(item) {
    if (!props.answer_data || !Array.isArray(props.answer_data)) {
      return null;
    }
    const itemAns = props.answer_data.find((x) => x.name === item.field_name);
    return itemAns && itemAns.editor;
  }

  function _optionsDefaultValue(item) {
    const defaultValue = _getDefaultValue(item);
    if (defaultValue) {
      return defaultValue;
    }

    const defaultChecked = [];
    item.options.forEach((option) => {
      if (answerData[`option_${option.key}`]) {
        defaultChecked.push(option.key);
      }
    });
    return defaultChecked;
  }

  function _getItemValue(item, ref) {
    let $item = {
      element: item.element,
      value: ref && ref.value,
    };
    if (item.element === "Rating") {
      $item.value = ref.state.rating;
    } else if (item.element === "Tags") {
      $item.value = ref.state.value;
    } else if (item.element === "DatePicker") {
      $item.value = ref.input.value;
    } else if (item.element === "Camera") {
      $item.value = ref.src
        ? ref.src.replace("data:image/png;base64,", "")
        : "";
    } else if (item.element === "Table") {
      $item.value = ref.state.inputs;
    } else if (item.element === "Signature2") {
      const dataVal = formValues[item.field_name]?.value || {};
      if (dataVal.isSigned) {
        $item.value = dataVal;
      }
    } else if (item.element === "DataSource" && ref.state.searchText) {
      $item.value = {
        type: ref.props.data.sourceType,
        value: ref.state.searchText,
        selectedItem: ref.state.selectedItem,
      };
    } else if (item.element === "FileUpload") {
      $item.value = {
        fileList: ref.state.fileList,
      };
    } else if (item.element === "ImageUpload") {
      $item.value = {
        filePath: ref.state.filePath,
        fileName: ref.state.fileName,
        blobUrl: ref.state.blobUrl,
      };
    } else if (ref && ref.inputField && ref.inputField.current) {
      $item = ReactDOM.findDOMNode(ref.inputField.current);
      if ($item && typeof $item.value === "string") {
        $item.value = $item.value.trim();
      }
    }

    return $item;
  }

  function _isIncorrect(item) {
    let incorrect = false;
    if (item.canHaveAnswer) {
      const ref = inputsRef.current[item.field_name];
      if (item.element === "Checkboxes" || item.element === "RadioButtons") {
        // TODO: to fix this later
        // item.options.forEach((option) => {
        //   const $option = ReactDOM.findDOMNode(
        //     ref.options[`child_ref_${option.key}`]
        //   );
        //   if (
        //     (option.hasOwnProperty("correct") && !$option.checked) ||
        //     (!option.hasOwnProperty("correct") && $option.checked)
        //   ) {
        //     incorrect = true;
        //   }
        // });
        // const dataVal =
        //   (formValues[item.field_name] && formValues[item.field_name].value) ||
        //   [];
        // const checkedItems = dataVal.find((item) => item.value);
        // if (!checkedItems) {
        //   invalid = true;
        // }
      } else {
        const $item = _getItemValue(item, ref);
        if (item.element === "Rating") {
          if ($item.value.toString() !== item.correct) {
            incorrect = true;
          }
        } else if (
          $item.value.toLowerCase() !== item.correct.trim().toLowerCase()
        ) {
          incorrect = true;
        }
      }
    }
    return incorrect;
  }

  function _isInvalid(item) {
    let invalid = false;
    if (item.required === true) {
      const ref = inputsRef.current[item.field_name];
      if (item.element === "Checkboxes" || item.element === "RadioButtons") {
        const dataVal =
          (formValues[item.field_name] && formValues[item.field_name].value) ||
          [];

        const checkedItems = dataVal.find((item) => item.value);
        if (!checkedItems) {
          invalid = true;
        }
      } else {
        const $item = _getItemValue(item, ref);
        if (item.element === "Rating") {
          if ($item.value === 0) {
            invalid = true;
          }
        } else if (
          $item.element === "FileUpload" &&
          (!$item.value.fileList || $item.value.fileList.length <= 0)
        ) {
          invalid = true;
        } else if (item.element === "ImageUpload" && !item.value.filePath) {
          invalid = true;
        } else if (
          $item.value === undefined ||
          $item.value === null ||
          $item.value.length < 1
        ) {
          invalid = true;
        }
      }
    }
    return invalid;
  }

  function _collect(item) {
    const itemData = {
      name: item.field_name,
      custom_name: item.custom_name || item.field_name,
    };
    const ref = inputsRef.current[item.field_name];
    const activeUser = props.getActiveUserProperties();
    const oldEditor = _getEditor(item);

    if (item.element === "Checkboxes" || item.element === "RadioButtons") {
      const dataVal =
        (formValues[item.field_name] && formValues[item.field_name].value) ||
        [];

      itemData.value = dataVal;
      itemData.editor = oldEditor
        ? oldEditor
        : dataVal.length > 0
        ? activeUser
        : null;
    } else if (item.element === "FileUpload") {
      itemData.value = formValues[item.field_name] || [];
      itemData.editor = oldEditor
        ? oldEditor
        : itemData.value > 0
        ? activeUser
        : null;
    } else if (item.element === "Signature2") {
      itemData.value = formValues[item.field_name] || {};
      itemData.editor = oldEditor
        ? oldEditor
        : itemData.value.isSigned
        ? activeUser
        : null;
    } else {
      if (!ref) {
        return null;
      }

      const valueItem = _getItemValue(item, ref);

      itemData.value = valueItem.value;
      itemData.editor = oldEditor
        ? oldEditor
        : valueItem.value
        ? activeUser
        : null;
      if (item.element === "Signature2") {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.isSigned
          ? activeUser
          : null;
      } else if (item.element === "DataSource" && ref.state.searchText) {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.value
          ? activeUser
          : null;
      } else if (item.element === "FileUpload") {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.fileList && valueItem.value.fileList.length > 0
          ? activeUser
          : null;
      } else if (item.element === "ImageUpload") {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.filePath
          ? activeUser
          : null;
      } else if (item.element === "Table") {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.find((itemRow) => itemRow.find((val) => !!val))
          ? activeUser
          : null;
      }
    }

    return itemData;
  }

  function _collectFormData(data) {
    const formData = [];
    data.forEach((item) => {
      const item_data = _collect(item);
      if (item_data) {
        formData.push(item_data);
      }
    });
    return formData;
  }

  function _collectFormItems(data) {
    const formData = [];
    data.forEach((item) => {
      const itemValue = _collect(item);
      const itemData = {
        id: item.id,
        element: item.element,
        value: itemValue && itemValue.value,
      };

      formData.push(itemData);
    });

    return formData;
  }

  function _getSignatureImg(item) {
    const ref = inputsRef.current[item.field_name];
    const $canvas_sig = ref.canvas.current;
    if ($canvas_sig) {
      const base64 = $canvas_sig
        .toDataURL()
        .replace("data:image/png;base64,", "");
      const isEmpty = $canvas_sig.isEmpty();
      const $input_sig = ReactDOM.findDOMNode(ref.inputField.current);
      if (isEmpty) {
        $input_sig.value = "";
      } else {
        $input_sig.value = base64;
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (props.onSubmit) {
      let errors = [];
      if (!props.skip_validations) {
        errors = validateForm();
        emitter.emit("formValidation", errors);
      }

      if (errors.length < 1) {
        const data = _collectFormData(props.data);
        props.onSubmit(data);
      }
    } else {
      let errors = [];
      if (!props.skip_validations) {
        errors = validateForm();
        emitter.emit("formValidation", errors);
      }

      if (errors.length < 1) {
        // const $form = formRef.current;
        // $form.submit();
      }
    }
  }

  function validateForm() {
    const errors = [];
    let data_items = props.data;

    let orderedItems = [];
    props.data.forEach((item) => {
      const childItems = props.data.filter(
        (child) => child.parentId === item.id
      );
      if (childItems.length > 0) {
        orderedItems = orderedItems.concat(childItems);
      } else if (!item.parentId) {
        orderedItems.push(item);
      }
    });

    const formItems = _collectFormItems(orderedItems);
    const sectionItems = formItems.filter((item) => item.element === "Section");

    if (sectionItems.length > 0) {
      const firstItem = formItems[0];
      let activeSectionKey =
        firstItem.element === "Section" ? firstItem.id : "";
      const sectionGroup = {};
      sectionGroup[activeSectionKey] = [];

      formItems.forEach((item) => {
        if (item.element === "Section") {
          activeSectionKey = item.id;
          sectionGroup[activeSectionKey] = [];
        } else {
          sectionGroup[activeSectionKey].push(item);
        }
      });

      let activeItems = [];

      const reverseKeys = sectionItems.map((item) => item.id).reverse();
      reverseKeys.push("");
      let activeSectionFound = false;

      reverseKeys.forEach((key) => {
        const items = sectionGroup[key];
        let fillingItems = items;

        if (key && !activeSectionFound) {
          fillingItems = items.find(
            (item) =>
              item.element !== "Table" &&
              ((Array.isArray(item.value) && item.value.length > 0) ||
                (typeof item.value !== "object" &&
                  !Array.isArray(item.value) &&
                  !!item.value) ||
                (item.element === "FileUpload" &&
                  item.value.fileList &&
                  item.value.fileList.length > 0) ||
                (item.element === "ImageUpload" && !!item.value.filePath))
          );

          activeSectionFound = !!fillingItems;
        }

        if (fillingItems) {
          activeItems = activeItems.concat(items);
        }
      });

      const itemIds = activeItems.map((item) => item.id);
      data_items = props.data.filter((item) => itemIds.includes(item.id));
    }

    data_items.forEach((item) => {
      if (item.element === "Signature") {
        _getSignatureImg(item);
      }

      if (_isInvalid(item)) {
        errors.push(`${item.label || item.position} is required!`);
      }

      if (props.validateForCorrectness && _isIncorrect(item)) {
        errors.push(`${item.label} was answered incorrectly!`);
      }
    });

    return errors;
  }

  function getDataById(id) {
    const { data } = props;
    const item = data.find((x) => x.id === id);
    return item;
  }

  function getInputElement(item) {
    if (item.custom) {
      return getCustomElement(item);
    }
    const Input = FormElements[item.element];
    return (
      <Input
        ref={(c) => {
          inputsRef.current[item.field_name] = c;
        }}
        handleChange={handleChange}
        mutable={true}
        key={`form_${item.id}`}
        data={item}
        read_only={props.read_only}
        defaultValue={_getDefaultValue(item)}
        editor={_getEditor(item)}
        getActiveUserProperties={props.getActiveUserProperties}
        getDataSource={props.getDataSource}
        onUploadFile={props.onUploadFile}
        onDownloadFile={props.onDownloadFile}
        onUploadImage={props.onUploadImage}
        getFormSource={props.getFormSource}
      />
    );
  }

  function getContainerElement(item, Element) {
    const controls = item.childItems.map((x) => {
      const currentItem = getDataById(x);
      return x && currentItem ? (
        getInputElement(currentItem)
      ) : (
        <div>&nbsp;</div>
      );
    });

    return (
      <Element
        mutable={true}
        key={`form_${item.id}`}
        data={item}
        controls={controls}
      />
    );
  }

  function getCustomElement(item) {
    if (!item.component || typeof item.component !== "function") {
      item.component = Registry.get(item.key);
      if (!item.component) {
        console.error(`${item.element} was not registered`);
      }
    }
    return (
      <CustomElement
        ref={(c) => {
          inputsRef.current[item.field_name] = c;
        }}
        handleChange={handleChange}
        mutable={true}
        key={`form_${item.id}`}
        data={item}
        read_only={props.read_only}
        defaultValue={_getDefaultValue(item)}
        editor={_getEditor(item)}
        getActiveUserProperties={props.getActiveUserProperties}
        getDataSource={props.getDataSource}
        onUploadFile={props.onUploadFile}
        onDownloadFile={props.onDownloadFile}
        onUploadImage={props.onUploadImage}
        getFormSource={props.getFormSource}
      />
    );
  }

  function handleChange(event) {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    let newState = {};

    if (value === "-----") {
      value = null;
    }

    if (target.getAttribute("data-sig")) {
      newState[`${name}_sig`] = true;
    }

    newState[name] = value;
    setAnswerData((prevState) => ({
      ...prevState,
      ...newState,
    }));
  }

  function convert(answerData) {
    if (!answerData || typeof answerData !== "object") {
      return {};
    }
    const convertedData = {};
    Object.keys(answerData).forEach((key) => {
      if (key.includes("_sig")) {
        return;
      }
      convertedData[key] = answerData[key];
    });
    return convertedData;
  }

  function renderForm() {
    const { data } = props;
    const formControls = data.map((item) => {
      if (item.parentId) {
        return null;
      }
      if (item.element.indexOf("ColumnRow") > -1) {
        return getContainerElement(item, columnsElement[item.element]);
      }
      return getInputElement(item);
    });

    function handleRenderSubmit() {
      const { actionName = "Submit", submitButton = false } = props;

      return (
        submitButton || (
          <input type="submit" className="btn btn-big" value={actionName} />
        )
      );
    }

    return (
      <>
        <FormValidator emitter={emitter} />
        <form
          className="form-horizontal"
          encType="multipart/form-data"
          ref={ref}
          action={props.form_action}
          onSubmit={handleSubmit}
          onsubmit={handleSubmit}
          method={props.form_method}
        >
          {formControls}
          <div className="btn-toolbar">
            {!props.hide_actions && handleRenderSubmit()}
            {!props.hide_actions && props.back_action && (
              <a
                href={props.back_action}
                className="btn btn-default btn-cancel btn-big"
              >
                {props.back_name ? props.back_name : "Cancel"}
              </a>
            )}
          </div>
        </form>
      </>
    );
  }

  return renderForm();
});

ReactForm.defaultProps = { validateForCorrectness: false };

const ReactFormWrapper = forwardRef((props, ref) => {
  return (
    <FormProvider>
      <ReactForm {...props} ref={ref} />
    </FormProvider>
  );
});

ReactFormWrapper.defaultProps = { validateForCorrectness: false };
export default ReactFormWrapper;

// export default ReactForm;
