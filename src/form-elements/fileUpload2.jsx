import React from 'react'
import Lightbox from 'react-image-lightbox'
import ComponentHeader from './component-header'
import FormDeleteButton from './form-delete-button'
import 'react-image-lightbox/style.css'

const getSavedEditor = (editor) => (Array.isArray(editor) ? editor[0] : editor)
const isImageFileName = (name) =>
  /\.(jpe?g|png|gif|webp|bmp)$/i.test(`${name || ''}`)
const filePreviewKey = (file) => file.fileName || file.originalName || ''

class FileUpload extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef(null)

    const fileList = (props.defaultValue && props.defaultValue.fileList) || []

    this.state = {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: [...fileList],
      previews: {},
      lightboxSrc: '',
    }
  }

  canEditFiles = () => {
    const isReadOnly = !!(
      this.props.read_only ||
      (this.props.data && this.props.data.readOnly)
    )
    return !isReadOnly
  }

  static getDerivedStateFromProps = (props, state) => {
    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue.fileList) !== JSON.stringify(state.defaultValue)
    ) {
      const fileList = (props.defaultValue && props.defaultValue.fileList) || []
      return {
        defaultValue: props.defaultValue && props.defaultValue.fileList,
        fileList: [...fileList],
        previews: {},
      }
    }

    return null
  }

  componentDidMount() {
    this.resolvePreviews()
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.fileList !== this.state.fileList) {
      this.resolvePreviews()
    }
  }

  resolvePreviews = async () => {
    if (typeof this.props.resolveImageUrl !== 'function') {
      return
    }
    const nextPreviews = {}
    for (const file of this.state.fileList || []) {
      const displayName = file.originalName || file.fileName
      if (!isImageFileName(displayName) && !isImageFileName(file.fileName)) {
        continue
      }
      const candidates = [file.fileName, file.originalName].filter(Boolean)
      let url = ''
      for (const candidate of candidates) {
        try {
          url = (await this.props.resolveImageUrl(candidate)) || ''
        } catch {
          url = ''
        }
        if (url) {
          break
        }
      }
      if (url) {
        nextPreviews[filePreviewKey(file)] = url
      }
    }
    if (this.state.fileList) {
      this.setState({ previews: nextPreviews })
    }
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
    const newPreviews = {}
    for (let i = 0; i < newFileList.length; i = i + 1) {
      const currentFile = newFileList[i]
      const response = await this.uploadAttachFile(currentFile)
      if (response) {
        newResponse.push(response)
        if (currentFile.type && currentFile.type.startsWith('image/')) {
          newPreviews[filePreviewKey(response)] = URL.createObjectURL(currentFile)
        }
      }
    }

    this.setState((current) => {
      return {
        fileList: [...current.fileList, ...newResponse],
        previews: { ...current.previews, ...newPreviews },
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
    if (!this.canEditFiles()) {
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
    const savedEditor = getSavedEditor(this.props.editor)
    const hasValue = this.state.fileList && this.state.fileList.length > 0
    const canEdit = this.canEditFiles()

    const files = this.state.fileList
      ? this.state.fileList.map((f) => f.originalName).join(', ')
      : ''
    const tooltipText =
      savedEditor && savedEditor.name && hasValue
        ? `${files}\nEdited by: ${savedEditor.name}`
        : ''

    return (
      <div
        ref={this.tableRef}
        className={`SortableItem rfb-item${
          this.props.data.pageBreakBefore ? ' alwaysbreak' : ''
        }`}
        title={tooltipText}
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
              disabled={!canEdit}
            />
            <a
              href="#"
              style={{ marginTop: 6 }}
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault()
                if (!canEdit) {
                  return
                }
                this.inputField && this.inputField.current.click()
              }}
            >
              Upload files
            </a>
            {this.state.fileList && this.state.fileList.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {this.state.fileList.map((file, index) => {
                  const previewSrc = this.state.previews[filePreviewKey(file)]
                  if (!previewSrc) {
                    return null
                  }
                  return (
                    <img
                      key={`preview-${index}`}
                      src={previewSrc}
                      alt={file.originalName || file.fileName}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'contain',
                        cursor: 'pointer',
                        border: '1px solid #d9d9d9',
                        background: '#fafafa',
                      }}
                      onClick={() => this.setState({ lightboxSrc: previewSrc })}
                    />
                  )
                })}
              </div>
            )}
            {this.state.fileList && this.state.fileList.length > 0 && (
              <ul
                style={{
                  display: 'flex',
                  maxWidth: '450px',
                  flexDirection: 'column',
                  marginTop: '1rem',
                  paddingLeft: 0,
                }}
              >
                {this.state.fileList.map((file, index) => {
                  return (
                    <li
                      key={`file${index}`}
                      style={{
                        listStyleType: 'none',
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        width: '100%',
                      }}
                    >
                      <span
                        style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
                        onClick={() => {
                          this.onDownloadFile(file)
                        }}
                      >
                        <span style={{ marginRight: 4 }}>{index + 1}.</span>{' '}
                        {file.originalName}
                      </span>
                      {canEdit && (
                        <FormDeleteButton
                          title="Delete file"
                          onClick={() => {
                            this.onRemoveFile(file)
                          }}
                        />
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
        {this.state.lightboxSrc && (
          <Lightbox
            mainSrc={this.state.lightboxSrc}
            reactModalStyle={{
              overlay: { zIndex: 11000 },
              content: { zIndex: 11000 },
            }}
            onCloseRequest={() => this.setState({ lightboxSrc: '' })}
          />
        )}
      </div>
    )
  }
}

export default FileUpload
