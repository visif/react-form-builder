/**
 * <HeaderBar />
 */
import React from 'react'
import PropTypes from 'prop-types'
import Grip from '../layout/Grip'

const HeaderBar = (props) => {
  return (
    <div className="toolbar-header">
      <span className="badge badge-secondary">{props.data.text}</span>
      <div className="toolbar-header-buttons">
        {props.data.element !== 'LineBreak' && (
          <div
            className="btn is-isolated"
            onClick={props.editModeOn?.bind(props.parent, props.data)}
          >
            <i className="is-isolated fas fa-edit"></i>
          </div>
        )}
        <div
          className="btn is-isolated"
          onClick={props.onDestroy?.bind(null, props.data)}
        >
          <i className="is-isolated fas fa-trash"></i>
        </div>
        {!props.data.isContainer && (
          <Grip
            data={props.data}
            index={props.index}
            onDestroy={props.onDestroy}
            setAsChild={props.setAsChild}
          />
        )}
      </div>
    </div>
  )
}

HeaderBar.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string,
    element: PropTypes.string,
    isContainer: PropTypes.bool,
  }).isRequired,
  editModeOn: PropTypes.func,
  onDestroy: PropTypes.func,
  parent: PropTypes.object,
  index: PropTypes.number,
  setAsChild: PropTypes.func,
}

export default HeaderBar
