"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _hotFormulaParser = require("hot-formula-parser");
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
var _FormProvider = require("../providers/FormProvider");
var _excluded = ["data", "emitter", "formContext", "variables", "handleChange"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var FormulaInput = function FormulaInput(_ref) {
  var data = _ref.data,
    emitter = _ref.emitter,
    formContext = _ref.formContext,
    variables = _ref.variables,
    handleChange = _ref.handleChange,
    props = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
  var hookContext = (0, _FormProvider.useFormInput)();
  var context = formContext || hookContext;

  // Only require context in form generation mode (when variables are provided)
  if (!context && variables) {
    console.error('FormulaInput: FormProvider context is required for form generation');
    return null;
  }
  var _ref2 = context || {},
    setFieldValue = _ref2.setFieldValue,
    getFieldValue = _ref2.getFieldValue;
  console.log('FormulaInput context mode:', formContext ? 'generator' : 'builder', 'has context:', !!context);

  // Local state for current value and error
  var _useState = (0, _react.useState)(0),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    currentValue = _useState2[0],
    setCurrentValue = _useState2[1]; // Track current value locally
  var _useState3 = (0, _react.useState)(''),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    error = _useState4[0],
    setError = _useState4[1];
  var elementId = (data === null || data === void 0 ? void 0 : data.field_name) || "formula_".concat(data === null || data === void 0 ? void 0 : data.id);

  // Calculate formula value using variables from props
  var calculateFormula = (0, _react.useCallback)(function (currentVariables) {
    if (!(data !== null && data !== void 0 && data.formula)) return '0.00';
    try {
      var parser = new _hotFormulaParser.Parser();
      // Set variables from props (passed from form's variables state)
      Object.keys(currentVariables || {}).forEach(function (varKey) {
        var varValue = currentVariables[varKey];
        if (varValue !== undefined && varValue !== null && varValue !== '') {
          var numValue = parseFloat(varValue);
          if (!Number.isNaN(numValue)) {
            parser.setVariable(varKey, numValue);
          }
        }
      });
      var result = parser.parse(data.formula);
      if (result.error) {
        setError("Formula Error: ".concat(result.error));
        return '0.00';
      }
      setError('');
      return result.result || 0;
    } catch (err) {
      setError("Error: ".concat(err.message));
      return '0.00';
    }
  }, [data === null || data === void 0 ? void 0 : data.formula]);

  // Initialize current value from FormProvider on mount (only in generator mode)
  (0, _react.useEffect)(function () {
    if (getFieldValue) {
      var storedValue = getFieldValue(elementId);
      if (storedValue !== undefined && storedValue !== null) {
        setCurrentValue(storedValue);
      }
    }
  }, [getFieldValue, elementId]);

  // Recalculate when variables prop changes OR when formula changes
  (0, _react.useEffect)(function () {
    if (data !== null && data !== void 0 && data.formula) {
      var result = calculateFormula(variables || {});

      // Store the result in FormProvider and update local state
      var storedValue = getFieldValue(elementId);
      if (result !== storedValue) {
        setFieldValue(elementId, result);
        setCurrentValue(result);
      }
    }
  }, [data === null || data === void 0 ? void 0 : data.formula, calculateFormula, setFieldValue, elementId, getFieldValue]); // Removed variables from dependency

  // Separate effect for variables changes to avoid infinite loops
  (0, _react.useEffect)(function () {
    if (data !== null && data !== void 0 && data.formula && variables && Object.keys(variables).length > 0) {
      var result = calculateFormula(variables);

      // Use a ref to track the last calculated value to prevent loops
      var lastResult = currentValue;
      if (Math.abs(result - lastResult) > 0.0001) {
        // Use small epsilon for float comparison
        setFieldValue(elementId, result);
        setCurrentValue(result);

        // If this FormulaInput has a formularKey, emit its value as a variable for other formulas
        if (data !== null && data !== void 0 && data.formularKey && handleChange) {
          setTimeout(function () {
            handleChange(data.formularKey, result);
          }, 50);
        }
      }
    } else {
      console.log('FormulaInput Debug - Skipping calculation - no formula or empty variables');
    }
  }, [variables, data === null || data === void 0 ? void 0 : data.formula, data === null || data === void 0 ? void 0 : data.formularKey, calculateFormula, elementId, setFieldValue, handleChange, currentValue]);

  // Format number for display
  var formatNumber = function formatNumber(num) {
    if (num === '' || num === null || num === undefined || Number.isNaN(num)) {
      return '0.00';
    }
    var numValue = parseFloat(num);
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Remove the duplicate currentValue declaration
  var baseClasses = "".concat(data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], (0, _extends2["default"])({
    data: data
  }, props)), /*#__PURE__*/_react["default"].createElement("div", {
    className: data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({
    data: data
  }, props)), /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    className: "form-control ".concat(error ? 'is-invalid' : ''),
    name: data === null || data === void 0 ? void 0 : data.field_name,
    value: formatNumber(currentValue),
    disabled: true,
    readOnly: true
  }), error && /*#__PURE__*/_react["default"].createElement("div", {
    className: "invalid-feedback"
  }, error), (data === null || data === void 0 ? void 0 : data.formula) && /*#__PURE__*/_react["default"].createElement("small", {
    className: "form-text text-muted"
  }, "Formula: ".concat(data.formula))));
};
FormulaInput.propTypes = {
  data: _propTypes["default"].shape({
    id: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
    label: _propTypes["default"].string,
    formula: _propTypes["default"].string.isRequired,
    formularKey: _propTypes["default"].string,
    field_name: _propTypes["default"].string,
    pageBreakBefore: _propTypes["default"].bool,
    isShowLabel: _propTypes["default"].bool
  }).isRequired,
  emitter: _propTypes["default"].shape({
    addListener: _propTypes["default"].func
  }),
  formContext: _propTypes["default"].shape({
    setFieldValue: _propTypes["default"].func,
    getFieldValue: _propTypes["default"].func,
    values: _propTypes["default"].objectOf(_propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number, _propTypes["default"].bool, _propTypes["default"].array]))
  }),
  variables: _propTypes["default"].objectOf(_propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])),
  handleChange: _propTypes["default"].func
};
FormulaInput.defaultProps = {
  emitter: null,
  formContext: null,
  variables: {},
  handleChange: null
};
var _default = FormulaInput;
exports["default"] = _default;