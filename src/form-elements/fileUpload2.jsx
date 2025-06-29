import React from 'react'
import ComponentHeader from './component-header'

class FileUpload extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef(null)

    const fileList = (props.defaultValue && props.defaultValue.fileList) || []

    this.state = {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: [...fileList],
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log('FileUpload >> getDerivedStateFromProps')
    console.log(props.defaultValue)
    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue.fileList) !== JSON.stringify(state.defaultValue)
    ) {
      const fileList = (props.defaultValue && props.defaultValue.fileList) || []
      return {
        defaultValue: props.defaultValue && props.defaultValue.fileList,
        fileList: [...fileList],
      }
    }

    return state
  }

  uploadAttachFile = async (file) => {
    if (typeof this.props.onUploadFile !== 'function') {
      console.log('FileUpload >>>>> not upload function found', this.props.onUploadFile)
      return
    }

    console.log('Uploading file.....')
    const fileName = await this.props.onUploadFile(file)
    return {
      originalName: file.name,
      fileName,
    }
  }

  onUploadMultipleFiles = async (event) => {
    event.persist()

    if (!event || !event.target || !event.target.files) {
      return
    }

    const newFileList = Array.from(event.target.files)
    const newResponse = []
    for (let i = 0; i < newFileList.length; i = i + 1) {
      const currentFile = newFileList[i]
      const response = await this.uploadAttachFile(currentFile)
      if (response) {
        newResponse.push(response)
      }
    }

    this.setState((current) => {
      return {
        fileList: [...current.fileList, ...newResponse],
      }
    })
  }

  onDownloadFile = async (file) => {
    if (typeof this.props.onDownloadFile !== 'function') {
      console.log(
        'FileUpload >>>>> no download function found',
        this.props.onDownloadFile
      )
      return
    }

    console.log('Downloading File file.....')
    await this.props.onDownloadFile(file)
    console.log('download filtPath: ', file)
  }

  onRemoveFile = (file) => {
    // Check if user is the same editor before allowing deletion
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Only allow deletion if user is the same editor
    if (!isSameEditor) {
      console.log('User not authorized to delete file')
      return
    }

    this.setState((current) => {
      const remainList = current.fileList.filter(
        (item) => item.fileName !== file.fileName
      )
      return {
        fileList: [...remainList],
      }
    })
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    return (
      <div
        ref={this.tableRef}
        className={`SortableItem rfb-item${
          this.props.data.pageBreakBefore ? ' alwaysbreak' : ''
        }`}
      >
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <div>
            <input
              multiple
              ref={this.inputField}
              type="file"
              name="fileUpload"
              title=" "
              style={{ display: 'none' }}
              onChange={this.onUploadMultipleFiles}
              disabled={!isSameEditor}
            />
            <a
              href="#"
              style={{ marginTop: 6 }}
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault()
                this.inputField && this.inputField.current.click()
              }}
            >
              Upload files
            </a>
            {this.state.fileList && this.state.fileList.length > 0 && (
              <ul
                style={{
                  display: 'flex',
                  maxWidth: '450px',
                  flexDirection: 'column',
                  marginTop: '1rem',
                }}
              >
                {this.state.fileList.map((file, index) => {
                  return (
                    <li
                      key={`file${index}`}
                      style={{
                        listStyleType: 'none',
                        fontSize: 16,
                        display: 'block',
                      }}
                    >
                      <span
                        style={{ float: 'left', cursor: 'pointer' }}
                        onClick={() => {
                          this.onDownloadFile(file)
                        }}
                      >
                        <span style={{ marginRight: 4 }}>{index + 1}.</span>{' '}
                        {file.originalName}
                      </span>
                      {/* Only show delete button if user is the same editor */}
                      {isSameEditor && (
                        <span
                          style={{
                            float: 'right',
                            cursor: 'pointer',
                            marginTop: 4,
                          }}
                          onClick={() => {
                            this.onRemoveFile(file)
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default FileUpload
