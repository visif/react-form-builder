"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _classnames = _interopRequireDefault(require("classnames"));
var _propTypes = _interopRequireDefault(require("prop-types"));
/**
 * @fileoverview react-star-rating
 * @author @cameronjroe
 * <StarRating
 *   name={string} - name for form input (required)
 *   caption={string} - caption for rating (optional)
 *   ratingAmount={number} - the rating amount (required, default: 5)
 *   rating={number} - a set rating between the rating amount (optional)
 *   disabled={boolean} - whether to disable the rating from being selected (optional)
 *   editing={boolean} - whether the rating is explicitly in editing mode (optional)
 *   size={string} - size of stars (optional)
 *   onRatingClick={function} - a handler function that gets called onClick of the rating (optional)
 *   />
 */

var StarRating = function StarRating(props) {
  var rootNode = _react["default"].useRef(null);
  var node = _react["default"].useRef(null);
  var root = _react["default"].useRef(null);
  var ratingContainer = _react["default"].useRef(null);
  var min = 0;
  var max = props.ratingAmount || 5;
  var getStars = _react["default"].useCallback(function () {
    var stars = '';
    var numRating = props.ratingAmount;
    for (var i = 0; i < numRating; i++) {
      stars += "\u2605";
    }
    return stars;
  }, [props.ratingAmount]);
  var getStarRatingPosition = _react["default"].useCallback(function (val) {
    var getWidthFromValue = function getWidthFromValue(val) {
      if (val <= min || min === max) {
        return 0;
      }
      if (val >= max) {
        return 100;
      }
      return val / (max - min) * 100;
    };
    return "".concat(getWidthFromValue(val), "%");
  }, [min, max]);
  var ratingVal = props.rating;
  var initialRatingCache = {
    pos: ratingVal ? getStarRatingPosition(ratingVal) : 0,
    rating: props.rating
  };
  var _React$useState = _react["default"].useState(initialRatingCache),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    ratingCache = _React$useState2[0],
    setRatingCache = _React$useState2[1];
  var _React$useState3 = _react["default"].useState(props.editing || !props.rating),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    editing = _React$useState4[0],
    setEditing = _React$useState4[1];
  var _React$useState5 = _react["default"].useState(initialRatingCache.rating),
    _React$useState6 = (0, _slicedToArray2["default"])(_React$useState5, 2),
    rating = _React$useState6[0],
    setRating = _React$useState6[1];
  var _React$useState7 = _react["default"].useState(initialRatingCache.pos),
    _React$useState8 = (0, _slicedToArray2["default"])(_React$useState7, 2),
    pos = _React$useState8[0],
    setPos = _React$useState8[1];
  var _React$useState9 = _react["default"].useState(getStars()),
    _React$useState0 = (0, _slicedToArray2["default"])(_React$useState9, 1),
    glyph = _React$useState0[0];
  _react["default"].useEffect(function () {
    root.current = _reactDom["default"].findDOMNode(rootNode.current);
    ratingContainer.current = _reactDom["default"].findDOMNode(node.current);
    return function () {
      root.current = null;
      ratingContainer.current = null;
    };
  }, []);
  _react["default"].useEffect(function () {
    if (props.rating !== rating) {
      var newPos = getStarRatingPosition(props.rating);
      setPos(newPos);
      setRating(props.rating);
    }
  }, [props.rating, rating, getStarRatingPosition]);
  var getPosition = _react["default"].useCallback(function (e) {
    return e.pageX - root.current.getBoundingClientRect().left;
  }, []);
  var applyPrecision = _react["default"].useCallback(function (val, precision) {
    return parseFloat(val.toFixed(precision));
  }, []);
  var getDecimalPlaces = _react["default"].useCallback(function (num) {
    var match = "".concat(num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    return !match ? 0 : Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
  }, []);
  var getWidthFromValue = _react["default"].useCallback(function (val) {
    if (val <= min || min === max) {
      return 0;
    }
    if (val >= max) {
      return 100;
    }
    return val / (max - min) * 100;
  }, [min, max]);
  var getValueFromPosition = _react["default"].useCallback(function (pos) {
    var precision = getDecimalPlaces(props.step);
    var maxWidth = ratingContainer.current.offsetWidth;
    var diff = max - min;
    var factor = diff * pos / (maxWidth * props.step);
    factor = Math.ceil(factor);
    var val = applyPrecision(parseFloat(min + factor * props.step), precision);
    val = Math.max(Math.min(val, max), min);
    return val;
  }, [props.step, max, min, getDecimalPlaces, applyPrecision]);
  var calculate = _react["default"].useCallback(function (pos) {
    var val = getValueFromPosition(pos);
    var width = getWidthFromValue(val);
    width += '%';
    return {
      width: width,
      val: val
    };
  }, [getValueFromPosition, getWidthFromValue]);
  var getRatingEvent = _react["default"].useCallback(function (e) {
    var pos = getPosition(e);
    return calculate(pos);
  }, [getPosition, calculate]);
  var updateRating = _react["default"].useCallback(function (width, val) {
    setPos(width);
    setRating(val);
  }, []);
  var handleMouseLeave = _react["default"].useCallback(function () {
    setPos(ratingCache.pos);
    setRating(ratingCache.rating);
  }, [ratingCache]);
  var handleMouseMove = _react["default"].useCallback(function (e) {
    var ratingEvent = getRatingEvent(e);
    updateRating(ratingEvent.width, ratingEvent.val);
  }, [getRatingEvent, updateRating]);
  var handleClick = _react["default"].useCallback(function (e) {
    if (props.disabled) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    var newRatingCache = {
      pos: pos,
      rating: rating,
      caption: props.caption,
      name: props.name
    };
    setRatingCache(newRatingCache);
    props.onRatingClick(e, newRatingCache);
    return true;
  }, [props, pos, rating]);
  var classes = (0, _classnames["default"])((0, _defineProperty2["default"])((0, _defineProperty2["default"])({
    'react-star-rating__root': true,
    'rating-disabled': props.disabled
  }, "react-star-rating__size--".concat(props.size), props.size), 'rating-editing', editing));
  var starRating;
  if (editing) {
    starRating = /*#__PURE__*/_react["default"].createElement("div", {
      ref: node,
      className: "rating-container rating-gly-star",
      "data-content": glyph,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "rating-stars",
      "data-content": glyph,
      style: {
        width: pos
      }
    }));
  } else {
    starRating = /*#__PURE__*/_react["default"].createElement("div", {
      ref: node,
      className: "rating-container rating-gly-star",
      "data-content": glyph
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "rating-stars",
      "data-content": glyph,
      style: {
        width: pos
      }
    }));
  }
  return /*#__PURE__*/_react["default"].createElement("span", {
    className: "react-star-rating"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    ref: rootNode,
    style: {
      cursor: 'pointer'
    },
    className: classes
  }, starRating, /*#__PURE__*/_react["default"].createElement("input", {
    type: "hidden",
    name: props.name,
    value: ratingCache.rating,
    style: {
      display: 'none',
      width: 65
    },
    min: min,
    max: max,
    readOnly: true
  })));
};
StarRating.propTypes = {
  name: _propTypes["default"].string.isRequired,
  caption: _propTypes["default"].string,
  ratingAmount: _propTypes["default"].number.isRequired,
  rating: _propTypes["default"].number,
  onRatingClick: _propTypes["default"].func,
  disabled: _propTypes["default"].bool,
  editing: _propTypes["default"].bool,
  size: _propTypes["default"].string
};
StarRating.defaultProps = {
  step: 0.5,
  ratingAmount: 5,
  onRatingClick: function onRatingClick() {},
  disabled: false
};
var _default = exports["default"] = StarRating;