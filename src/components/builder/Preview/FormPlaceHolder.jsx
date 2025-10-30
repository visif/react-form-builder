import React from 'react'
import PropTypes from 'prop-types'

const PLACE_HOLDER = 'form-place-holder'

const PlaceHolder = ({ text = 'Dropzone', show = false }) => {
  return (
    show && (
      <div className={PLACE_HOLDER}>
        <div>{text}</div>
      </div>
    )
  )
}

PlaceHolder.propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool,
}

export default PlaceHolder
