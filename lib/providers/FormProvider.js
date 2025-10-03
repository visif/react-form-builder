"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof3 = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormStore = exports.useFormInput = exports.FormProvider = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var SET_FIELD_VALUE = 'SET_FIELD_VALUE';
var SET_MULTIPLE_VALUES = 'SET_MULTIPLE_VALUES';
var RESET_FORM = 'RESET_FORM';
var TOGGLE_CHECKBOX = 'TOGGLE_CHECKBOX';
var SET_CHECKBOX_VALUES = 'SET_CHECKBOX_VALUES';
var SET_FIELD_METADATA = 'SET_FIELD_METADATA';
var SET_VALIDATION_ERROR = 'SET_VALIDATION_ERROR';
var CLEAR_VALIDATION_ERROR = 'CLEAR_VALIDATION_ERROR';
var REMOVE_FIELD = 'REMOVE_FIELD';

// Helper functions for immutable array operations
var toggleArrayValue = function toggleArrayValue() {
  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var value = arguments.length > 1 ? arguments[1] : undefined;
  var newArray = (0, _toConsumableArray2["default"])(Array.isArray(array) ? array : []);
  var index = newArray.findIndex(function (item) {
    return (0, _typeof2["default"])(item) === 'object' ? item.value === value : item === value;
  });
  if (index === -1) {
    newArray.push(value);
  } else {
    newArray.splice(index, 1);
  }
  return newArray;
};
var ensureArray = function ensureArray(value) {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

// Reducer to handle form state updates
var formReducer = function formReducer(state, action) {
  switch (action.type) {
    case SET_FIELD_VALUE:
      {
        var newState = _objectSpread(_objectSpread({}, state), {}, {
          values: _objectSpread(_objectSpread({}, state.values), {}, (0, _defineProperty2["default"])({}, action.field, action.value))
        });
        console.log('FormProvider reducer SET_FIELD_VALUE - new state:', newState.values);
        return newState;
      }
    case SET_MULTIPLE_VALUES:
      {
        // Handle both array and single values for each field
        var processedValues = Object.entries(action.values).reduce(function (acc, _ref) {
          var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];
          // If the current field already has an array value, preserve array nature
          var isCurrentArray = Array.isArray(state.values[key]);
          acc[key] = isCurrentArray ? ensureArray(value) : value;
          return acc;
        }, {});
        return _objectSpread(_objectSpread({}, state), {}, {
          values: _objectSpread(_objectSpread({}, state.values), processedValues)
        });
      }
    case TOGGLE_CHECKBOX:
      return _objectSpread(_objectSpread({}, state), {}, {
        values: _objectSpread(_objectSpread({}, state.values), {}, (0, _defineProperty2["default"])({}, action.field, toggleArrayValue(state.values[action.field], action.value)))
      });
    case SET_CHECKBOX_VALUES:
      return _objectSpread(_objectSpread({}, state), {}, {
        values: _objectSpread(_objectSpread({}, state.values), {}, (0, _defineProperty2["default"])({}, action.field, ensureArray(action.values)))
      });
    case SET_FIELD_METADATA:
      return _objectSpread(_objectSpread({}, state), {}, {
        metadata: _objectSpread(_objectSpread({}, state.metadata), {}, (0, _defineProperty2["default"])({}, action.field, _objectSpread(_objectSpread({}, state.metadata[action.field]), action.metadata)))
      });
    case SET_VALIDATION_ERROR:
      return _objectSpread(_objectSpread({}, state), {}, {
        validationErrors: _objectSpread(_objectSpread({}, state.validationErrors), {}, (0, _defineProperty2["default"])({}, action.field, action.error))
      });
    case CLEAR_VALIDATION_ERROR:
      {
        var newErrors = _objectSpread({}, state.validationErrors);
        delete newErrors[action.field];
        return _objectSpread(_objectSpread({}, state), {}, {
          validationErrors: newErrors
        });
      }
    case REMOVE_FIELD:
      {
        var _newState = _objectSpread({}, state);
        delete _newState.values[action.field];
        delete _newState.metadata[action.field];
        delete _newState.validationErrors[action.field];
        return _newState;
      }
    case RESET_FORM:
      return {
        values: action.initialValues || {},
        metadata: {},
        validationErrors: {}
      };
    default:
      return state;
  }
};

// Create context with a default value
var FormContext = /*#__PURE__*/(0, _react.createContext)({
  values: {},
  metadata: {},
  validationErrors: {},
  setFieldValue: function setFieldValue() {},
  setMultipleValues: function setMultipleValues() {},
  toggleCheckbox: function toggleCheckbox() {},
  setCheckboxValues: function setCheckboxValues() {},
  resetForm: function resetForm() {},
  getFieldValue: function getFieldValue() {},
  setFieldMetadata: function setFieldMetadata() {},
  getFieldMetadata: function getFieldMetadata() {},
  setValidationError: function setValidationError() {},
  clearValidationError: function clearValidationError() {},
  removeField: function removeField() {},
  validateField: function validateField() {},
  validateAllFields: function validateAllFields() {},
  getFieldsByType: function getFieldsByType() {}
});

// Form provider component
var FormProvider = function FormProvider(_ref3) {
  var children = _ref3.children,
    _ref3$initialValues = _ref3.initialValues,
    initialValues = _ref3$initialValues === void 0 ? {} : _ref3$initialValues,
    _ref3$initialMetadata = _ref3.initialMetadata,
    initialMetadata = _ref3$initialMetadata === void 0 ? {} : _ref3$initialMetadata;
  var _useReducer = (0, _react.useReducer)(formReducer, {
      values: initialValues,
      metadata: initialMetadata,
      validationErrors: {}
    }),
    _useReducer2 = (0, _slicedToArray2["default"])(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];
  var setFieldValue = (0, _react.useCallback)(function (field, value) {
    console.log('FormProvider setFieldValue called - field:', field, 'value:', value);
    dispatch({
      type: SET_FIELD_VALUE,
      field: field,
      value: value
    });
  }, []);
  var setMultipleValues = (0, _react.useCallback)(function (values) {
    dispatch({
      type: SET_MULTIPLE_VALUES,
      values: values
    });
  }, []);
  var toggleCheckbox = (0, _react.useCallback)(function (field, value) {
    dispatch({
      type: TOGGLE_CHECKBOX,
      field: field,
      value: value
    });
  }, []);
  var setCheckboxValues = (0, _react.useCallback)(function (field, values) {
    dispatch({
      type: SET_CHECKBOX_VALUES,
      field: field,
      values: values
    });
  }, []);
  var resetForm = (0, _react.useCallback)(function (newInitialValues) {
    dispatch({
      type: RESET_FORM,
      initialValues: newInitialValues
    });
  }, []);
  var getFieldValue = (0, _react.useCallback)(function (field) {
    return state.values[field];
  }, [state.values]);
  var setFieldMetadata = (0, _react.useCallback)(function (field, metadata) {
    dispatch({
      type: SET_FIELD_METADATA,
      field: field,
      metadata: metadata
    });
  }, []);
  var getFieldMetadata = (0, _react.useCallback)(function (field) {
    return state.metadata[field];
  }, [state.metadata]);
  var setValidationError = (0, _react.useCallback)(function (field, error) {
    dispatch({
      type: SET_VALIDATION_ERROR,
      field: field,
      error: error
    });
  }, []);
  var clearValidationError = (0, _react.useCallback)(function (field) {
    dispatch({
      type: CLEAR_VALIDATION_ERROR,
      field: field
    });
  }, []);
  var removeField = (0, _react.useCallback)(function (field) {
    dispatch({
      type: REMOVE_FIELD,
      field: field
    });
  }, []);
  var validateField = (0, _react.useCallback)(function (field) {
    var metadata = state.metadata[field];
    var value = state.values[field];
    if (!metadata) return {
      isValid: true,
      error: null
    };
    if (metadata.required && (!value || value === '' || value === null || value === undefined)) {
      var error = "".concat(metadata.label || metadata.element || field, " is required");
      setValidationError(field, error);
      return {
        isValid: false,
        error: error
      };
    }
    switch (metadata.element) {
      case 'Email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          var _error = "".concat(metadata.label || 'Email', " must be a valid email address");
          setValidationError(field, _error);
          return {
            isValid: false,
            error: _error
          };
        }
        break;
      case 'NumberInput':
        if (value && Number.isNaN(Number(value))) {
          var _error2 = "".concat(metadata.label || 'Number', " must be a valid number");
          setValidationError(field, _error2);
          return {
            isValid: false,
            error: _error2
          };
        }
        break;
      case 'PhoneNumber':
        if (value && !/^\+?[\d\s\-()]+$/.test(value)) {
          var _error3 = "".concat(metadata.label || 'Phone Number', " must be a valid phone number");
          setValidationError(field, _error3);
          return {
            isValid: false,
            error: _error3
          };
        }
        break;
      default:
        break;
    }
    clearValidationError(field);
    return {
      isValid: true,
      error: null
    };
  }, [state.values, state.metadata, setValidationError, clearValidationError]);
  var validateAllFields = (0, _react.useCallback)(function () {
    var errors = {};
    var isFormValid = true;
    Object.keys(state.metadata).forEach(function (field) {
      var validation = validateField(field);
      if (!validation.isValid) {
        errors[field] = validation.error;
        isFormValid = false;
      }
    });
    return {
      isValid: isFormValid,
      errors: errors
    };
  }, [state.metadata, validateField]);
  var getFieldsByType = (0, _react.useCallback)(function (elementType) {
    return Object.keys(state.metadata).filter(function (field) {
      return state.metadata[field].element === elementType;
    }).reduce(function (acc, field) {
      acc[field] = {
        value: state.values[field],
        metadata: state.metadata[field]
      };
      return acc;
    }, {});
  }, [state.values, state.metadata]);
  var value = (0, _react.useMemo)(function () {
    return {
      // Core state
      values: state.values,
      metadata: state.metadata,
      validationErrors: state.validationErrors,
      // Primary FormProvider methods
      setFieldValue: setFieldValue,
      setMultipleValues: setMultipleValues,
      toggleCheckbox: toggleCheckbox,
      setCheckboxValues: setCheckboxValues,
      resetForm: resetForm,
      getFieldValue: getFieldValue,
      setFieldMetadata: setFieldMetadata,
      getFieldMetadata: getFieldMetadata,
      setValidationError: setValidationError,
      clearValidationError: clearValidationError,
      removeField: removeField,
      validateField: validateField,
      validateAllFields: validateAllFields,
      getFieldsByType: getFieldsByType
    };
  }, [state.values, state.metadata, state.validationErrors, setFieldValue, setMultipleValues, toggleCheckbox, setCheckboxValues, resetForm, getFieldValue, setFieldMetadata, getFieldMetadata, setValidationError, clearValidationError, removeField, validateField, validateAllFields, getFieldsByType]);
  return /*#__PURE__*/_react["default"].createElement(FormContext.Provider, {
    value: value
  }, children);
};
exports.FormProvider = FormProvider;
FormProvider.propTypes = {
  children: _propTypes["default"].node.isRequired,
  initialValues: _propTypes["default"].objectOf(_propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number, _propTypes["default"].bool, _propTypes["default"].array])),
  initialMetadata: _propTypes["default"].objectOf(_propTypes["default"].shape({
    element: _propTypes["default"].string,
    label: _propTypes["default"].string,
    required: _propTypes["default"].bool
  }))
};
FormProvider.defaultProps = {
  initialValues: {},
  initialMetadata: {}
};

// Custom hook to use form context
var useFormStore = function useFormStore() {
  var context = (0, _react.useContext)(FormContext);
  if (!context) {
    throw new Error('useFormStore must be used within a FormProvider');
  }
  return context;
};

// Alias for backward compatibility
exports.useFormStore = useFormStore;
var useFormInput = useFormStore;
exports.useFormInput = useFormInput;