import React from 'react'
import { Button, Image, Modal } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'

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
        <div style={{ position: 'relative' }}>
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
              style={{ width: '100%', cursor: 'pointer' }}
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
