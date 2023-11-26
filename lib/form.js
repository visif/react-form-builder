"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof3 = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _fbemitter = require("fbemitter");
var _formValidator = _interopRequireDefault(require("./form-validator"));
var _formElements = _interopRequireDefault(require("./form-elements"));
var _multiColumn = require("./multi-column");
var _customElement = _interopRequireDefault(require("./form-elements/custom-element"));
var _registry = _interopRequireDefault(require("./stores/registry"));
var _formContext = require("./context/form-context");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var columnsElement = {
  TwoColumnRow: _multiColumn.TwoColumnRow,
  ThreeColumnRow: _multiColumn.ThreeColumnRow,
  FourColumnRow: _multiColumn.FourColumnRow
};
var Image = _formElements["default"].Image,
  Checkboxes = _formElements["default"].Checkboxes,
  Signature = _formElements["default"].Signature,
  Signature2 = _formElements["default"].Signature2,
  FileUpload = _formElements["default"].FileUpload,
  ImageUpload = _formElements["default"].ImageUpload,
  Download = _formElements["default"].Download,
  Camera = _formElements["default"].Camera,
  DataSource = _formElements["default"].DataSource;
var convert = function convert(answers) {
  if (Array.isArray(answers)) {
    var result = {};
    answers.forEach(function (x) {
      if (x.name && x.name.indexOf("tags_") > -1) {
        result[x.name] = x.value.map(function (y) {
          return y.value;
        });
      } else {
        result[x.name] = x.value;
      }
    });
    return result;
  }
  return answers || {};
};
var ReactForm = function ReactForm(props) {
  // const formRef = useRef(null);
  var inputsRef = (0, _react.useRef)({});
  var _useState = (0, _react.useState)(convert(props.answer_data)),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    answerData = _useState2[0],
    setAnswerData = _useState2[1];
  var emitter = new _fbemitter.EventEmitter();
  var _useFormContext = (0, _formContext.useFormContext)(),
    formValues = _useFormContext.formValues;
  (0, _react.useEffect)(function () {
    setAnswerData(convert(props.answer_data));
  }, [props.answer_data]);
  function _getDefaultValue(item) {
    return answerData[item.field_name];
  }
  function _getEditor(item) {
    if (!props.answer_data || !Array.isArray(props.answer_data)) {
      return null;
    }
    var itemAns = props.answer_data.find(function (x) {
      return x.name === item.field_name;
    });
    return itemAns && itemAns.editor;
  }
  function _optionsDefaultValue(item) {
    var defaultValue = _getDefaultValue(item);
    if (defaultValue) {
      return defaultValue;
    }
    var defaultChecked = [];
    item.options.forEach(function (option) {
      if (answerData["option_".concat(option.key)]) {
        defaultChecked.push(option.key);
      }
    });
    return defaultChecked;
  }
  function _getItemValue(item, ref) {
    var $item = {
      element: item.element,
      value: ref && ref.value
    };
    if (item.element === "Rating") {
      $item.value = ref.state.rating;
    } else if (item.element === "Tags") {
      $item.value = ref.state.value;
    } else if (item.element === "DatePicker") {
      $item.value = ref.input.value;
    } else if (item.element === "Camera") {
      $item.value = ref.src ? ref.src.replace("data:image/png;base64,", "") : "";
    } else if (item.element === "Table") {
      $item.value = ref.state.inputs;
    } else if (item.element === "Signature2") {
      var _formValues$item$fiel;
      var dataVal = ((_formValues$item$fiel = formValues[item.field_name]) === null || _formValues$item$fiel === void 0 ? void 0 : _formValues$item$fiel.value) || {};
      if (dataVal.isSigned) {
        $item.value = dataVal;
      }
    } else if (item.element === "DataSource" && ref.state.searchText) {
      $item.value = {
        type: ref.props.data.sourceType,
        value: ref.state.searchText,
        selectedItem: ref.state.selectedItem
      };
    } else if (item.element === "FileUpload") {
      $item.value = {
        fileList: ref.state.fileList
      };
    } else if (item.element === "ImageUpload") {
      $item.value = {
        filePath: ref.state.filePath,
        fileName: ref.state.fileName,
        blobUrl: ref.state.blobUrl
      };
    } else if (ref && ref.inputField && ref.inputField.current) {
      $item = _reactDom["default"].findDOMNode(ref.inputField.current);
      if ($item && typeof $item.value === "string") {
        $item.value = $item.value.trim();
      }
    }
    return $item;
  }
  function _isIncorrect(item) {
    var incorrect = false;
    if (item.canHaveAnswer) {
      var ref = inputsRef.current[item.field_name];
      if (item.element === "Checkboxes" || item.element === "RadioButtons") {
        item.options.forEach(function (option) {
          var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);
          if (option.hasOwnProperty("correct") && !$option.checked || !option.hasOwnProperty("correct") && $option.checked) {
            incorrect = true;
          }
        });
      } else {
        var $item = _getItemValue(item, ref);
        if (item.element === "Rating") {
          if ($item.value.toString() !== item.correct) {
            incorrect = true;
          }
        } else if ($item.value.toLowerCase() !== item.correct.trim().toLowerCase()) {
          incorrect = true;
        }
      }
    }
    return incorrect;
  }
  function _isInvalid(item) {
    var invalid = false;
    if (item.required === true) {
      var ref = inputsRef.current[item.field_name];
      if (item.element === "Checkboxes" || item.element === "RadioButtons") {
        var checked_options = 0;
        item.options.forEach(function (option) {
          var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);
          if ($option.checked) {
            checked_options += 1;
          }
        });
        if (checked_options < 1) {
          invalid = true;
        }
      } else {
        var $item = _getItemValue(item, ref);
        if (item.element === "Rating") {
          if ($item.value === 0) {
            invalid = true;
          }
        } else if ($item.element === "FileUpload" && (!$item.value.fileList || $item.value.fileList.length <= 0)) {
          invalid = true;
        } else if (item.element === "ImageUpload" && !item.value.filePath) {
          invalid = true;
        } else if ($item.value === undefined || $item.value === null || $item.value.length < 1) {
          invalid = true;
        }
      }
    }
    return invalid;
  }
  function _collect(item) {
    var itemData = {
      name: item.field_name,
      custom_name: item.custom_name || item.field_name
    };
    var ref = inputsRef.current[item.field_name];
    var activeUser = props.getActiveUserProperties();
    var oldEditor = _getEditor(item);
    if (item.element === "Checkboxes" || item.element === "RadioButtons") {
      var dataVal = formValues[item.field_name] && formValues[item.field_name].value || [];
      itemData.value = dataVal;
      itemData.editor = oldEditor ? oldEditor : dataVal.length > 0 ? activeUser : null;
    } else if (item.element === "FileUpload") {
      itemData.value = formValues[item.field_name] || [];
      itemData.editor = oldEditor ? oldEditor : itemData.value > 0 ? activeUser : null;
    } else if (item.element === "Signature2") {
      itemData.value = formValues[item.field_name] || {};
      itemData.editor = oldEditor ? oldEditor : itemData.value.isSigned ? activeUser : null;
    } else {
      if (!ref) {
        return null;
      }
      var valueItem = _getItemValue(item, ref);
      itemData.value = valueItem.value;
      itemData.editor = oldEditor ? oldEditor : valueItem.value ? activeUser : null;
      if (item.element === "Signature2") {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.isSigned ? activeUser : null;
      } else if (item.element === "DataSource" && ref.state.searchText) {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.value ? activeUser : null;
      } else if (item.element === "FileUpload") {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.fileList && valueItem.value.fileList.length > 0 ? activeUser : null;
      } else if (item.element === "ImageUpload") {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.filePath ? activeUser : null;
      } else if (item.element === "Table") {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.find(function (itemRow) {
          return itemRow.find(function (val) {
            return !!val;
          });
        }) ? activeUser : null;
      }
    }
    return itemData;
  }
  function _collectFormData(data) {
    var formData = [];
    data.forEach(function (item) {
      var item_data = _collect(item);
      if (item_data) {
        formData.push(item_data);
      }
    });
    return formData;
  }
  function _collectFormItems(data) {
    var formData = [];
    data.forEach(function (item) {
      var itemValue = _collect(item);
      var itemData = {
        id: item.id,
        element: item.element,
        value: itemValue && itemValue.value
      };
      formData.push(itemData);
    });
    return formData;
  }
  function _getSignatureImg(item) {
    var ref = inputsRef.current[item.field_name];
    var $canvas_sig = ref.canvas.current;
    if ($canvas_sig) {
      var base64 = $canvas_sig.toDataURL().replace("data:image/png;base64,", "");
      var isEmpty = $canvas_sig.isEmpty();
      var $input_sig = _reactDom["default"].findDOMNode(ref.inputField.current);
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
      var errors = [];
      if (!props.skip_validations) {
        errors = validateForm();
        emitter.emit("formValidation", errors);
      }
      if (errors.length < 1) {
        var data = _collectFormData(props.data);
        props.onSubmit(data);
      }
    } else {
      var _errors = [];
      if (!props.skip_validations) {
        _errors = validateForm();
        emitter.emit("formValidation", _errors);
      }
      if (_errors.length < 1) {
        // const $form = formRef.current;
        // $form.submit();
      }
    }
  }
  function validateForm() {
    var errors = [];
    var data_items = props.data;
    var orderedItems = [];
    props.data.forEach(function (item) {
      var childItems = props.data.filter(function (child) {
        return child.parentId === item.id;
      });
      if (childItems.length > 0) {
        orderedItems = orderedItems.concat(childItems);
      } else if (!item.parentId) {
        orderedItems.push(item);
      }
    });
    var formItems = _collectFormItems(orderedItems);
    var sectionItems = formItems.filter(function (item) {
      return item.element === "Section";
    });
    if (sectionItems.length > 0) {
      var firstItem = formItems[0];
      var activeSectionKey = firstItem.element === "Section" ? firstItem.id : "";
      var sectionGroup = {};
      sectionGroup[activeSectionKey] = [];
      formItems.forEach(function (item) {
        if (item.element === "Section") {
          activeSectionKey = item.id;
          sectionGroup[activeSectionKey] = [];
        } else {
          sectionGroup[activeSectionKey].push(item);
        }
      });
      var activeItems = [];
      var reverseKeys = sectionItems.map(function (item) {
        return item.id;
      }).reverse();
      reverseKeys.push("");
      var activeSectionFound = false;
      reverseKeys.forEach(function (key) {
        var items = sectionGroup[key];
        var fillingItems = items;
        if (key && !activeSectionFound) {
          fillingItems = items.find(function (item) {
            return item.element !== "Table" && item.element !== "Dropdown" && (Array.isArray(item.value) && item.value.length > 0 || (0, _typeof2["default"])(item.value) !== "object" && !Array.isArray(item.value) && !!item.value || item.element === "FileUpload" && item.value.fileList && item.value.fileList.length > 0 || item.element === "ImageUpload" && !!item.value.filePath);
          });
          activeSectionFound = !!fillingItems;
        }
        if (fillingItems) {
          activeItems = activeItems.concat(items);
        }
      });
      var itemIds = activeItems.map(function (item) {
        return item.id;
      });
      data_items = props.data.filter(function (item) {
        return itemIds.includes(item.id);
      });
    }
    data_items.forEach(function (item) {
      if (item.element === "Signature") {
        _getSignatureImg(item);
      }
      if (_isInvalid(item)) {
        errors.push("".concat(item.label || item.position, " is required!"));
      }
      if (props.validateForCorrectness && _isIncorrect(item)) {
        errors.push("".concat(item.label, " was answered incorrectly!"));
      }
    });
    return errors;
  }
  function getDataById(id) {
    var data = props.data;
    var item = data.find(function (x) {
      return x.id === id;
    });
    return item;
  }
  function getInputElement(item) {
    if (item.custom) {
      return getCustomElement(item);
    }
    var Input = _formElements["default"][item.element];
    return /*#__PURE__*/_react["default"].createElement(Input, {
      handleChange: handleChange,
      mutable: true,
      key: "form_".concat(item.id),
      data: item,
      read_only: props.read_only,
      defaultValue: _getDefaultValue(item),
      editor: _getEditor(item),
      getActiveUserProperties: props.getActiveUserProperties,
      getDataSource: props.getDataSource,
      onUploadFile: props.onUploadFile,
      onDownloadFile: props.onDownloadFile,
      onUploadImage: props.onUploadImage,
      getFormSource: props.getFormSource
    });
  }
  function getContainerElement(item, Element) {
    var controls = item.childItems.map(function (x) {
      var currentItem = getDataById(x);
      return x && currentItem ? getInputElement(currentItem) : /*#__PURE__*/_react["default"].createElement("div", null, "\xA0");
    });
    return /*#__PURE__*/_react["default"].createElement(Element, {
      mutable: true,
      key: "form_".concat(item.id),
      data: item,
      controls: controls
    });
  }
  function getCustomElement(item) {
    if (!item.component || typeof item.component !== "function") {
      item.component = _registry["default"].get(item.key);
      if (!item.component) {
        console.error("".concat(item.element, " was not registered"));
      }
    }
    return /*#__PURE__*/_react["default"].createElement(_customElement["default"], {
      handleChange: handleChange,
      mutable: true,
      key: "form_".concat(item.id),
      data: item,
      read_only: props.read_only,
      defaultValue: _getDefaultValue(item),
      editor: _getEditor(item),
      getActiveUserProperties: props.getActiveUserProperties,
      getDataSource: props.getDataSource,
      onUploadFile: props.onUploadFile,
      onDownloadFile: props.onDownloadFile,
      onUploadImage: props.onUploadImage,
      getFormSource: props.getFormSource
    });
  }
  function handleChange(event) {
    var target = event.target;
    var value = target.type === "checkbox" ? target.checked : target.value;
    var name = target.name;
    var newState = {};
    if (value === "-----") {
      value = null;
    }
    if (target.getAttribute("data-sig")) {
      newState["".concat(name, "_sig")] = true;
    }
    newState[name] = value;
    setAnswerData(function (prevState) {
      return _objectSpread(_objectSpread({}, prevState), newState);
    });
  }
  function convert(answerData) {
    if (!answerData || (0, _typeof2["default"])(answerData) !== "object") {
      return {};
    }
    var convertedData = {};
    Object.keys(answerData).forEach(function (key) {
      if (key.includes("_sig")) {
        return;
      }
      convertedData[key] = answerData[key];
    });
    return convertedData;
  }
  function renderForm() {
    var data = props.data;
    var formControls = data.map(function (item) {
      if (item.parentId) {
        return null;
      }
      if (item.element.indexOf("ColumnRow") > -1) {
        return getContainerElement(item, columnsElement[item.element]);
      }
      return getInputElement(item);
    });
    function handleRenderSubmit() {
      var _props$actionName = props.actionName,
        actionName = _props$actionName === void 0 ? "Submit" : _props$actionName,
        _props$submitButton = props.submitButton,
        submitButton = _props$submitButton === void 0 ? false : _props$submitButton;
      return submitButton || /*#__PURE__*/_react["default"].createElement("input", {
        type: "submit",
        className: "btn btn-big",
        value: actionName
      });
    }
    return /*#__PURE__*/_react["default"].createElement(_formContext.FormProvider, null, /*#__PURE__*/_react["default"].createElement(_formValidator["default"], {
      emitter: emitter
    }), /*#__PURE__*/_react["default"].createElement("form", {
      className: "form-horizontal",
      onSubmit: handleSubmit,
      acceptCharset: "UTF-8",
      encType: "multipart/form-data",
      method: "post",
      autoComplete: "off"
    }, formControls, /*#__PURE__*/_react["default"].createElement("div", {
      className: "btn-toolbar"
    }, !props.hide_actions && handleRenderSubmit(), !props.hide_actions && props.back_action && /*#__PURE__*/_react["default"].createElement("a", {
      href: props.back_action,
      className: "btn btn-default btn-cancel btn-big"
    }, props.back_name ? props.back_name : "Cancel"))));
  }
  return renderForm();
};
ReactForm.defaultProps = {
  validateForCorrectness: false
};
var _default = ReactForm;
exports["default"] = _default;