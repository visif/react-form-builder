import React from 'react'

import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import FormDeleteButton from '../shared/FormDeleteButton'

const getSavedEditor = (editor) => (Array.isArray(editor) ? editor[0] : editor)

const FileUpload = (props) => {
  const inputField = React.useRef(null)

  const initFileList = (props.defaultValue && props.defaultValue.fileList) || []

  const [defaultValue, setDefaultValue] = React.useState(
    props.defaultValue && props.defaultValue.fileList
  )
  const [fileList, setFileList] = React.useState([...initFileList])

  const canEditFiles = React.useCallback(() => {
    const isReadOnly = !!(props.read_only || (props.data && props.data.readOnly))
    return !isReadOnly
  }, [props.read_only, props.data])

  // Sync fileList to FormContext so submission and validation pick it up
  React.useEffect(() => {
    if (props.handleChange && props.data?.field_name) {
      props.handleChange(props.data.field_name, { fileList })
    }
  }, [fileList, props.handleChange, props.data?.field_name])

  React.useEffect(() => {
    console.log('FileUpload >> useEffect (prop sync)')
    console.log(props.defaultValue)
    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue.fileList) !== JSON.stringify(defaultValue)
    ) {
      const newFileList = (props.defaultValue && props.defaultValue.fileList) || []
      setDefaultValue(props.defaultValue && props.defaultValue.fileList)
      setFileList([...newFileList])
    }
  }, [props.defaultValue, defaultValue])

  const uploadAttachFile = React.useCallback(
    async (file) => {
      if (typeof props.onUploadFile !== 'function') {
        console.log('FileUpload >>>>> not upload function found', props.onUploadFile)
        return
      }

      console.log('Uploading file.....')
      const fileName = await props.onUploadFile(file)
      return {
        originalName: file.name,
        fileName,
      }
    },
    [props.onUploadFile]
  )

  const onUploadMultipleFiles = React.useCallback(
    async (event) => {
      event.persist()

      if (!event || !event.target || !event.target.files) {
        return
      }

      const newFileList = Array.from(event.target.files)
      const newResponse = []
      for (let i = 0; i < newFileList.length; i += 1) {
        const currentFile = newFileList[i]
        const response = await uploadAttachFile(currentFile)
        if (response) {
          newResponse.push(response)
        }
      }

      setFileList((current) => [...current, ...newResponse])
    },
    [uploadAttachFile]
  )

  const onDownloadFile = React.useCallback(
    async (file) => {
      if (typeof props.onDownloadFile !== 'function') {
        console.log('FileUpload >>>>> no download function found', props.onDownloadFile)
        return
      }

      console.log('Downloading File file.....')
      await props.onDownloadFile(file)
      console.log('download filtPath: ', file)
    },
    [props.onDownloadFile]
  )

  const onRemoveFile = React.useCallback(
    (file) => {
      if (!canEditFiles()) {
        console.log('User not authorized to delete file')
        return
      }

      setFileList((current) => current.filter((item) => item.fileName !== file.fileName))
    },
    [canEditFiles]
  )

  const savedEditor = getSavedEditor(props.editor)
  const hasValue = fileList && fileList.length > 0
  const canEdit = canEditFiles()
  const files = fileList ? fileList.map((f) => f.originalName).join(', ') : ''
  const tooltipText =
    savedEditor && savedEditor.name && hasValue ? `${files}\nEdited by: ${savedEditor.name}` : ''

  return (
    <div
      className={`SortableItem rfb-item${props.data.pageBreakBefore ? ' alwaysbreak' : ''}`}
      title={tooltipText}
      style={{ minWidth: 0, maxWidth: '100%' }}
    >
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <div>
          <input
            multiple
            ref={inputField}
            type="file"
            name="fileUpload"
            title=" "
            style={{ display: 'none' }}
            onChange={onUploadMultipleFiles}
            disabled={!canEdit}
          />
          <Button
            icon={<UploadOutlined />}
            onClick={(e) => {
              e.preventDefault()
              if (!canEdit) {
                return
              }
              inputField && inputField.current.click()
            }}
            disabled={!canEdit}
          >
            Upload files
          </Button>
          {fileList && fileList.length > 0 && (
            <div className="rfb-file-upload-list">
              {fileList.map((file, index) => (
                <div
                  key={`${file.fileName || file.originalName || 'file'}-${index}`}
                  className="rfb-file-upload-item"
                >
                  <div className="rfb-file-upload-row">
                    <button
                      type="button"
                      className="rfb-file-upload-name"
                      title={file.originalName}
                      onClick={() => onDownloadFile(file)}
                    >
                      <DownloadOutlined className="rfb-file-upload-name-icon" />
                      <span className="rfb-file-upload-name-text">
                        {index + 1}.{file.originalName}
                      </span>
                    </button>
                    {canEdit && (
                      <span className="rfb-file-upload-delete-wrap">
                        <Popconfirm
                          title="Confirm delete?"
                          description={`Are you sure you want to delete "${
                            file.originalName || file.fileName || 'this file'
                          }"?`}
                          okText="Delete"
                          okButtonProps={{ danger: true }}
                          cancelText="Cancel"
                          onConfirm={() => onRemoveFile(file)}
                          zIndex={5000}
                          getPopupContainer={() => document.body}
                        >
                          <FormDeleteButton className="rfb-file-upload-delete" title="Delete file" />
                        </Popconfirm>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUpload
