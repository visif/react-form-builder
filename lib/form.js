"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _fbemitter = require("fbemitter");
var _hotFormulaParser = require("hot-formula-parser");
var _formElements = _interopRequireDefault(require("./form-elements"));
var _customElement = _interopRequireDefault(require("./form-elements/custom-element"));
var _formValidator = _interopRequireDefault(require("./form-validator"));
var _multiColumn = require("./multi-column");
var _registry = _interopRequireDefault(require("./stores/registry"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /**
 * <Form Generator/>
 */
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
var DRAFT_AUTOSAVE_INTERVAL = 30 * 1000; // 30 seconds

var buildDraftStorageKey = function buildDraftStorageKey(props) {
  if (props.draftStorageKey) {
    return props.draftStorageKey;
  }
  var parts = ['rfb_draft'];

  // Include user id when available for per-user scoping
  if (props.draftStorageUserId) {
    parts.push(props.draftStorageUserId);
  } else if (typeof props.getActiveUserProperties === 'function') {
    try {
      var user = props.getActiveUserProperties();
      if (user && user.userId) {
        parts.push(user.userId);
      }
    } catch (_) {/* ignore */}
  }
  if (props.parentElementId) {
    parts.push(props.parentElementId);
  } else if (props.form_action) {
    parts.push(props.form_action);
  }
  if (props.task_id) {
    parts.push(props.task_id);
  }
  if (props.form_rev_id) {
    parts.push(props.form_rev_id);
  }
  if (!props.parentElementId && !props.form_action && !props.task_id && !props.form_rev_id) {
    parts.push('default');
  }
  return parts.join(':');
};
var readDraftFromStorage = function readDraftFromStorage(props) {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    var raw = window.localStorage.getItem(buildDraftStorageKey(props));
    if (!raw) return null;
    var parsed = JSON.parse(raw);
    if (!parsed || (0, _typeof2["default"])(parsed) !== 'object') return null;
    // Treat an empty object as no draft
    if (Object.keys(parsed).length === 0) return null;
    return parsed;
  } catch (_) {
    return null;
  }
};
var ReactForm = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function ReactForm(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, ReactForm);
    _this = _callSuper(this, ReactForm, [props]);
    (0, _defineProperty2["default"])(_this, "form", void 0);
    (0, _defineProperty2["default"])(_this, "inputs", {});
    (0, _defineProperty2["default"])(_this, "_draftInterval", null);
    (0, _defineProperty2["default"])(_this, "_draftCleared", false);
    (0, _defineProperty2["default"])(_this, "_draftStarted", false);
    (0, _defineProperty2["default"])(_this, "handleChange", function (propKey, value) {
      _this.emitter.emit('variableChange', {
        propKey: propKey,
        value: value
      });
    });
    (0, _defineProperty2["default"])(_this, "_handleFormInteraction", function () {
      // Start autosave on the very first user interaction
      if (!_this._draftStarted) {
        _this._startDraftAutosave();
      }
    });
    // Signature2 uses click (not change/input), so draft would otherwise never
    // start — and even after start, the next interval save is up to 30s later.
    (0, _defineProperty2["default"])(_this, "_handleSignature2Change", function () {
      _this._handleFormInteraction();
      _this._saveDraft();
    });
    /**
     * Public method – can be called via a ref from the parent app:
     *   formRef.current.clearDraft()
     */
    (0, _defineProperty2["default"])(_this, "clearDraft", function () {
      _this._clearDraft();
    });
    /**
     * Public method – flush current field values to localStorage without submitting.
     * Used when the user leaves via "Don't Save" but still wants a recoverable draft.
     */
    (0, _defineProperty2["default"])(_this, "saveDraft", function () {
      if (_this.props.read_only) return;
      _this._draftCleared = false;
      if (!_this._draftStarted) {
        _this._draftStarted = true;
        _this._draftInterval = setInterval(function () {
          _this._saveDraft();
        }, DRAFT_AUTOSAVE_INTERVAL);
      }
      _this._saveDraft();
    });
    (0, _defineProperty2["default"])(_this, "handleClearDraft", function () {
      _this._clearDraft();
    });
    (0, _defineProperty2["default"])(_this, "handleVariableChange", function (params) {
      // Update the form's variables state when any variable changes
      _this.setState(function (prevState) {
        var newVariables = _objectSpread(_objectSpread({}, prevState.variables), {}, (0, _defineProperty2["default"])({}, params.propKey, params.value));
        var newAnswerData = _objectSpread({}, prevState.answerData);

        // Get all formula fields for cascading updates
        var allFormulaFields = _this.props.data.filter(function (item) {
          return item.element === 'FormulaInput' && item.formula;
        });

        // Keep track of which variables have been updated to detect cascading changes
        var updatedVariables = new Set([params.propKey]);
        var hasChanges = true;

        // Continue recalculating until no more changes occur (cascading updates)
        while (hasChanges) {
          hasChanges = false;

          // Find formula fields that depend on any recently updated variables
          var affectedFields = allFormulaFields.filter(function (formulaField) {
            return Array.from(updatedVariables).some(function (varKey) {
              return formulaField.formula.includes(varKey);
            });
          });

          // Clear the updated variables set for this iteration
          updatedVariables.clear();
          affectedFields.forEach(function (formulaField) {
            try {
              // Use same formula parsing logic as FormulaInput component
              var parser = new _hotFormulaParser.Parser();

              // Set all current variables in parser
              Object.entries(newVariables).forEach(function (_ref) {
                var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
                  key = _ref2[0],
                  value = _ref2[1];
                var parsedValue = parseFloat(value);
                if (!Number.isNaN(parsedValue)) {
                  parser.setVariable(key, parsedValue);
                }
              });

              // Calculate new formula result
              var parseResult = parser.parse(formulaField.formula);
              var newValue = (parseResult === null || parseResult === void 0 ? void 0 : parseResult.result) || 0;

              // Update the answer data for this formula field
              newAnswerData[formulaField.field_name] = {
                formula: formulaField.formula,
                value: newValue,
                variables: newVariables
              };

              // If this formula field has a formularKey, update variables with its new value
              if (formulaField.formularKey) {
                var oldValue = newVariables[formulaField.formularKey];
                var valueChanged = Math.abs((oldValue || 0) - newValue) > 0.0001;
                if (valueChanged) {
                  newVariables[formulaField.formularKey] = newValue;
                  updatedVariables.add(formulaField.formularKey);
                  hasChanges = true;
                }
              }
            } catch (error) {
              console.warn("Error calculating formula for ".concat(formulaField.field_name, ":"), error);
            }
          });
        }
        return {
          variables: newVariables,
          answerData: newAnswerData
        };
      });
    });
    (0, _defineProperty2["default"])(_this, "handleRenderSubmit", function () {
      var _this$props = _this.props,
        _this$props$actionNam = _this$props.actionName,
        actionName = _this$props$actionNam === void 0 ? 'Submit' : _this$props$actionNam,
        _this$props$submitBut = _this$props.submitButton,
        submitButton = _this$props$submitBut === void 0 ? false : _this$props$submitBut;
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, submitButton || /*#__PURE__*/_react["default"].createElement("input", {
        type: "submit",
        className: "btn btn-big",
        value: actionName
      }), !_this.props.read_only && /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        className: "btn btn-default btn-big",
        style: {
          marginLeft: '10px'
        },
        onClick: _this.handleClearDraft
      }, "Clear Draft"));
    });
    _this.emitter = new _fbemitter.EventEmitter();
    _this.getDataById = _this.getDataById.bind(_this);
    _this.handleVariableChange = _this.handleVariableChange.bind(_this);
    var ansData = convert(props.answer_data);
    var draft = readDraftFromStorage(props);
    var mergedData = draft ? _objectSpread(_objectSpread({}, ansData), draft) : ansData;
    _this.state = {
      answerData: mergedData,
      variables: _this._getVariableValue(mergedData, props.data),
      draftRestored: !!draft
    };
    return _this;
  }
  (0, _inherits2["default"])(ReactForm, _React$Component);
  return (0, _createClass2["default"])(ReactForm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Listen to variable changes to update the form's variables state
      if (this.emitter && typeof this.emitter.addListener === 'function') {
        this.variableSubscription = this.emitter.addListener('variableChange', this.handleVariableChange);
      }

      // Draft autosave is NOT started here.
      // It starts lazily on the first user interaction (see _handleFormInteraction).
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this._draftInterval) {
        clearInterval(this._draftInterval);
        this._draftInterval = null;
      }
      // Save one last time before unmounting so partial work is not lost
      if (!this.props.read_only && !this._draftCleared && this._draftStarted) {
        this._saveDraft();
      }
      if (this.variableSubscription && typeof this.variableSubscription.remove === 'function') {
        this.variableSubscription.remove();
      }
    }
  }, {
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
            if ((0, _typeof2["default"])(firstItem) === 'object' && firstItem !== null && firstItem.hasOwnProperty('value') && typeof firstItem.value === 'boolean') {
              // Find the item in the items array that matches the field_name
              var matchedItem = items.find(function (target) {
                return target.field_name === item.field_name;
              });
              if (matchedItem && matchedItem.options) {
                // Find the option where the key matches the firstItem value
                var matchedOption = matchedItem.options.find(function (option) {
                  return option.key === firstItem.key;
                });
                if (matchedOption) {
                  value = matchedOption.value || matchedOption.text || firstItem.value;
                } else {
                  value = firstItem.value;
                }
              } else {
                value = firstItem.value;
              }
            } else {
              value = firstItem.value;
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
      } else if (item.element === 'Dropdown') {
        $item.value = ref.state.value;
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
      if ((item.element === 'Checkboxes' || item.element === 'RadioButtons') && !!ref) {
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
        itemData.editor = (checked_options === null || checked_options === void 0 ? void 0 : checked_options.length) <= 0 ? null : oldEditor ? oldEditor : activeUser || null;
      } else if (item.element === 'Dropdown') {
        if (!ref) {
          return null;
        }
        var valueItem = this._getItemValue(item, ref);
        var selectedOption = item.options.find(function (option) {
          return option.value === valueItem.value;
        });
        var info = '';
        if (selectedOption && selectedOption.info && ref.infoField && ref.infoField.current) {
          var _$info$value2;
          var $info = _reactDom["default"].findDOMNode(ref.infoField.current);
          info = (_$info$value2 = $info === null || $info === void 0 ? void 0 : $info.value) !== null && _$info$value2 !== void 0 ? _$info$value2 : '';
        }
        itemData.value = {
          value: valueItem.value,
          info: info
        };
        itemData.editor = oldEditor ? oldEditor : valueItem.value ? activeUser : null;
      } else {
        if (!ref) {
          return null;
        }
        var _valueItem = this._getItemValue(item, ref);
        itemData.value = _valueItem.value;
        itemData.editor = oldEditor ? oldEditor : _valueItem.value ? activeUser : null;
        if (item.element === 'Signature2') {
          itemData.editor = oldEditor ? oldEditor : _valueItem.value.isSigned ? activeUser : null;
        } else if (item.element === 'DataSource' && ref.state.searchText) {
          itemData.editor = oldEditor ? oldEditor : _valueItem.value.value ? activeUser : null;
        } else if (item.element === 'FileUpload') {
          itemData.editor = oldEditor ? oldEditor : _valueItem.value.fileList && _valueItem.value.fileList.length > 0 ? activeUser : null;
        } else if (item.element === 'ImageUpload') {
          itemData.editor = oldEditor ? oldEditor : _valueItem.value.filePath ? activeUser : null;
        } else if (item.element === 'Table') {
          itemData.editor = oldEditor ? oldEditor : _valueItem.value.find(function (itemRow) {
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
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
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
          this._clearDraft();
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
          this._clearDraft();
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
    key: "_startDraftAutosave",
    value:
    // ─── Draft persistence helpers ────────────────────────────────────────

    function _startDraftAutosave() {
      var _this6 = this;
      if (this._draftStarted || this._draftCleared || this.props.read_only) return;
      this._draftStarted = true;
      this._draftInterval = setInterval(function () {
        _this6._saveDraft();
      }, DRAFT_AUTOSAVE_INTERVAL);
    }
  }, {
    key: "_getDraftStorageKey",
    value: function _getDraftStorageKey() {
      return buildDraftStorageKey(this.props);
    }
  }, {
    key: "_saveDraft",
    value: function _saveDraft() {
      if (typeof window === 'undefined' || !window.localStorage) return;
      try {
        var formData = this._collectFormData(this.props.data);
        var draft = convert(formData);
        window.localStorage.setItem(this._getDraftStorageKey(), JSON.stringify(draft));
      } catch (_) {
        // Ignore quota / security errors
      }
    }
  }, {
    key: "_clearDraft",
    value: function _clearDraft() {
      if (typeof window === 'undefined' || !window.localStorage) return;
      try {
        window.localStorage.removeItem(this._getDraftStorageKey());
      } catch (_) {
        // Ignore
      }

      // Stop the autosave interval so it won't re-save the draft
      if (this._draftInterval) {
        clearInterval(this._draftInterval);
        this._draftInterval = null;
      }
      this._draftCleared = true;

      // Reset form state back to original answer_data (without draft)
      var ansData = convert(this.props.answer_data);
      this.setState({
        draftRestored: false,
        answerData: ansData,
        variables: this._getVariableValue(ansData, this.props.data)
      });
    }
  }, {
    key: "getInputElement",
    value: function getInputElement(item) {
      var _this7 = this;
      if (item.custom) {
        return this.getCustomElement(item);
      }
      var Input = _formElements["default"][item.element];
      return /*#__PURE__*/_react["default"].createElement(Input, {
        handleChange: this.handleChange,
        onSignChange: this._handleSignature2Change,
        ref: function ref(c) {
          _this7.inputs[item.field_name] = c;
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
        getFormInfo: this.props.getFormInfo,
        onSelectChildForm: this.props.onSelectChildForm,
        openLinkedForm: this.props.openLinkedForm,
        broadcastChange: this.broadcastChange,
        emitter: this.emitter,
        variables: this.state.variables
      });
    }
  }, {
    key: "getContainerElement",
    value: function getContainerElement(item, Element) {
      var _this8 = this;
      var controls = Array.isArray(item.childItems[0]) ? item.childItems.map(function (row) {
        return row.map(function (x) {
          var currentItem = _this8.getDataById(x);
          return x && currentItem ? _this8.getInputElement(currentItem) : /*#__PURE__*/_react["default"].createElement("div", null, "\xA0");
        });
      }) : [item.childItems.map(function (x) {
        var currentItem = _this8.getDataById(x);
        return x && currentItem ? _this8.getInputElement(currentItem) : /*#__PURE__*/_react["default"].createElement("div", null, "\xA0");
      })];
      return /*#__PURE__*/_react["default"].createElement(Element, {
        mutable: true,
        key: "form_".concat(item.id),
        data: item,
        controls: controls,
        getFormInfo: this.props.getFormInfo,
        getFormSource: this.props.getFormSource,
        onSelectChildForm: this.props.onSelectChildForm,
        openLinkedForm: this.props.openLinkedForm,
        getActiveUserProperties: this.props.getActiveUserProperties
      });
    }
  }, {
    key: "getSimpleElement",
    value: function getSimpleElement(item) {
      var Element = _formElements["default"][item.element];
      return /*#__PURE__*/_react["default"].createElement(Element, {
        mutable: true,
        key: "form_".concat(item.id),
        data: item,
        generateSectionID: this.props.generateSectionID
      });
    }
  }, {
    key: "getCustomElement",
    value: function getCustomElement(item) {
      var _this9 = this;
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
          return _this9.inputs[item.field_name] = c;
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
        _this0 = this,
        _data_items2;
      var data_items = this.props.data;
      if (this.props.display_short) {
        data_items = this.props.data.filter(function (i) {
          return i.alternateForm === true;
        });
      }
      (_data_items = data_items) === null || _data_items === void 0 || _data_items.forEach(function (item) {
        if (item && item.readOnly && item.variableKey && _this0.props.variables[item.variableKey]) {
          _this0.state.answerData[item.field_name] = _this0.props.variables[item.variableKey];
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
            return _this0.getInputElement(item);
          case 'DataSource':
            return /*#__PURE__*/_react["default"].createElement(DataSource, {
              handleChange: _this0.handleChange,
              ref: function ref(c) {
                _this0.inputs[item.field_name] = c;
              },
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              read_only: _this0.props.read_only,
              defaultValue: _this0._getDefaultValue(item),
              editor: _this0._getEditor(item),
              getDataSource: _this0.props.getDataSource,
              getActiveUserProperties: _this0.props.getActiveUserProperties,
              emitter: _this0.emitter
            });
          case 'CustomElement':
            return _this0.getCustomElement(item);
          case 'FourColumnRow':
            return _this0.getContainerElement(item, _multiColumn.FourColumnRow);
          case 'ThreeColumnRow':
            return _this0.getContainerElement(item, _multiColumn.ThreeColumnRow);
          case 'TwoColumnRow':
            return _this0.getContainerElement(item, _multiColumn.TwoColumnRow);
          case 'DynamicColumnRow':
            return _this0.getContainerElement(item, _multiColumn.DynamicColumnRow);
          case 'Signature':
            return /*#__PURE__*/_react["default"].createElement(Signature, {
              ref: function ref(c) {
                return _this0.inputs[item.field_name] = c;
              },
              read_only: _this0.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this0._getDefaultValue(item),
              editor: _this0._getEditor(item),
              getActiveUserProperties: _this0.props.getActiveUserProperties
            });
          case 'Signature2':
            return /*#__PURE__*/_react["default"].createElement(Signature2, {
              ref: function ref(c) {
                return _this0.inputs[item.field_name] = c;
              },
              read_only: _this0.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this0._getDefaultValue(item),
              getActiveUserProperties: _this0.props.getActiveUserProperties,
              editor: _this0._getEditor(item),
              onSignChange: _this0._handleSignature2Change
            });
          case 'Checkboxes':
            return /*#__PURE__*/_react["default"].createElement(Checkboxes, {
              ref: function ref(c) {
                return _this0.inputs[item.field_name] = c;
              },
              read_only: _this0.props.read_only,
              handleChange: _this0.handleChange,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this0._optionsDefaultValue(item),
              getActiveUserProperties: _this0.props.getActiveUserProperties,
              editor: _this0._getEditor(item)
            });
          case 'Image':
            return /*#__PURE__*/_react["default"].createElement(Image, {
              ref: function ref(c) {
                return _this0.inputs[item.field_name] = c;
              },
              handleChange: _this0.handleChange,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this0._getDefaultValue(item),
              getActiveUserProperties: _this0.props.getActiveUserProperties,
              editor: _this0._getEditor(item)
            });
          case 'Download':
            return /*#__PURE__*/_react["default"].createElement(Download, {
              download_path: _this0.props.download_path,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              editor: _this0._getEditor(item),
              getActiveUserProperties: _this0.props.getActiveUserProperties
            });
          case 'Camera':
            return /*#__PURE__*/_react["default"].createElement(Camera, {
              ref: function ref(c) {
                return _this0.inputs[item.field_name] = c;
              },
              read_only: _this0.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this0._getDefaultValue(item),
              editor: _this0._getEditor(item)
            });
          case 'FileUpload':
            return /*#__PURE__*/_react["default"].createElement(FileUpload, {
              ref: function ref(c) {
                return _this0.inputs[item.field_name] = c;
              },
              read_only: _this0.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this0._getDefaultValue(item),
              onUploadFile: _this0.props.onUploadFile,
              onDownloadFile: _this0.props.onDownloadFile,
              editor: _this0._getEditor(item),
              getActiveUserProperties: _this0.props.getActiveUserProperties
            });
          case 'FormLink':
            return /*#__PURE__*/_react["default"].createElement(FormLink, {
              ref: function ref(c) {
                return _this0.inputs[item.field_name] = c;
              },
              read_only: _this0.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this0._getDefaultValue(item),
              onUploadFile: _this0.props.onUploadFile,
              onSelectChildForm: _this0.props.onSelectChildForm,
              getFormInfo: _this0.props.getFormInfo,
              onDownloadFile: _this0.props.onDownloadFile,
              editor: _this0._getEditor(item),
              getActiveUserProperties: _this0.props.getActiveUserProperties,
              parentElementId: _this0.props.parentElementId
            });
          case 'ImageUpload':
            return /*#__PURE__*/_react["default"].createElement(ImageUpload, {
              ref: function ref(c) {
                return _this0.inputs[item.field_name] = c;
              },
              read_only: _this0.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this0._getDefaultValue(item),
              onUploadImage: _this0.props.onUploadImage,
              editor: _this0._getEditor(item),
              getActiveUserProperties: _this0.props.getActiveUserProperties
            });
          default:
            return _this0.getSimpleElement(item);
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
      }, this.state.draftRestored && !this.props.read_only && /*#__PURE__*/_react["default"].createElement("div", {
        className: "alert alert-info",
        style: {
          marginBottom: '10px'
        }
      }, "Your previous draft has been restored."), /*#__PURE__*/_react["default"].createElement("form", {
        encType: "multipart/form-data",
        ref: function ref(c) {
          return _this0.form = c;
        },
        action: this.props.form_action,
        onSubmit: this.handleSubmit.bind(this),
        onChange: this._handleFormInteraction,
        onInput: this._handleFormInteraction,
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
      var draft = readDraftFromStorage(props);
      var mergedData = draft ? _objectSpread(_objectSpread({}, ansData), draft) : ansData;
      return {
        answerData: mergedData,
        variables: ReactForm.prototype._getVariableValue.call({
          props: props
        }, mergedData, props.data),
        draftRestored: !!draft
      };
    }
  }, {
    key: "clearDraftData",
    value:
    /**
     * Static helper so external code can clear a draft without a ref:
     *   ReactFormGenerator.clearDraftData({ form_action: '/api/form', ... })
     */
    function clearDraftData(props) {
      if (typeof window === 'undefined' || !window.localStorage) return;
      try {
        var key = buildDraftStorageKey(props);
        window.localStorage.removeItem(key);
      } catch (_) {
        // Ignore
      }
    }

    /**
     * Static helper to check if a draft exists:
     *   ReactFormGenerator.hasDraft({ form_action: '/api/form', ... })
     */
  }, {
    key: "hasDraft",
    value: function hasDraft(props) {
      return readDraftFromStorage(props) !== null;
    }
  }]);
}(_react["default"].Component);
ReactForm.defaultProps = {
  validateForCorrectness: false
};