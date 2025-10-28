/**
 * <ReactFormBuilder />
 */
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ReactFormGenerator from './form'
import Preview from './preview'
import Registry from './stores/registry'
import store from './stores/store'
import Toolbar from './toolbar'

const ReactFormBuilder = (props) => {
  const [editMode, setEditMode] = React.useState(false)
  const [editElement, setEditElement] = React.useState(null)

  const editModeOn = React.useCallback((data, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (editMode) {
      setEditMode(false)
      setEditElement(null)
    } else {
      setEditMode(true)
      setEditElement(data)
    }
  }, [editMode])

  const manualEditModeOff = React.useCallback(() => {
    if (editMode) {
      setEditMode(false)
      setEditElement(null)
    }
  }, [editMode])

  const toolbarProps = {
    showDescription: props.show_description,
  }
  if (props.toolbarItems) {
    toolbarProps.items = props.toolbarItems
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="react-form-builder clearfix" style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              height: '100%',
              scrollbarWidth: 'none',
            }}
          >
            <Preview
              files={props.files}
              manualEditModeOff={manualEditModeOff}
              showCorrectColumn={props.showCorrectColumn}
              parent={null}
              data={props.data}
              url={props.url}
              saveUrl={props.saveUrl}
              onLoad={props.onLoad}
              onPost={props.onPost}
              editModeOn={editModeOn}
              editMode={editMode}
              variables={props.variables}
              registry={Registry}
              editElement={editElement}
              renderEditForm={props.renderEditForm}
              onChange={props.onChange}
              uploadUrl={props.uploadUrl}
              onImageUpload={props.onImageUpload}
              getDataSource={props.getDataSource}
              getFormSource={props.getFormSource}
              getFormContent={props.getFormContent}
              getActiveUserProperties={props.getActiveUserProperties}
              onUploadFile={props.onUploadFile}
              onUploadImage={props.onUploadImage}
              onDownloadFile={props.onDownloadFile}
            />
          </div>
          <div
            style={{
              width: '250px',
              top: 0,
              right: 0,
              bottom: 0,
              overflowY: 'auto',
              position: 'sticky',
              paddingLeft: '15px',
              height: '100%',
              scrollbarWidth: 'none',
            }}
          >
            <Toolbar {...toolbarProps} customItems={props.customToolbarItems} />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

const FormBuilders = {}
FormBuilders.ReactFormBuilder = ReactFormBuilder
FormBuilders.ReactFormGenerator = ReactFormGenerator
FormBuilders.ElementStore = store
FormBuilders.Registry = Registry

export default FormBuilders

export { ReactFormBuilder, ReactFormGenerator, store as ElementStore, Registry }
