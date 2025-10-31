import React from 'react'

// TODO: Replace react-image-lightbox with React 18 compatible alternative
// import Lightbox from 'react-image-lightbox'
// import 'react-image-lightbox/style.css'
import ComponentHeader from '../shared/ComponentHeader'

// This only needs to be imported once in your app

const ImageUpload = (props) => {
  const inputField = React.useRef(null)

  const initFilePath = props.defaultValue && props.defaultValue.filePath
  const initFileName = props.defaultValue && props.defaultValue.fileName
  const initBlobUrl = props.defaultValue && props.defaultValue.blobUrl

  const [defaultValue, setDefaultValue] = React.useState(props.defaultValue)
  const [filePath, setFilePath] = React.useState(initFilePath)
  const [fileName, setFileName] = React.useState(initFileName)
  const [blobUrl, setBlobUrl] = React.useState(initBlobUrl)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    console.log('ImageUpload >> useEffect (prop sync)')
    console.log(props.defaultValue)
    if (props.defaultValue && JSON.stringify(props.defaultValue) !== JSON.stringify(defaultValue)) {
      const newFilePath = props.defaultValue && props.defaultValue.filePath
      const newFileName = props.defaultValue && props.defaultValue.fileName
      const newBlobUrl = props.defaultValue && props.defaultValue.blobUrl

      setDefaultValue(props.defaultValue)
      setFilePath(newFilePath)
      setFileName(newFileName)
      setBlobUrl(newBlobUrl)
    }
  }, [props.defaultValue, defaultValue])

  const onRemoveImage = React.useCallback(() => {
    if (!confirm('Confirm delete?')) {
      return
    }

    setFilePath('')
    setFileName('')
    setBlobUrl('')
  }, [])

  const uploadImageFile = React.useCallback(
    async (event) => {
      event.persist()

      if (!event || !event.target || !event.target.files) {
        return
      }

      const file = Array.from(event.target.files)[0]

      if (typeof props.onUploadImage !== 'function') {
        console.log('onUploadImage >>>>> no upload function found', props.onUploadImage)
        return
      }

      console.log('Uploading image .....')
      const extension = `${file.name}`.substring(file.name.lastIndexOf('.'))
      const uploadedPath = await props.onUploadImage(file)

      const newBlobUrl = URL.createObjectURL(file)

      setFileName(file.name)
      setBlobUrl(newBlobUrl)
      setFilePath(`${uploadedPath}${extension}`)
    },
    [props.onUploadImage]
  )

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  return (
    <div className={`SortableItem rfb-item${props.data.pageBreakBefore ? ' alwaysbreak' : ''}`}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <div style={{ position: 'relative' }}>
          <div
            className="btn is-isolated"
            onClick={onRemoveImage}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              display: filePath ? '' : 'none',
            }}
          >
            <i className="is-isolated fas fa-trash"></i>
          </div>
          <img
            style={{ width: '100%', cursor: 'pointer' }}
            onClick={() => {
              setIsOpen(true)
            }}
            src={blobUrl || filePath ? blobUrl || filePath : ''}
          />
        </div>
        <div>
          <input
            ref={inputField}
            type="file"
            name="fileUpload"
            title=" "
            style={{ display: 'none' }}
            onChange={uploadImageFile}
          />
          <a
            href=""
            className="btn btn-secondary"
            style={{
              display: filePath ? 'none' : 'inline-block',
              pointerEvents: isSameEditor ? 'auto' : 'none',
            }}
            onClick={(e) => {
              inputField && inputField.current.click()
              e.preventDefault()
            }}
          >
            Upload Image
          </a>
        </div>
      </div>
      {/* TODO: Re-enable lightbox with React 18 compatible alternative */}
      {/* isOpen && (
        <Lightbox
          mainSrc={blobUrl || filePath}
          onCloseRequest={() => setIsOpen(false)}
        />
      ) */}
    </div>
  )
}

export default ImageUpload
