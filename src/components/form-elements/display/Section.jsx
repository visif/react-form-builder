import React from 'react'
import PropTypes from 'prop-types'
import ComponentHeader from '../shared/ComponentHeader'

const Section = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses} id={props.data.header}>
      <ComponentHeader {...props} />
      <h5>{props.data.header}</h5>
      <hr />
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
