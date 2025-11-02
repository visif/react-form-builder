import React from 'react'
import { Button, List } from 'antd'
import { UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons'

import ComponentHeader from '../shared/ComponentHeader'

const FileUpload = (props) => {
  const inputField = React.useRef(null)

  const initFileList = (props.defaultValue && props.defaultValue.fileList) || []

  const [defaultValue, setDefaultValue] = React.useState(
    props.defaultValue && props.defaultValue.fileList
  )
  const [fileList, setFileList] = React.useState([...initFileList])

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
      for (let i = 0; i < newFileList.length; i = i + 1) {
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
      // Check if user is the same editor before allowing deletion
      const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

      const savedEditor = props.editor
      let isSameEditor = true
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor =
          userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
      }

      // Only allow deletion if user is the same editor
      if (!isSameEditor) {
        console.log('User not authorized to delete file')
        return
      }

      setFileList((current) => {
        const remainList = current.filter((item) => item.fileName !== file.fileName)
        return [...remainList]
      })
    },
    [props.getActiveUserProperties, props.editor]
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
        <div>
          <input
            multiple
            ref={inputField}
            type="file"
            name="fileUpload"
            title=" "
            style={{ display: 'none' }}
            onChange={onUploadMultipleFiles}
            disabled={!isSameEditor}
          />
          <Button
            icon={<UploadOutlined />}
            onClick={(e) => {
              e.preventDefault()
              inputField && inputField.current.click()
            }}
            disabled={!isSameEditor}
          >
            Upload files
          </Button>
          {fileList && fileList.length > 0 && (
            <List
              style={{ marginTop: '1rem', maxWidth: '450px' }}
              size="small"
              dataSource={fileList}
              renderItem={(file, index) => (
                <List.Item
                  actions={
                    isSameEditor
                      ? [
                          <Button
                            key="delete"
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveFile(file)}
                          />,
                        ]
                      : []
                  }
                >
                  <Button
                    type="link"
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => onDownloadFile(file)}
                    style={{ padding: 0 }}
                  >
                    {index + 1}. {file.originalName}
                  </Button>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUpload
