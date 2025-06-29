"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Checkboxes = forwardRef(function (props, _ref) {
  var _useFormContext = useFormContext(),
    dispatch = _useFormContext.dispatch;
  var _useState = useState(props.defaultValue),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  var infos = {};
  var getActiveValue = function getActiveValue(values, key) {
    var _values$value;
    return values === null || values === void 0 ? void 0 : (_values$value = values.value) === null || _values$value === void 0 ? void 0 : _values$value.find(function (item) {
      return item.key === key;
    });
  };
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var classNames = 'custom-control custom-checkbox';
  if (props.data.inline) {
    classNames += ' option-inline';
  }
  var baseClasses = 'SortableItem rfb-item';
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  var handleChange = function handleChange(option) {
    if (isSameEditor) {
      var newVal;
      setValue(function (current) {
        var activeVal = getActiveValue(current && current.value, option.key);
        var newActiveVal = activeVal ? _objectSpread(_objectSpread({}, activeVal), {}, {
          value: !activeVal.value
        }) : {
          key: option.key,
          value: true,
          info: ''
        };
        if (!current) {
          newVal = current;
          return current;
        }
        newVal = _objectSpread(_objectSpread({}, current), {}, {
          value: [].concat((0, _toConsumableArray2.default)((current.value || []).filter(function (item) {
            return item.key !== option.key;
          })), [newActiveVal])
        });
        return newVal;
      });
      dispatch({
        type: FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: newVal
      });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/React.createElement(ComponentHeader, props), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement(ComponentLabel, (0, _extends2.default)({
    className: "form-label"
  }, props)), props.data.options.map(function (option) {
    var _answerItem$info;
    var this_key = "preview_".concat(option.key);
    var inputProps = {
      name: "option_".concat(option.key),
      type: 'checkbox',
      value: option.value
    };
    var answerItem = getActiveValue(value, option.key);
    if (props.mutable) {
      var _answerItem$value;
      inputProps.checked = (_answerItem$value = answerItem === null || answerItem === void 0 ? void 0 : answerItem.value) !== null && _answerItem$value !== void 0 ? _answerItem$value : false;
    }
    if (props.read_only || !isSameEditor) {
      inputProps.disabled = 'disabled';
    }
    return /*#__PURE__*/React.createElement("div", {
      className: classNames,
      key: this_key,
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("input", (0, _extends2.default)({
      id: 'fid_' + this_key,
      className: "custom-control-input",
      ref: function ref(c) {
        if (c && props.mutable) {
          _ref["child_ref_".concat(option.key)] = c;
        }
      },
      onChange: function onChange() {
        return handleChange(option);
      }
    }, inputProps)), /*#__PURE__*/React.createElement("label", {
      className: "custom-control-label",
      htmlFor: 'fid_' + this_key
    }, option.text), inputProps.checked && option.info && /*#__PURE__*/React.createElement("input", {
      id: 'fid_' + this_key + '_info',
      type: "text",
      className: "form-control",
      style: {
        width: 'auto',
        marginLeft: 16,
        height: 'calc(1.5em + .5rem)',
        marginBottom: 4
      },
      defaultValue: (_answerItem$info = answerItem.info) !== null && _answerItem$info !== void 0 ? _answerItem$info : ''
      // ref={(c) => {
      //   if (c && props.mutable) {
      //     infos[`child_ref_${option.key}_info`] = c;
      //   }
      // }}
    }));
  })));
});