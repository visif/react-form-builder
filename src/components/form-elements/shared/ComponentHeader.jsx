import React from 'react'
import HeaderBar from '../display/HeaderBar'

const ComponentHeader = (props) => {
  // Only hide header in mutable mode that's not preview mode
  if (props.mutable && !props.preview) {
    return null
  }
  return (
    <div>
      {props.data.pageBreakBefore && <div className="preview-page-break">Page Break</div>}
      <HeaderBar
        parent={props.parent}
        editModeOn={props.editModeOn}
        data={props.data}
        index={props.index}
        setAsChild={props.setAsChild}
        onDestroy={props._onDestroy}
        onEdit={props.onEdit}
        static={props.data.static}
        required={props.data.required}
        preview={props.preview}
      />
    </div>
  )
}

export default ComponentHeader
