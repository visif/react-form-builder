"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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
var StarRating = /*#__PURE__*/function (_React$Component) {
  _inherits(StarRating, _React$Component);

  var _super = _createSuper(StarRating);

  function StarRating(props) {
    var _this;

    _classCallCheck(this, StarRating);

    _this = _super.call(this, props);
    _this.min = 0;
    _this.max = props.ratingAmount || 5;
    var ratingVal = props.rating;
    var ratingCache = {
      pos: ratingVal ? _this.getStarRatingPosition(ratingVal) : 0,
      rating: props.rating
    };
    _this.state = {
      ratingCache: ratingCache,
      editing: props.editing || !props.rating,
      stars: 5,
      rating: ratingCache.rating,
      pos: ratingCache.pos,
      glyph: _this.getStars()
    };
    return _this;
  }
  /**
   * Gets the stars based on ratingAmount
   * @return {string} stars
   */


  _createClass(StarRating, [{
    key: "getStars",
    value: function getStars() {
      var stars = '';
      var numRating = this.props.ratingAmount;

      for (var i = 0; i < numRating; i++) {
        stars += "\u2605";
      }

      return stars;
    } // componentWillMount() {
    //   this.min = 0;
    //   this.max = this.props.ratingAmount || 5;
    //   if (this.props.rating) {
    //     this.state.editing = this.props.editing || false;
    //     const ratingVal = this.props.rating;
    //     this.state.ratingCache.pos = this.getStarRatingPosition(ratingVal);
    //     this.state.ratingCache.rating = ratingVal;
    //     this.setState({
    //       ratingCache: this.state.ratingCache,
    //       rating: ratingVal,
    //       pos: this.getStarRatingPosition(ratingVal),
    //     });
    //   }
    // }

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.root = _reactDom["default"].findDOMNode(this.rootNode);
      this.ratingContainer = _reactDom["default"].findDOMNode(this.node);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      delete this.root;
      delete this.ratingContainer;
    }
  }, {
    key: "getPosition",
    value: function getPosition(e) {
      return e.pageX - this.root.getBoundingClientRect().left;
    }
  }, {
    key: "applyPrecision",
    value: function applyPrecision(val, precision) {
      return parseFloat(val.toFixed(precision));
    }
  }, {
    key: "getDecimalPlaces",
    value: function getDecimalPlaces(num) {
      var match = "".concat(num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      return !match ? 0 : Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
    }
  }, {
    key: "getWidthFromValue",
    value: function getWidthFromValue(val) {
      var min = this.min;
      var max = this.max;

      if (val <= min || min === max) {
        return 0;
      }

      if (val >= max) {
        return 100;
      }

      return val / (max - min) * 100;
    }
  }, {
    key: "getValueFromPosition",
    value: function getValueFromPosition(pos) {
      var precision = this.getDecimalPlaces(this.props.step);
      var maxWidth = this.ratingContainer.offsetWidth;
      var diff = this.max - this.min;
      var factor = diff * pos / (maxWidth * this.props.step);
      factor = Math.ceil(factor);
      var val = this.applyPrecision(parseFloat(this.min + factor * this.props.step), precision);
      val = Math.max(Math.min(val, this.max), this.min);
      return val;
    }
  }, {
    key: "calculate",
    value: function calculate(pos) {
      var val = this.getValueFromPosition(pos);
      var width = this.getWidthFromValue(val);
      width += '%';
      return {
        width: width,
        val: val
      };
    }
  }, {
    key: "getStarRatingPosition",
    value: function getStarRatingPosition(val) {
      var width = "".concat(this.getWidthFromValue(val), "%");
      return width;
    }
  }, {
    key: "getRatingEvent",
    value: function getRatingEvent(e) {
      var pos = this.getPosition(e);
      return this.calculate(pos);
    }
  }, {
    key: "getSvg",
    value: function getSvg() {
      return /*#__PURE__*/_react["default"].createElement("svg", {
        className: "react-star-rating__star",
        viewBox: "0 0 286 272",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg"
      }, /*#__PURE__*/_react["default"].createElement("g", {
        stroke: "none",
        "stroke-width": "1",
        fill: "none",
        "fill-rule": "evenodd"
      }, /*#__PURE__*/_react["default"].createElement("polygon", {
        id: "star-flat",
        points: "143 225 54.8322122 271.352549 71.6707613 173.176275 0.341522556 103.647451 98.9161061 89.3237254 143 0 187.083894 89.3237254 285.658477 103.647451 214.329239 173.176275 231.167788 271.352549 "
      })));
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave() {
      this.setState({
        pos: this.state.ratingCache.pos,
        rating: this.state.ratingCache.rating
      });
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(e) {
      // get hover position
      var ratingEvent = this.getRatingEvent(e);
      this.updateRating(ratingEvent.width, ratingEvent.val);
    }
  }, {
    key: "updateRating",
    value: function updateRating(width, val) {
      this.setState({
        pos: width,
        rating: val
      });
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (nextProps !== this.props) {
        this.updateRating(this.getStarRatingPosition(nextProps.rating), nextProps.rating);
        return true;
      }

      return nextState.ratingCache.rating !== this.state.ratingCache.rating || nextState.rating !== this.state.rating;
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      // is it disabled?
      if (this.props.disabled) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }

      var ratingCache = {
        pos: this.state.pos,
        rating: this.state.rating,
        caption: this.props.caption,
        name: this.props.name
      };
      this.setState({
        ratingCache: ratingCache
      });
      this.props.onRatingClick(e, ratingCache);
      return true;
    }
  }, {
    key: "treatName",
    value: function treatName(title) {
      if (typeof title === 'string') {
        return title.toLowerCase().split(' ').join('_');
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _cx,
          _this2 = this;

      // let caption = null;
      var classes = (0, _classnames["default"])((_cx = {
        'react-star-rating__root': true,
        'rating-disabled': this.props.disabled
      }, _defineProperty(_cx, "react-star-rating__size--".concat(this.props.size), this.props.size), _defineProperty(_cx, 'rating-editing', this.state.editing), _cx)); // is there a caption?
      // if (this.props.caption) {
      //   caption = (<span className="react-rating-caption">{this.props.caption}</span>);
      // }
      // are we editing this rating?

      var starRating;

      if (this.state.editing) {
        starRating = /*#__PURE__*/_react["default"].createElement("div", {
          ref: function ref(c) {
            return _this2.node = c;
          },
          className: "rating-container rating-gly-star",
          "data-content": this.state.glyph,
          onMouseMove: this.handleMouseMove.bind(this),
          onMouseLeave: this.handleMouseLeave.bind(this),
          onClick: this.handleClick.bind(this)
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "rating-stars",
          "data-content": this.state.glyph,
          style: {
            width: this.state.pos
          }
        }));
      } else {
        starRating = /*#__PURE__*/_react["default"].createElement("div", {
          ref: function ref(c) {
            return _this2.node = c;
          },
          className: "rating-container rating-gly-star",
          "data-content": this.state.glyph
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "rating-stars",
          "data-content": this.state.glyph,
          style: {
            width: this.state.pos
          }
        }));
      }

      return /*#__PURE__*/_react["default"].createElement("span", {
        className: "react-star-rating"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        ref: function ref(c) {
          return _this2.rootNode = c;
        },
        style: {
          cursor: 'pointer'
        },
        className: classes
      }, starRating, /*#__PURE__*/_react["default"].createElement("input", _defineProperty({
        type: "hidden",
        name: this.props.name,
        value: this.state.ratingCache.rating,
        style: {
          display: 'none !important'
        },
        min: this.min,
        max: this.max,
        readOnly: true
      }, "style", {
        width: 65
      }))));
    }
  }]);

  return StarRating;
}(_react["default"].Component);

exports["default"] = StarRating;
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