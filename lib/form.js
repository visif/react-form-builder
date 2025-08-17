"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _fbemitter = require("fbemitter");
var _formElements = _interopRequireDefault(require("./form-elements"));
var _customElement = _interopRequireDefault(require("./form-elements/custom-element"));
var _formValidator = _interopRequireDefault(require("./form-validator"));
var _multiColumn = require("./multi-column");
var _registry = _interopRequireDefault(require("./stores/registry"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Image = _formElements["default"].Image,
  Checkboxes = _formElements["default"].Checkboxes,
  Signature = _formElements["default"].Signature,
  Signature2 = _formElements["default"].Signature2,
  FileUpload = _formElements["default"].FileUpload,
  ImageUpload = _formElements["default"].ImageUpload,
  Download = _formElements["default"].Download,
  Camera = _formElements["default"].Camera,
  DataSource = _formElements["default"].DataSource,
  FormLink = _formElements["default"].FormLink;
var convert = function convert(answers) {
  if (Array.isArray(answers)) {
    var result = {};
    answers.forEach(function (x) {
      if (x.name && x.name.indexOf('tags_') > -1) {
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
var ReactForm = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(ReactForm, _React$Component);
  var _super = _createSuper(ReactForm);
  function ReactForm(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, ReactForm);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "form", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "inputs", {});
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleChange", function (propKey, value) {
      _this.emitter.emit('variableChange', {
        propKey: propKey,
        value: value
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleRenderSubmit", function () {
      var _this$props = _this.props,
        _this$props$actionNam = _this$props.actionName,
        actionName = _this$props$actionNam === void 0 ? 'Submit' : _this$props$actionNam,
        _this$props$submitBut = _this$props.submitButton,
        submitButton = _this$props$submitBut === void 0 ? false : _this$props$submitBut;
      return submitButton || /*#__PURE__*/_react["default"].createElement("input", {
        type: "submit",
        className: "btn btn-big",
        value: actionName
      });
    });
    _this.emitter = new _fbemitter.EventEmitter();
    _this.getDataById = _this.getDataById.bind((0, _assertThisInitialized2["default"])(_this));
    var ansData = convert(props.answer_data);
    _this.state = {
      answerData: ansData,
      variables: _this._getVariableValue(ansData, props.data)
    };
    return _this;
  }
  (0, _createClass2["default"])(ReactForm, [{
    key: "_getVariableValue",
    value: function _getVariableValue(ansData, items) {
      var formularItems = items.filter(function (item) {
        return !!item.formularKey;
      });
      var variables = {};
      formularItems.forEach(function (item) {
        var value = ansData[item.field_name];
        if (value !== undefined) {
          // Check if the value is an object and has a value property
          if (Array.isArray(value) && value.length > 0) {
            // If value is an array, get the first item and check if it has a value property
            var firstItem = value[0];
            if ((0, _typeof2["default"])(firstItem) === 'object' && firstItem !== null && firstItem.hasOwnProperty('value')) {
              // Find the item in the items array that matches the field_name
              // const matchedItem = items.find(target => target.field_name === item.field_name)
              // if (matchedItem && matchedItem.options) {
              //   // Find the option where the key matches the firstItem value
              //   const matchedOption = matchedItem.options.find(option => option.key === firstItem.key)
              //   if (matchedOption) {
              //     value = matchedOption.value || matchedOption.text || firstItem.value
              //   } else {
              //     value = firstItem.value
              //   }
              // } else {
              value = firstItem.value;
              // }
            }
          } else if ((0, _typeof2["default"])(value) === 'object' && value !== null && value.hasOwnProperty('value')) {
            value = value.value;
          }
          variables[item.formularKey] = value;
        }
      });
      return variables;
    }
  }, {
    key: "_getDefaultValue",
    value: function _getDefaultValue(item) {
      return this.state.answerData[item.field_name];
    }
  }, {
    key: "_getEditor",
    value: function _getEditor(item) {
      if (!this.props.answer_data || !Array.isArray(this.props.answer_data)) {
        return null;
      }
      var itemAns = this.props.answer_data.find(function (x) {
        return x.name === item.field_name;
      });
      return itemAns && itemAns.editor;
    }
  }, {
    key: "_optionsDefaultValue",
    value: function _optionsDefaultValue(item) {
      var _this2 = this;
      var defaultValue = this._getDefaultValue(item);
      if (defaultValue) {
        return defaultValue;
      }
      var defaultChecked = [];
      item.options.forEach(function (option) {
        if (_this2.state.answerData["option_".concat(option.key)]) {
          defaultChecked.push(option.key);
        }
      });
      return defaultChecked;
    }
  }, {
    key: "_getItemValue",
    value: function _getItemValue(item, ref) {
      var $item = {
        element: item.element,
        value: ''
      };
      if (item.element === 'Rating') {
        $item.value = ref.inputField.current.state.rating;
      } else if (item.element === 'Tags') {
        $item.value = ref.inputField.current.state.value;
      } else if (item.element === 'DatePicker') {
        $item.value = ref.state.value;
      } else if (item.element === 'Camera') {
        $item.value = ref.state.img ? ref.state.img.replace('data:image/png;base64,', '') : '';
      } else if (item.element === 'Table') {
        $item.value = ref.state.inputs;
      } else if (item.element === 'Signature2' && ref.state.isSigned) {
        $item.value = {
          isSigned: ref.state.isSigned,
          signedPerson: ref.state.signedPerson,
          signedPersonId: ref.state.signedPersonId,
          signedDateTime: ref.state.signedDateTime
        };
      } else if (item.element === 'DataSource' && ref.state.searchText) {
        $item.value = {
          type: ref.props.data.sourceType,
          value: ref.state.searchText,
          selectedItem: ref.state.selectedItem
        };
      } else if (item.element === 'FileUpload') {
        $item.value = {
          fileList: ref.state.fileList
        };
      } else if (item.element === 'ImageUpload') {
        $item.value = {
          filePath: ref.state.filePath,
          fileName: ref.state.fileName,
          blobUrl: ref.state.blobUrl
        };
      } else if (item.element === 'FormulaInput') {
        $item.value = {
          formula: ref.state.formula,
          value: ref.state.value,
          variables: ref.state.variables
        };
      } else if (ref && ref.inputField && ref.inputField.current) {
        $item = _reactDom["default"].findDOMNode(ref.inputField.current);
        if ($item && typeof $item.value === 'string') {
          $item.value = $item.value.trim();
        }
      }
      return $item;
    }
  }, {
    key: "_isIncorrect",
    value: function _isIncorrect(item) {
      var incorrect = false;
      if (item.canHaveAnswer) {
        var ref = this.inputs[item.field_name];
        if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
          item.options.forEach(function (option) {
            var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);
            if (option.hasOwnProperty('correct') && !$option.checked || !option.hasOwnProperty('correct') && $option.checked) {
              incorrect = true;
            }
          });
        } else {
          var $item = this._getItemValue(item, ref);
          if (item.element === 'Rating') {
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
  }, {
    key: "_isInvalid",
    value: function _isInvalid(item) {
      var invalid = false;
      if (item.required === true) {
        var ref = this.inputs[item.field_name];
        if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
          var checked_options = 0;
          item.options.forEach(function (option) {
            var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);
            if ($option.checked) {
              checked_options += 1;
            }
          });
          if (checked_options < 1) {
            // errors.push(item.label + ' is required!');
            invalid = true;
          }
        } else {
          var $item = this._getItemValue(item, ref);
          if (item.element === 'Rating') {
            if ($item.value === 0) {
              invalid = true;
            }
          } else if ($item.element === 'FileUpload' && (!$item.value.fileList || $item.value.fileList.length <= 0)) {
            invalid = true;
          } else if (item.element === 'ImageUpload' && !item.value.filePath) {
            invalid = true;
          } else if ($item.value === undefined || $item.value === null || $item.value.length < 1) {
            invalid = true;
          }
        }
      }
      return invalid;
    }
  }, {
    key: "_collect",
    value: function _collect(item) {
      var itemData = {
        name: item.field_name,
        custom_name: item.custom_name || item.field_name
      };
      var ref = this.inputs[item.field_name];
      var activeUser = this.props.getActiveUserProperties();
      var oldEditor = this._getEditor(item);
      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        var checked_options = [];
        item.options.forEach(function (option) {
          var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);
          if ($option !== null && $option !== void 0 && $option.checked) {
            var info = '';
            if (option.info) {
              var _$info$value;
              var $info = _reactDom["default"].findDOMNode(ref.infos["child_ref_".concat(option.key, "_info")]);
              info = (_$info$value = $info === null || $info === void 0 ? void 0 : $info.value) !== null && _$info$value !== void 0 ? _$info$value : '';
            }
            checked_options.push({
              key: option.key,
              value: option.value,
              info: info
            });
          }
        });
        itemData.value = checked_options;
        itemData.editor = oldEditor ? oldEditor : checked_options.length > 0 ? activeUser : null;
      } else {
        if (!ref) {
          return null;
        }
        var valueItem = this._getItemValue(item, ref);
        itemData.value = valueItem.value;
        itemData.editor = oldEditor ? oldEditor : valueItem.value ? activeUser : null;
        if (item.element === 'Signature2') {
          itemData.editor = oldEditor ? oldEditor : valueItem.value.isSigned ? activeUser : null;
        } else if (item.element === 'DataSource' && ref.state.searchText) {
          itemData.editor = oldEditor ? oldEditor : valueItem.value.value ? activeUser : null;
        } else if (item.element === 'FileUpload') {
          itemData.editor = oldEditor ? oldEditor : valueItem.value.fileList && valueItem.value.fileList.length > 0 ? activeUser : null;
        } else if (item.element === 'ImageUpload') {
          itemData.editor = oldEditor ? oldEditor : valueItem.value.filePath ? activeUser : null;
        } else if (item.element === 'Table') {
          itemData.editor = oldEditor ? oldEditor : valueItem.value.find(function (itemRow) {
            return itemRow.find(function (val) {
              return !!val;
            });
          }) ? activeUser : null;
        }
      }
      return itemData;
    }
  }, {
    key: "_collectFormData",
    value: function _collectFormData(data) {
      var _this3 = this;
      var formData = [];
      data.forEach(function (item) {
        var item_data = _this3._collect(item);
        if (item_data) {
          formData.push(item_data);
        }
      });
      console.log('Collected Form Data:', formData);
      return formData;
    }
  }, {
    key: "_collectFormItems",
    value: function _collectFormItems(data) {
      var _this4 = this;
      var formData = [];
      data.forEach(function (item) {
        var itemValue = _this4._collect(item);
        var itemData = {
          id: item.id,
          element: item.element,
          value: itemValue && itemValue.value
        };
        formData.push(itemData);
      });
      return formData;
    }
  }, {
    key: "_getSignatureImg",
    value: function _getSignatureImg(item) {
      var ref = this.inputs[item.field_name];
      var $canvas_sig = ref.canvas.current;
      if ($canvas_sig) {
        var base64 = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
        var isEmpty = $canvas_sig.isEmpty();
        var $input_sig = _reactDom["default"].findDOMNode(ref.inputField.current);
        if (isEmpty) {
          $input_sig.value = '';
        } else {
          $input_sig.value = base64;
        }
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      var onSubmit = this.props.onSubmit;

      // submit with no form
      if (onSubmit) {
        var errors = [];
        if (!this.props.skip_validations) {
          errors = this.validateForm();
          // Publish errors, if any.
          this.emitter.emit('formValidation', errors);
        }

        // Only submit if there are no errors.
        if (errors.length < 1) {
          var data = this._collectFormData(this.props.data);
          onSubmit(data, this.props.parentElementId);
        }
      } else {
        // incase no submit function provided => go to form submit

        var _errors = [];
        if (!this.props.skip_validations) {
          _errors = this.validateForm();
          // Publish errors, if any.
          this.emitter.emit('formValidation', _errors);
        }

        // Only submit if there are no errors.
        if (_errors.length < 1) {
          var $form = _reactDom["default"].findDOMNode(this.form);
          $form.submit();
        }
      }
      // }
    }
  }, {
    key: "validateForm",
    value: function validateForm() {
      var _this5 = this;
      var errors = [];
      var data_items = this.props.data;

      // re-order items to avoid items inside
      var orderedItems = [];
      this.props.data.forEach(function (item) {
        var childItems = _this5.props.data.filter(function (child) {
          return child.parentId === item.id;
        });
        if ((childItems === null || childItems === void 0 ? void 0 : childItems.length) > 0) {
          orderedItems = orderedItems.concat(childItems);
        } else if (!item.parentId) {
          orderedItems.push(item);
        }
      });

      // get all input items
      var formItems = this._collectFormItems(orderedItems);
      var sectionItems = formItems.filter(function (item) {
        return item.element === 'Section';
      });

      // Validate with special condition when there is any section
      if (sectionItems.length > 0) {
        // split items into groups by section
        var firstItem = formItems[0];
        var activeSectionKey = firstItem.element === 'Section' ? firstItem.id : '';
        var sectionGroup = {};
        sectionGroup[activeSectionKey] = [];

        // group items by section separator
        formItems.forEach(function (item) {
          if (item.element === 'Section') {
            activeSectionKey = item.id;
            sectionGroup[activeSectionKey] = [];
          } else {
            sectionGroup[activeSectionKey].push(item);
          }
        });
        var activeItems = [];

        // find only active section => there is any item with value input
        var reverseKeys = sectionItems.map(function (item) {
          return item.id;
        }).reverse();
        reverseKeys.push('');
        var activeSectionFound = false;
        reverseKeys.forEach(function (key) {
          var items = sectionGroup[key];
          var fillingItems = items;

          // incase of section separator
          if (key && !activeSectionFound) {
            fillingItems = items.find(function (item) {
              return item.element !== 'Table' && item.element !== 'Dropdown' && item.element !== 'Range' && (Array.isArray(item.value) && item.value.length > 0 || (0, _typeof2["default"])(item.value) !== 'object' && !Array.isArray(item.value) && !!item.value || item.element === 'FileUpload' && item.value.fileList && item.value.fileList.length > 0 || item.element === 'ImageUpload' && !!item.value.filePath);
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
        data_items = this.props.data.filter(function (item) {
          return itemIds.includes(item.id);
        });
      }
      data_items.forEach(function (item) {
        if (item.element === 'Signature') {
          _this5._getSignatureImg(item);
        }
        if (_this5._isInvalid(item)) {
          errors.push("".concat(item.label || item.position, " is required!"));
        }
        if (_this5.props.validateForCorrectness && _this5._isIncorrect(item)) {
          errors.push("".concat(item.label, " was answered incorrectly!"));
        }
      });
      return errors;
    }
  }, {
    key: "getDataById",
    value: function getDataById(id) {
      var data = this.props.data;
      var item = data.find(function (x) {
        return x.id === id;
      });
      return item;
    }
  }, {
    key: "getInputElement",
    value: function getInputElement(item) {
      var _this6 = this;
      if (item.custom) {
        return this.getCustomElement(item);
      }
      var Input = _formElements["default"][item.element];
      return /*#__PURE__*/_react["default"].createElement(Input, {
        handleChange: this.handleChange,
        ref: function ref(c) {
          _this6.inputs[item.field_name] = c;
        },
        mutable: true,
        key: "form_".concat(item.id),
        data: item,
        read_only: this.props.read_only,
        defaultValue: this._getDefaultValue(item),
        editor: this._getEditor(item),
        getActiveUserProperties: this.props.getActiveUserProperties,
        getDataSource: this.props.getDataSource,
        onUploadFile: this.props.onUploadFile,
        onDownloadFile: this.props.onDownloadFile,
        onUploadImage: this.props.onUploadImage,
        getFormSource: this.props.getFormSource,
        broadcastChange: this.broadcastChange,
        emitter: this.emitter,
        variables: this.state.variables
      });
    }
  }, {
    key: "getContainerElement",
    value: function getContainerElement(item, Element) {
      var _this7 = this;
      var controls = Array.isArray(item.childItems[0]) ? item.childItems.map(function (row) {
        return row.map(function (x) {
          var currentItem = _this7.getDataById(x);
          return x && currentItem ? _this7.getInputElement(currentItem) : /*#__PURE__*/_react["default"].createElement("div", null, "\xA0");
        });
      }) : [item.childItems.map(function (x) {
        var currentItem = _this7.getDataById(x);
        return x && currentItem ? _this7.getInputElement(currentItem) : /*#__PURE__*/_react["default"].createElement("div", null, "\xA0");
      })];
      return /*#__PURE__*/_react["default"].createElement(Element, {
        mutable: true,
        key: "form_".concat(item.id),
        data: item,
        controls: controls
      });
    }
  }, {
    key: "getSimpleElement",
    value: function getSimpleElement(item) {
      var Element = _formElements["default"][item.element];
      return /*#__PURE__*/_react["default"].createElement(Element, {
        mutable: true,
        key: "form_".concat(item.id),
        data: item
      });
    }
  }, {
    key: "getCustomElement",
    value: function getCustomElement(item) {
      var _this8 = this;
      if (!item.component || typeof item.component !== 'function') {
        item.component = _registry["default"].get(item.key);
        if (!item.component) {
          console.error("".concat(item.element, " was not registered"));
        }
      }
      var inputProps = item.forwardRef && {
        handleChange: this.handleChange,
        defaultValue: this._getDefaultValue(item),
        ref: function ref(c) {
          return _this8.inputs[item.field_name] = c;
        }
      };
      return /*#__PURE__*/_react["default"].createElement(_customElement["default"], (0, _extends2["default"])({
        mutable: true,
        read_only: this.props.read_only,
        key: "form_".concat(item.id),
        data: item
      }, inputProps));
    }
  }, {
    key: "render",
    value: function render() {
      var _data_items,
        _this9 = this,
        _data_items2;
      var data_items = this.props.data;
      if (this.props.display_short) {
        data_items = this.props.data.filter(function (i) {
          return i.alternateForm === true;
        });
      }
      (_data_items = data_items) === null || _data_items === void 0 ? void 0 : _data_items.forEach(function (item) {
        if (item && item.readOnly && item.variableKey && _this9.props.variables[item.variableKey]) {
          _this9.state.answerData[item.field_name] = _this9.props.variables[item.variableKey];
        }
      });
      var items = (_data_items2 = data_items) === null || _data_items2 === void 0 ? void 0 : _data_items2.filter(function (x) {
        return !x.parentId;
      }).map(function (item) {
        if (!item) return null;
        switch (item.element) {
          case 'TextInput':
          case 'NumberInput':
          case 'TextArea':
          case 'Table':
          case 'Dropdown':
          case 'DatePicker':
          case 'RadioButtons':
          case 'Rating':
          case 'Tags':
          case 'FormulaInput':
          case 'Range':
            return _this9.getInputElement(item);
          case 'DataSource':
            return /*#__PURE__*/_react["default"].createElement(DataSource, {
              handleChange: _this9.handleChange,
              ref: function ref(c) {
                _this9.inputs[item.field_name] = c;
              },
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              read_only: _this9.props.read_only,
              defaultValue: _this9._getDefaultValue(item),
              editor: _this9._getEditor(item),
              getDataSource: _this9.props.getDataSource,
              getActiveUserProperties: _this9.props.getActiveUserProperties,
              emitter: _this9.emitter
            });
          case 'CustomElement':
            return _this9.getCustomElement(item);
          case 'FourColumnRow':
            return _this9.getContainerElement(item, _multiColumn.FourColumnRow);
          case 'ThreeColumnRow':
            return _this9.getContainerElement(item, _multiColumn.ThreeColumnRow);
          case 'TwoColumnRow':
            return _this9.getContainerElement(item, _multiColumn.TwoColumnRow);
          case 'DynamicColumnRow':
            return _this9.getContainerElement(item, _multiColumn.DynamicColumnRow);
          case 'Signature':
            return /*#__PURE__*/_react["default"].createElement(Signature, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item),
              editor: _this9._getEditor(item),
              getActiveUserProperties: _this9.props.getActiveUserProperties
            });
          case 'Signature2':
            return /*#__PURE__*/_react["default"].createElement(Signature2, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item),
              getActiveUserProperties: _this9.props.getActiveUserProperties,
              editor: _this9._getEditor(item)
            });
          case 'Checkboxes':
            return /*#__PURE__*/_react["default"].createElement(Checkboxes, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only,
              handleChange: _this9.handleChange,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._optionsDefaultValue(item),
              getActiveUserProperties: _this9.props.getActiveUserProperties,
              editor: _this9._getEditor(item)
            });
          case 'Image':
            return /*#__PURE__*/_react["default"].createElement(Image, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              handleChange: _this9.handleChange,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item),
              getActiveUserProperties: _this9.props.getActiveUserProperties,
              editor: _this9._getEditor(item)
            });
          case 'Download':
            return /*#__PURE__*/_react["default"].createElement(Download, {
              download_path: _this9.props.download_path,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              editor: _this9._getEditor(item),
              getActiveUserProperties: _this9.props.getActiveUserProperties
            });
          case 'Camera':
            return /*#__PURE__*/_react["default"].createElement(Camera, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item),
              editor: _this9._getEditor(item)
            });
          case 'FileUpload':
            return /*#__PURE__*/_react["default"].createElement(FileUpload, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item),
              onUploadFile: _this9.props.onUploadFile,
              onDownloadFile: _this9.props.onDownloadFile,
              editor: _this9._getEditor(item),
              getActiveUserProperties: _this9.props.getActiveUserProperties
            });
          case 'FormLink':
            return /*#__PURE__*/_react["default"].createElement(FormLink, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item),
              onUploadFile: _this9.props.onUploadFile,
              onSelectChildForm: _this9.props.onSelectChildForm,
              getFormInfo: _this9.props.getFormInfo,
              onDownloadFile: _this9.props.onDownloadFile,
              editor: _this9._getEditor(item),
              getActiveUserProperties: _this9.props.getActiveUserProperties,
              parentElementId: _this9.props.parentElementId
            });
          case 'ImageUpload':
            return /*#__PURE__*/_react["default"].createElement(ImageUpload, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item),
              onUploadImage: _this9.props.onUploadImage,
              editor: _this9._getEditor(item),
              getActiveUserProperties: _this9.props.getActiveUserProperties
            });
          default:
            return _this9.getSimpleElement(item);
        }
      });
      var formTokenStyle = {
        display: 'none'
      };
      var backName = this.props.back_name ? this.props.back_name : 'Cancel';
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_formValidator["default"], {
        emitter: this.emitter
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "react-form-builder-form"
      }, /*#__PURE__*/_react["default"].createElement("form", {
        encType: "multipart/form-data",
        ref: function ref(c) {
          return _this9.form = c;
        },
        action: this.props.form_action,
        onSubmit: this.handleSubmit.bind(this),
        method: this.props.form_method
      }, this.props.authenticity_token && /*#__PURE__*/_react["default"].createElement("div", {
        style: formTokenStyle
      }, /*#__PURE__*/_react["default"].createElement("input", {
        name: "utf8",
        type: "hidden",
        value: "\u2713"
      }), /*#__PURE__*/_react["default"].createElement("input", {
        name: "authenticity_token",
        type: "hidden",
        value: this.props.authenticity_token
      }), /*#__PURE__*/_react["default"].createElement("input", {
        name: "task_id",
        type: "hidden",
        value: this.props.task_id
      })), items, /*#__PURE__*/_react["default"].createElement("div", {
        className: "btn-toolbar"
      }, !this.props.hide_actions && this.handleRenderSubmit(), !this.props.hide_actions && this.props.back_action && /*#__PURE__*/_react["default"].createElement("a", {
        href: this.props.back_action,
        className: "btn btn-default btn-cancel btn-big"
      }, backName)))));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props) {
      var ansData = convert(props.answer_data);
      return {
        answerData: ansData,
        variables: ReactForm.prototype._getVariableValue.call({
          props: props
        }, ansData, props.data)
      };
    }
  }]);
  return ReactForm;
}(_react["default"].Component);
exports["default"] = ReactForm;
ReactForm.defaultProps = {
  validateForCorrectness: false
};