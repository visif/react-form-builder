import React from 'react'

import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Image, Modal } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'

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
  const [containerSize, setContainerSize] = React.useState({
    width: (props.defaultValue && props.defaultValue.width) || null,
    height: (props.defaultValue && props.defaultValue.height) || null,
  })
  const containerRef = React.useRef(null)

  // Observe user-initiated resizes; guard against re-render-triggered re-fires
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setContainerSize((prev) => {
        if (prev.width === width && prev.height === height) return prev
        return { width, height }
      })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (props.handleChange && props.data?.field_name) {
      props.handleChange(props.data.field_name, {
        filePath,
        fileName,
        blobUrl,
        width: containerSize.width,
        height: containerSize.height,
      })
    }
  }, [filePath, fileName, blobUrl, containerSize, props.handleChange, props.data?.field_name])

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
      setContainerSize({
        width: props.defaultValue.width || null,
        height: props.defaultValue.height || null,
      })
    }
  }, [props.defaultValue, defaultValue])

  const onRemoveImage = React.useCallback(() => {
    Modal.confirm({
      title: 'Confirm delete?',
      content: 'Are you sure you want to delete this image?',
      onOk: () => {
        setFilePath('')
        setFileName('')
        setBlobUrl('')
      },
    })
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
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            display: blobUrl || filePath ? 'inline-block' : 'block',
            resize: blobUrl || filePath ? 'both' : 'none',
            overflow: 'hidden',
            minWidth: 80,
            minHeight: 60,
            maxWidth: '100%',
            ...(containerSize.width && { width: containerSize.width }),
            ...(containerSize.height && { height: containerSize.height }),
          }}
        >
          {filePath && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={onRemoveImage}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
              }}
            />
          )}
          {(blobUrl || filePath) && (
            <Image
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'contain',
              }}
              src={blobUrl || filePath}
              preview={{
                visible: isOpen,
                onVisibleChange: (visible) => setIsOpen(visible),
              }}
            />
          )}
        </div>
        <div>
          <input
            ref={inputField}
            type="file"
            name="fileUpload"
            accept="image/*"
            title=" "
            style={{ display: 'none' }}
            onChange={uploadImageFile}
          />
          {!filePath && (
            <Button
              icon={<UploadOutlined />}
              disabled={!isSameEditor}
              onClick={(e) => {
                inputField && inputField.current.click()
                e.preventDefault()
              }}
            >
              Upload Image
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUpload
