import React from 'react'

import PropTypes from 'prop-types'

const PLACE_HOLDER = 'form-place-holder'

const PlaceHolder = ({ text = 'Dropzone', show = false }) => {
  return (
    <div className={PLACE_HOLDER} style={{ minHeight: show ? '100px' : '20px', opacity: show ? 1 : 0.3 }}>
      {show && <div>{text}</div>}
    </div>
  )
}

PlaceHolder.propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool,
}

export default PlaceHolder
