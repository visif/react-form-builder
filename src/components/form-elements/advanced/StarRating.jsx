import React from 'react'

import ReactDOM from 'react-dom'

import PropTypes from 'prop-types'

import cx from 'classnames'

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

const StarRating = (props) => {
  const rootNode = React.useRef(null)
  const node = React.useRef(null)
  const root = React.useRef(null)
  const ratingContainer = React.useRef(null)

  const min = 0
  const max = props.ratingAmount || 5

  const getStars = React.useCallback(() => {
    let stars = ''
    const numRating = props.ratingAmount
    for (let i = 0; i < numRating; i++) {
      stars += '\u2605'
    }
    return stars
  }, [props.ratingAmount])

  const getStarRatingPosition = React.useCallback(
    (val) => {
      const getWidthFromValue = (val) => {
        if (val <= min || min === max) {
          return 0
        }
        if (val >= max) {
          return 100
        }
        return (val / (max - min)) * 100
      }
      return `${getWidthFromValue(val)}%`
    },
    [min, max]
  )

  const ratingVal = props.rating
  const initialRatingCache = {
    pos: ratingVal ? getStarRatingPosition(ratingVal) : 0,
    rating: props.rating,
  }

  const [ratingCache, setRatingCache] = React.useState(initialRatingCache)
  const [editing, setEditing] = React.useState(props.editing || !props.rating)
  const [rating, setRating] = React.useState(initialRatingCache.rating)
  const [pos, setPos] = React.useState(initialRatingCache.pos)
  const [glyph] = React.useState(getStars())

  React.useEffect(() => {
    root.current = ReactDOM.findDOMNode(rootNode.current)
    ratingContainer.current = ReactDOM.findDOMNode(node.current)

    return () => {
      root.current = null
      ratingContainer.current = null
    }
  }, [])

  React.useEffect(() => {
    if (props.rating !== rating) {
      const newPos = getStarRatingPosition(props.rating)
      setPos(newPos)
      setRating(props.rating)
    }
  }, [props.rating, rating, getStarRatingPosition])

  const getPosition = React.useCallback((e) => {
    return e.pageX - root.current.getBoundingClientRect().left
  }, [])

  const applyPrecision = React.useCallback((val, precision) => {
    return parseFloat(val.toFixed(precision))
  }, [])

  const getDecimalPlaces = React.useCallback((num) => {
    const match = `${num}`.match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
    return !match ? 0 : Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0))
  }, [])

  const getWidthFromValue = React.useCallback(
    (val) => {
      if (val <= min || min === max) {
        return 0
      }
      if (val >= max) {
        return 100
      }
      return (val / (max - min)) * 100
    },
    [min, max]
  )

  const getValueFromPosition = React.useCallback(
    (pos) => {
      const precision = getDecimalPlaces(props.step)
      const maxWidth = ratingContainer.current.offsetWidth
      const diff = max - min
      let factor = (diff * pos) / (maxWidth * props.step)
      factor = Math.ceil(factor)
      let val = applyPrecision(parseFloat(min + factor * props.step), precision)
      val = Math.max(Math.min(val, max), min)
      return val
    },
    [props.step, max, min, getDecimalPlaces, applyPrecision]
  )

  const calculate = React.useCallback(
    (pos) => {
      const val = getValueFromPosition(pos)
      let width = getWidthFromValue(val)
      width += '%'
      return { width, val }
    },
    [getValueFromPosition, getWidthFromValue]
  )

  const getRatingEvent = React.useCallback(
    (e) => {
      const pos = getPosition(e)
      return calculate(pos)
    },
    [getPosition, calculate]
  )

  const updateRating = React.useCallback((width, val) => {
    setPos(width)
    setRating(val)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setPos(ratingCache.pos)
    setRating(ratingCache.rating)
  }, [ratingCache])

  const handleMouseMove = React.useCallback(
    (e) => {
      const ratingEvent = getRatingEvent(e)
      updateRating(ratingEvent.width, ratingEvent.val)
    },
    [getRatingEvent, updateRating]
  )

  const handleClick = React.useCallback(
    (e) => {
      if (props.disabled) {
        e.stopPropagation()
        e.preventDefault()
        return false
      }

      const newRatingCache = {
        pos,
        rating,
        caption: props.caption,
        name: props.name,
      }

      setRatingCache(newRatingCache)
      props.onRatingClick(e, newRatingCache)
      return true
    },
    [props, pos, rating]
  )

  const classes = cx({
    'react-star-rating__root': true,
    'rating-disabled': props.disabled,
    [`react-star-rating__size--${props.size}`]: props.size,
    'rating-editing': editing,
  })

  let starRating
  if (editing) {
    starRating = (
      <div
        ref={node}
        className="rating-container rating-gly-star"
        data-content={glyph}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="rating-stars" data-content={glyph} style={{ width: pos }}></div>
      </div>
    )
  } else {
    starRating = (
      <div ref={node} className="rating-container rating-gly-star" data-content={glyph}>
        <div className="rating-stars" data-content={glyph} style={{ width: pos }}></div>
      </div>
    )
  }

  return (
    <span className="react-star-rating">
      <span ref={rootNode} style={{ cursor: 'pointer' }} className={classes}>
        {starRating}
        <input
          type="hidden"
          name={props.name}
          value={ratingCache.rating}
          style={{ display: 'none', width: 65 }}
          min={min}
          max={max}
          readOnly
        />
      </span>
    </span>
  )
}

StarRating.propTypes = {
  name: PropTypes.string.isRequired,
  caption: PropTypes.string,
  ratingAmount: PropTypes.number.isRequired,
  rating: PropTypes.number,
  onRatingClick: PropTypes.func,
  disabled: PropTypes.bool,
  editing: PropTypes.bool,
  size: PropTypes.string,
}

StarRating.defaultProps = {
  step: 0.5,
  ratingAmount: 5,
  onRatingClick() {},
  disabled: false,
}

export default StarRating
