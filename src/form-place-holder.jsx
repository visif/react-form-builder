import React from 'react'
import PropTypes from 'prop-types'

const PLACE_HOLDER = 'form-place-holder'

export default class PlaceHolder extends React.Component {
  render() {
    const isEmpty = this.props.index === 0
    return (
      this.props.show && (
        <div
          className={PLACE_HOLDER}
          style={{ minHeight: isEmpty ? '100px' : '50px', opacity: isEmpty ? 1 : 0.5 }}
        >
          <div>{isEmpty ? this.props.text : 'Drop items here'}</div>
        </div>
      )
    )
  }
}

PlaceHolder.propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool,
}

PlaceHolder.defaultProps = {
  text: 'Dropzone',
  show: false,
}
