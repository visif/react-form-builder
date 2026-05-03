import React from 'react'

import PropTypes from 'prop-types'

import ComponentHeader from '../shared/ComponentHeader'

const Section = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item rfb-section-item' : 'SortableItem rfb-section-item'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses} id={props.data.header}>
      <ComponentHeader {...props} />
      <h5 className="rfb-section-title">{props.data.header}</h5>
      <hr className="rfb-section-divider" />
    </div>
  )
}

Section.propTypes = {
  data: PropTypes.shape({
    header: PropTypes.string,
    isShowLabel: PropTypes.bool,
    pageBreakBefore: PropTypes.bool,
  }).isRequired,
}

export default Section
