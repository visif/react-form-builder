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

class ReactFormBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      editElement: null,
    }
    this.editModeOn = this.editModeOn.bind(this)
  }

  editModeOn(data, e) {
    e.preventDefault()
    e.stopPropagation()
    if (this.state.editMode) {
      this.setState({ editMode: !this.state.editMode, editElement: null })
    } else {
      this.setState({ editMode: !this.state.editMode, editElement: data })
    }
  }

  manualEditModeOff() {
    if (this.state.editMode) {
      this.setState({
        editMode: false,
        editElement: null,
      })
    }
  }

  render() {
    const toolbarProps = {
      showDescription: this.props.show_description,
    }
    if (this.props.toolbarItems) {
      toolbarProps.items = this.props.toolbarItems
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
                files={this.props.files}
                manualEditModeOff={this.manualEditModeOff.bind(this)}
                showCorrectColumn={this.props.showCorrectColumn}
                parent={this}
                data={this.props.data}
                url={this.props.url}
                saveUrl={this.props.saveUrl}
                onLoad={this.props.onLoad}
                onPost={this.props.onPost}
                editModeOn={this.editModeOn}
                editMode={this.state.editMode}
                variables={this.props.variables}
                registry={Registry}
                editElement={this.state.editElement}
                renderEditForm={this.props.renderEditForm}
                onChange={this.props.onChange}
                uploadUrl={this.props.uploadUrl}
                onImageUpload={this.props.onImageUpload}
                getDataSource={this.props.getDataSource}
                getFormSource={this.props.getFormSource}
                getFormContent={this.props.getFormContent}
                getActiveUserProperties={this.props.getActiveUserProperties}
                onUploadFile={this.props.onUploadFile}
                onUploadImage={this.props.onUploadImage}
                onDownloadFile={this.props.onDownloadFile}
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
              <Toolbar {...toolbarProps} customItems={this.props.customToolbarItems} />
            </div>
          </div>
        </div>
      </DndProvider>
    )
  }
}

const FormBuilders = {}
FormBuilders.ReactFormBuilder = ReactFormBuilder
FormBuilders.ReactFormGenerator = ReactFormGenerator
FormBuilders.ElementStore = store
FormBuilders.Registry = Registry

export default FormBuilders

export { ReactFormBuilder, ReactFormGenerator, store as ElementStore, Registry }
