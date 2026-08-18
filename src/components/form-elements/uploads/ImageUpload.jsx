import React from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Button, Image, Modal } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'
import FormDeleteButton from '../shared/FormDeleteButton'

const isBrowserUrl = (value) => !!value && /^(https?:|blob:|data:)/i.test(value)

const ImageUpload = (props) => {
  const inputField = React.useRef(null)

  const initFilePath = props.defaultValue && props.defaultValue.filePath
  const initFileName = props.defaultValue && props.defaultValue.fileName
  const initBlobUrl = props.defaultValue && props.defaultValue.blobUrl
  const initialDisplay =
    isBrowserUrl(initBlobUrl) || isBrowserUrl(initFilePath) ? initBlobUrl || initFilePath : ''

  const [defaultValue, setDefaultValue] = React.useState(props.defaultValue)
  const [filePath, setFilePath] = React.useState(initFilePath)
  const [fileName, setFileName] = React.useState(initFileName)
  const [blobUrl, setBlobUrl] = React.useState(initBlobUrl)
  const [displayUrl, setDisplayUrl] = React.useState(initialDisplay)
  const [resolveDone, setResolveDone] = React.useState(!!initialDisplay || !initFilePath)
  const [isOpen, setIsOpen] = React.useState(false)
  const [containerSize, setContainerSize] = React.useState({
    width: (props.defaultValue && props.defaultValue.width) || null,
    height: (props.defaultValue && props.defaultValue.height) || null,
  })
  const containerRef = React.useRef(null)
  const shouldObserveResize =
    !!(displayUrl || filePath) && containerSize.width != null && containerSize.height != null

  // Observe user-initiated resizes; guard against re-render-triggered re-fires
  React.useEffect(() => {
    if (!shouldObserveResize) return

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
  }, [shouldObserveResize])

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
    if (props.defaultValue && JSON.stringify(props.defaultValue) !== JSON.stringify(defaultValue)) {
      const newFilePath = props.defaultValue && props.defaultValue.filePath
      const newFileName = props.defaultValue && props.defaultValue.fileName
      const newBlobUrl = props.defaultValue && props.defaultValue.blobUrl
      const nextDisplay =
        isBrowserUrl(newBlobUrl) || isBrowserUrl(newFilePath) ? newBlobUrl || newFilePath : ''

      setDefaultValue(props.defaultValue)
      setFilePath(newFilePath)
      setFileName(newFileName)
      setBlobUrl(newBlobUrl)
      setDisplayUrl(nextDisplay)
      setResolveDone(!!nextDisplay || !newFilePath)
      setContainerSize({
        width: props.defaultValue.width || null,
        height: props.defaultValue.height || null,
      })
    }
  }, [props.defaultValue, defaultValue])

  React.useEffect(() => {
    let cancelled = false

    const resolveDisplayUrl = async () => {
      // Fresh same-session blob previews are fine; saved blob: URLs from prior
      // sessions are dead and must not block resolving filePath.
      if (isBrowserUrl(blobUrl) && String(blobUrl).startsWith('blob:') && !filePath) {
        if (!cancelled) {
          setDisplayUrl(blobUrl)
          setResolveDone(true)
        }
        return
      }
      if (isBrowserUrl(filePath)) {
        if (!cancelled) {
          setDisplayUrl(filePath)
          setResolveDone(true)
        }
        return
      }
      if (isBrowserUrl(blobUrl) && !String(blobUrl).startsWith('blob:')) {
        if (!cancelled) {
          setDisplayUrl(blobUrl)
          setResolveDone(true)
        }
        return
      }
      if (!filePath || typeof props.resolveImageUrl !== 'function') {
        if (!cancelled) {
          setDisplayUrl('')
          setResolveDone(true)
        }
        return
      }
      try {
        const resolved = await props.resolveImageUrl(filePath)
        if (!cancelled) {
          setDisplayUrl(resolved || '')
          setResolveDone(true)
        }
      } catch (error) {
        console.log('resolveImageUrl failed', error)
        if (!cancelled) {
          setDisplayUrl('')
          setResolveDone(true)
        }
      }
    }

    resolveDisplayUrl()
    return () => {
      cancelled = true
    }
  }, [filePath, blobUrl, props.resolveImageUrl])

  const onRemoveImage = React.useCallback(() => {
    Modal.confirm({
      title: 'Confirm delete?',
      content: 'Are you sure you want to delete this image?',
      onOk: () => {
        setFilePath('')
        setFileName('')
        setBlobUrl('')
        setDisplayUrl('')
        setResolveDone(true)
        setContainerSize({ width: null, height: null })
      },
    })
  }, [])

  const handleImageLoad = React.useCallback((event) => {
    const nextWidth = event?.target?.naturalWidth
    const nextHeight = event?.target?.naturalHeight

    if (!nextWidth || !nextHeight) {
      return
    }

    setContainerSize((prev) => {
      if (prev.width != null && prev.height != null) {
        return prev
      }

      return {
        width: prev.width ?? nextWidth,
        height: prev.height ?? nextHeight,
      }
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
      if (!uploadedPath) {
        return
      }

      const newBlobUrl = URL.createObjectURL(file)

      setFileName(file.name)
      setBlobUrl(newBlobUrl)
      setDisplayUrl(newBlobUrl)
      setResolveDone(true)
      setFilePath(`${uploadedPath}${extension}`)
    },
    [props.onUploadImage]
  )

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()
  const rawEditor = props.editor
  const savedEditor = Array.isArray(rawEditor) ? rawEditor[0] : rawEditor
  const hasValue = !!(filePath || blobUrl)
  const previewSrc =
    displayUrl ||
    (isBrowserUrl(blobUrl) && String(blobUrl).startsWith('blob:') ? blobUrl : '')
  const isReadOnly = !!(props.read_only || (props.data && props.data.readOnly))

  // Empty field: anyone who can fill the form may upload.
  // Existing image: only the uploader (editor) or DCC may remove.
  let canEditImage = !isReadOnly
  if (hasValue && savedEditor && savedEditor.userId != null && userProperties) {
    const sameUploader = String(userProperties.userId) === String(savedEditor.userId)
    const isDcc = userProperties.hasDCCRole === true
    canEditImage = !isReadOnly && (sameUploader || isDcc)
  } else if (hasValue && savedEditor && savedEditor.userId != null && !userProperties) {
    canEditImage = false
  }

  const showUpload = resolveDone && canEditImage && !hasValue
  const showRemove = resolveDone && canEditImage && hasValue
  const tooltipText =
    savedEditor && savedEditor.name && hasValue ? `Uploaded by: ${savedEditor.name}` : ''

  const hasExplicitWidth = containerSize.width != null
  const hasExplicitHeight = containerSize.height != null

  return (
    <div
      className={`SortableItem rfb-item${props.data.pageBreakBefore ? ' alwaysbreak' : ''}`}
      title={tooltipText}
    >
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            display: previewSrc ? 'inline-block' : 'block',
            resize: previewSrc ? 'both' : 'none',
            overflow: 'hidden',
            minWidth: 80,
            minHeight: 60,
            maxWidth: '100%',
            ...(containerSize.width && { width: containerSize.width }),
            ...(containerSize.height && { height: containerSize.height }),
          }}
        >
          {showRemove && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
              }}
            >
              <FormDeleteButton title="Remove Image" onClick={onRemoveImage} />
            </div>
          )}
          {previewSrc ? (
            <Image
              onLoad={handleImageLoad}
              style={{
                width: hasExplicitWidth ? '100%' : 'auto',
                maxWidth: '100%',
                height: hasExplicitHeight ? '100%' : 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
              src={previewSrc}
              preview={{
                visible: isOpen,
                onVisibleChange: (visible) => setIsOpen(visible),
                zIndex: 2000,
              }}
            />
          ) : filePath && !resolveDone ? (
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
          {showUpload && (
            <Button
              icon={<UploadOutlined />}
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
