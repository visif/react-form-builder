import React from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'

const isBrowserUrl = (value) => !!value && /^(https?:|blob:|data:)/i.test(value)

// This only needs to be imported once in your app

class ImageUpload extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef(null)

    const filePath = props.defaultValue && props.defaultValue.filePath
    const fileName = props.defaultValue && props.defaultValue.fileName
    const blobUrl = props.defaultValue && props.defaultValue.blobUrl
    const initialDisplay =
      isBrowserUrl(blobUrl) || isBrowserUrl(filePath) ? blobUrl || filePath : ''

    this.state = {
      defaultValue: props.defaultValue,
      filePath,
      fileName,
      blobUrl,
      displayUrl: initialDisplay,
      resolveDone: !!initialDisplay || !filePath,
      isOpen: false,
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log('ImageUpload >> getDerivedStateFromProps')
    console.log(props.defaultValue)
    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue) !== JSON.stringify(state.defaultValue)
    ) {
      const filePath = props.defaultValue && props.defaultValue.filePath
      const fileName = props.defaultValue && props.defaultValue.fileName
      const blobUrl = props.defaultValue && props.defaultValue.blobUrl
      const displayUrl =
        isBrowserUrl(blobUrl) || isBrowserUrl(filePath) ? blobUrl || filePath : ''

      return {
        defaultValue: props.defaultValue,
        filePath,
        fileName,
        blobUrl,
        displayUrl,
        resolveDone: !!displayUrl || !filePath,
      }
    }

    return null
  }

  componentDidMount() {
    this.resolveDisplayUrl()
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.filePath !== this.state.filePath || prevState.blobUrl !== this.state.blobUrl) {
      this.resolveDisplayUrl()
    }
  }

  resolveDisplayUrl = async () => {
    const { filePath, blobUrl } = this.state
    // Fresh same-session blob previews are fine; saved blob: URLs from prior
    // sessions are dead and must not block resolving filePath.
    if (isBrowserUrl(blobUrl) && String(blobUrl).startsWith('blob:') && !filePath) {
      this.setState({ displayUrl: blobUrl, resolveDone: true })
      return
    }
    if (isBrowserUrl(filePath)) {
      this.setState({ displayUrl: filePath, resolveDone: true })
      return
    }
    if (isBrowserUrl(blobUrl) && !String(blobUrl).startsWith('blob:')) {
      this.setState({ displayUrl: blobUrl, resolveDone: true })
      return
    }
    if (!filePath || typeof this.props.resolveImageUrl !== 'function') {
      this.setState({ displayUrl: '', resolveDone: true })
      return
    }
    try {
      const resolved = await this.props.resolveImageUrl(filePath)
      if (this.state.filePath === filePath) {
        this.setState({ displayUrl: resolved || '', resolveDone: true })
      }
    } catch (error) {
      console.log('resolveImageUrl failed', error)
      if (this.state.filePath === filePath) {
        this.setState({ displayUrl: '', resolveDone: true })
      }
    }
  }

  onRemoveImage = () => {
    if (!confirm('Confirm delete?')) {
      return
    }

    this.setState(() => {
      return {
        filePath: '',
        fileName: '',
        blobUrl: '',
        displayUrl: '',
        resolveDone: true,
      }
    })
  }

  uploadImageFile = async (event) => {
    event.persist()

    if (!event || !event.target || !event.target.files) {
      return
    }

    const file = Array.from(event.target.files)[0]

    if (typeof this.props.onUploadImage !== 'function') {
      console.log(
        'onUploadImage >>>>> no upload function found',
        this.props.onUploadImage
      )
      return
    }

    console.log('Uploading image .....')
    const extension = `${file.name}`.substring(file.name.lastIndexOf('.'))
    const filePath = await this.props.onUploadImage(file)
    if (!filePath) {
      return
    }

    const blobUrl = URL.createObjectURL(file)

    // Keep "{serverFile}{ext}" storage format expected by FormService attachment move.
    this.setState({
      fileName: file.name,
      blobUrl,
      displayUrl: blobUrl,
      resolveDone: true,
      filePath: `${filePath}${extension}`,
    })
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const rawEditor = this.props.editor
    const savedEditor = Array.isArray(rawEditor) ? rawEditor[0] : rawEditor
    const hasValue = !!(this.state.filePath || this.state.blobUrl)
    const previewSrc =
      this.state.displayUrl ||
      (isBrowserUrl(this.state.blobUrl) && String(this.state.blobUrl).startsWith('blob:')
        ? this.state.blobUrl
        : '')
    const resolveDone = this.state.resolveDone !== false
    const isReadOnly = !!(this.props.read_only || (this.props.data && this.props.data.readOnly))

    // Empty field: anyone who can fill the form may upload.
    // Existing image: only the uploader (editor) or DCC may replace/remove.
    let canEditImage = !isReadOnly
    if (hasValue && savedEditor && savedEditor.userId != null && userProperties) {
      const sameUploader = String(userProperties.userId) === String(savedEditor.userId)
      const isDcc = userProperties.hasDCCRole === true
      canEditImage = !isReadOnly && (sameUploader || isDcc)
    } else if (hasValue && savedEditor && savedEditor.userId != null && !userProperties) {
      canEditImage = false
    }

    const showUploadOrReplace = resolveDone && canEditImage
    const showRemove = resolveDone && canEditImage && hasValue
    const actionStyle = {
      display: 'inline-block',
      marginRight: 8,
    }

    const tooltipText =
      savedEditor && savedEditor.name && hasValue ? `Uploaded by: ${savedEditor.name}` : ''

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
          <ComponentLabel {...this.props} />
          <div style={{ position: 'relative' }}>
            {previewSrc ? (
              <img
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => {
                  this.setState({ isOpen: true })
                }}
                src={previewSrc}
              />
            ) : this.state.filePath && !this.state.resolveDone ? (
              <div
                className="no-image"
                style={{
                  minHeight: 80,
                  border: '1px dashed #d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                Loading image...
              </div>
            ) : null}
          </div>
          {(showUploadOrReplace || showRemove) && (
            <div style={{ marginTop: 8 }}>
              <input
                ref={this.inputField}
                type="file"
                accept="image/*"
                name="fileUpload"
                title=" "
                style={{ display: 'none' }}
                onChange={this.uploadImageFile}
              />
              {showUploadOrReplace && (
                <a
                  href=""
                  className="btn btn-secondary"
                  style={actionStyle}
                  onClick={(e) => {
                    this.inputField && this.inputField.current.click()
                    e.preventDefault()
                  }}
                >
                  {hasValue ? 'Replace Image' : 'Upload Image'}
                </a>
              )}
              {showRemove && (
                <a
                  href=""
                  className="btn btn-secondary"
                  style={actionStyle}
                  onClick={(e) => {
                    e.preventDefault()
                    this.onRemoveImage()
                  }}
                >
                  Remove Image
                </a>
              )}
            </div>
          )}
        </div>
        {this.state.isOpen && previewSrc && (
          <Lightbox
            mainSrc={previewSrc}
            // Form opens inside Ant Design Drawer (z-index ~1000). Default lightbox
            // overlay is also 1000, so raise it so original-size preview appears on top.
            reactModalStyle={{
              overlay: { zIndex: 2000 },
              content: { zIndex: 2000 },
            }}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    )
  }
}

export default ImageUpload
