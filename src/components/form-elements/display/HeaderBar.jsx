/**
 * <HeaderBar />
 */
import React from 'react'

import PropTypes from 'prop-types'
import { Button, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import Grip from '../layout/Grip'

const HeaderBar = (props) => {
  return (
    <div className="toolbar-header">
      <Tag bordered={false} style={{ backgroundColor: 'transparent', padding: 0 }}>
        {props.data.text}
      </Tag>
      <div className="toolbar-header-buttons">
        {props.data.element !== 'LineBreak' && (
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            className="is-isolated"
            onClick={props.editModeOn?.bind(props.parent, props.data)}
          />
        )}
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          className="is-isolated"
          danger
          onClick={props.onDestroy?.bind(null, props.data)}
        />
        {!props.data.isContainer && (
          <Grip
            data={props.data}
            index={props.index}
            onDestroy={props.onDestroy}
            setAsChild={props.setAsChild}
            getDataById={props.getDataById}
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
  getDataById: PropTypes.func,
}

export default HeaderBar
