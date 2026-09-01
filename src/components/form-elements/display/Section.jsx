import React from 'react'

import PropTypes from 'prop-types'

import ComponentHeader from '../shared/ComponentHeader'

const Section = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item rfb-section-item' : 'SortableItem rfb-section-item'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  const header = props.data.header || ''
  const { generateSectionID } = props
  const sectionId = typeof generateSectionID === 'function' ? generateSectionID(header) : header

  return (
    <div className={baseClasses} id={sectionId} data-section={header} title={header}>
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
  generateSectionID: PropTypes.func,
}

export default Section
