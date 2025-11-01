/**
 * ReactFormBuilder - Main form builder component with drag-and-drop interface
 *
 * @component
 * @description A complete form builder that allows users to create forms using a drag-and-drop
 * interface. Supports custom toolbar items, form data persistence, and real-time preview.
 *
 * @example
 * // Basic usage
 * import { ReactFormBuilder } from 'react-form-builder2';
 * import 'react-form-builder2/dist/app.css';
 *
 * function App() {
 *   return (
 *     <ReactFormBuilder
 *       url="/api/forms/initial.json"
 *       saveUrl="/api/forms/save"
 *     />
 *   );
 * }
 *
 * @example
 * // With custom toolbar items
 * const customItems = [
 *   { key: 'CustomElement', name: 'Custom', icon: 'fa fa-custom', static: false }
 * ];
 *
 * <ReactFormBuilder
 *   customToolbarItems={customItems}
 *   onSubmit={(data) => console.log('Form saved:', data)}
 * />
 *
 * @param {Object} props - Component props
 * @param {string} [props.url] - URL to load initial form data from (GET request)
 * @param {string} [props.saveUrl] - URL to save form data to (POST request)
 * @param {Function} [props.onLoad] - Callback when form data is loaded
 * @param {Function} [props.onPost] - Callback when form is saved/posted
 * @param {Function} [props.onChange] - Callback when form data changes
 * @param {Function} [props.onSubmit] - Callback on form submit (overrides POST)
 * @param {Array} [props.data] - Initial form data (if not loading from URL)
 * @param {Array} [props.toolbarItems] - Custom toolbar items to display
 * @param {Array} [props.customToolbarItems] - Additional custom toolbar items
 * @param {boolean} [props.show_description=true] - Show element descriptions in toolbar
 * @param {boolean} [props.editMode=false] - Start in edit mode
 * @param {Object} [props.editElement] - Element to edit initially
 * @param {string} [props.locale='en'] - Locale for internationalization
 * @param {Array} [props.files] - File upload configuration
 * @param {Function} [props.renderEditForm] - Custom render function for edit form
 *
 * @returns {React.ReactElement} The form builder interface with toolbar and preview
 *
 * @since 1.0.0 - Converted to functional component with React hooks
 * @requires react-dnd v16+ for drag-and-drop functionality
 */
import React from 'react'

import PropTypes from 'prop-types'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Preview from './components/builder/Preview/Preview'
import Toolbar from './components/builder/Toolbar/Toolbar'
import ReactFormGenerator from './components/generator/ReactForm'
import store from './contexts/FormBuilderContext'
import { FormBuilderProvider, useFormBuilderStore } from './contexts/FormBuilderContext'
import Registry from './utils/registry'

const ReactFormBuilder = (props) => {
  const [editMode, setEditMode] = React.useState(false)
  const [editElement, setEditElement] = React.useState(null)

  const editModeOn = React.useCallback(
    (data, e) => {
      e.preventDefault()
      e.stopPropagation()
      if (editMode) {
        setEditMode(false)
        setEditElement(null)
      } else {
        setEditMode(true)
        setEditElement(data)
      }
    },
    [editMode]
  )

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

ReactFormBuilder.propTypes = {
  show_description: PropTypes.bool,
  toolbarItems: PropTypes.array,
  customToolbarItems: PropTypes.array,
  files: PropTypes.array,
  showCorrectColumn: PropTypes.bool,
  data: PropTypes.array,
  url: PropTypes.string,
  saveUrl: PropTypes.string,
  onLoad: PropTypes.func,
  onPost: PropTypes.func,
  variables: PropTypes.object,
  renderEditForm: PropTypes.func,
  onChange: PropTypes.func,
  uploadUrl: PropTypes.string,
  onImageUpload: PropTypes.func,
  getDataSource: PropTypes.func,
  getFormSource: PropTypes.func,
  getFormContent: PropTypes.func,
  getActiveUserProperties: PropTypes.func,
  onUploadFile: PropTypes.func,
  onUploadImage: PropTypes.func,
  onDownloadFile: PropTypes.func,
}

const FormBuilders = {}
FormBuilders.ReactFormBuilder = ReactFormBuilder
FormBuilders.ReactFormGenerator = ReactFormGenerator
FormBuilders.ElementStore = store
FormBuilders.Registry = Registry

export default FormBuilders

export {
  ReactFormBuilder,
  ReactFormGenerator,
  store as ElementStore,
  Registry,
  FormBuilderProvider,
  useFormBuilderStore,
}
