"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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

class StarRating extends _react.default.Component {
  constructor(props) {
    super(props);
    this.min = 0;
    this.max = props.ratingAmount || 5;
    const ratingVal = props.rating;
    const ratingCache = {
      pos: ratingVal ? this.getStarRatingPosition(ratingVal) : 0,
      rating: props.rating
    };
    this.state = {
      ratingCache,
      editing: props.editing || !props.rating,
      stars: 5,
      rating: ratingCache.rating,
      pos: ratingCache.pos,
      glyph: this.getStars()
    };
  }

  /**
   * Gets the stars based on ratingAmount
   * @return {string} stars
   */
  getStars() {
    let stars = '';
    const numRating = this.props.ratingAmount;
    for (let i = 0; i < numRating; i++) {
      stars += '\u2605';
    }
    return stars;
  }

  // componentWillMount() {
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

  componentDidMount() {
    this.root = _reactDom.default.findDOMNode(this.rootNode);
    this.ratingContainer = _reactDom.default.findDOMNode(this.node);
  }
  componentWillUnmount() {
    delete this.root;
    delete this.ratingContainer;
  }
  getPosition(e) {
    return e.pageX - this.root.getBoundingClientRect().left;
  }
  applyPrecision(val, precision) {
    return parseFloat(val.toFixed(precision));
  }
  getDecimalPlaces(num) {
    const match = "".concat(num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    return !match ? 0 : Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
  }
  getWidthFromValue(val) {
    const min = this.min;
    const max = this.max;
    if (val <= min || min === max) {
      return 0;
    }
    if (val >= max) {
      return 100;
    }
    return val / (max - min) * 100;
  }
  getValueFromPosition(pos) {
    const precision = this.getDecimalPlaces(this.props.step);
    const maxWidth = this.ratingContainer.offsetWidth;
    const diff = this.max - this.min;
    let factor = diff * pos / (maxWidth * this.props.step);
    factor = Math.ceil(factor);
    let val = this.applyPrecision(parseFloat(this.min + factor * this.props.step), precision);
    val = Math.max(Math.min(val, this.max), this.min);
    return val;
  }
  calculate(pos) {
    const val = this.getValueFromPosition(pos);
    let width = this.getWidthFromValue(val);
    width += '%';
    return {
      width,
      val
    };
  }
  getStarRatingPosition(val) {
    const width = "".concat(this.getWidthFromValue(val), "%");
    return width;
  }
  getRatingEvent(e) {
    const pos = this.getPosition(e);
    return this.calculate(pos);
  }
  getSvg() {
    return /*#__PURE__*/_react.default.createElement("svg", {
      className: "react-star-rating__star",
      viewBox: "0 0 286 272",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/_react.default.createElement("g", {
      stroke: "none",
      "stroke-width": "1",
      fill: "none",
      "fill-rule": "evenodd"
    }, /*#__PURE__*/_react.default.createElement("polygon", {
      id: "star-flat",
      points: "143 225 54.8322122 271.352549 71.6707613 173.176275 0.341522556 103.647451 98.9161061 89.3237254 143 0 187.083894 89.3237254 285.658477 103.647451 214.329239 173.176275 231.167788 271.352549 "
    })));
  }
  handleMouseLeave() {
    this.setState({
      pos: this.state.ratingCache.pos,
      rating: this.state.ratingCache.rating
    });
  }
  handleMouseMove(e) {
    // get hover position
    const ratingEvent = this.getRatingEvent(e);
    this.updateRating(ratingEvent.width, ratingEvent.val);
  }
  updateRating(width, val) {
    this.setState({
      pos: width,
      rating: val
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) {
      this.updateRating(this.getStarRatingPosition(nextProps.rating), nextProps.rating);
      return true;
    }
    return nextState.ratingCache.rating !== this.state.ratingCache.rating || nextState.rating !== this.state.rating;
  }
  handleClick(e) {
    // is it disabled?
    if (this.props.disabled) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    const ratingCache = {
      pos: this.state.pos,
      rating: this.state.rating,
      caption: this.props.caption,
      name: this.props.name
    };
    this.setState({
      ratingCache
    });
    this.props.onRatingClick(e, ratingCache);
    return true;
  }
  treatName(title) {
    if (typeof title === 'string') {
      return title.toLowerCase().split(' ').join('_');
    }
    return null;
  }
  render() {
    // let caption = null;
    const classes = (0, _classnames.default)({
      'react-star-rating__root': true,
      'rating-disabled': this.props.disabled,
      ["react-star-rating__size--".concat(this.props.size)]: this.props.size,
      'rating-editing': this.state.editing
    });

    // is there a caption?
    // if (this.props.caption) {
    //   caption = (<span className="react-rating-caption">{this.props.caption}</span>);
    // }

    // are we editing this rating?
    let starRating;
    if (this.state.editing) {
      starRating = /*#__PURE__*/_react.default.createElement("div", {
        ref: c => this.node = c,
        className: "rating-container rating-gly-star",
        "data-content": this.state.glyph,
        onMouseMove: this.handleMouseMove.bind(this),
        onMouseLeave: this.handleMouseLeave.bind(this),
        onClick: this.handleClick.bind(this)
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "rating-stars",
        "data-content": this.state.glyph,
        style: {
          width: this.state.pos
        }
      }));
    } else {
      starRating = /*#__PURE__*/_react.default.createElement("div", {
        ref: c => this.node = c,
        className: "rating-container rating-gly-star",
        "data-content": this.state.glyph
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "rating-stars",
        "data-content": this.state.glyph,
        style: {
          width: this.state.pos
        }
      }));
    }
    return /*#__PURE__*/_react.default.createElement("span", {
      className: "react-star-rating"
    }, /*#__PURE__*/_react.default.createElement("span", {
      ref: c => this.rootNode = c,
      style: {
        cursor: 'pointer'
      },
      className: classes
    }, starRating, /*#__PURE__*/_react.default.createElement("input", {
      type: "hidden",
      name: this.props.name,
      value: this.state.ratingCache.rating,
      style: {
        display: 'none',
        width: 65
      },
      min: this.min,
      max: this.max,
      readOnly: true
    })));
  }
}
exports.default = StarRating;
StarRating.propTypes = {
  name: _propTypes.default.string.isRequired,
  caption: _propTypes.default.string,
  ratingAmount: _propTypes.default.number.isRequired,
  rating: _propTypes.default.number,
  onRatingClick: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  editing: _propTypes.default.bool,
  size: _propTypes.default.string
};
StarRating.defaultProps = {
  step: 0.5,
  ratingAmount: 5,
  onRatingClick() {},
  disabled: false
};