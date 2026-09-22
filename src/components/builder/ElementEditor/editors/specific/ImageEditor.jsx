import React from 'react'
import { Input, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import CheckboxFieldEditor from './CheckboxFieldEditor'

const toNumber = (value) => {
  if (value == null || value === '') return undefined
  const parsed = typeof value === 'number' ? value : parseFloat(String(value).replace(/px$/i, '').trim())
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

const resolveAspectRatio = (element) => {
  const stored = toNumber(element.aspectRatio)
  if (stored) return stored
  const width = toNumber(element.width)
  const height = toNumber(element.height)
  if (width && height) return width / height
  return 1
}

/**
 * Image upload and configuration editor
 * Handles file upload, dimensions, centering, and aspect-ratio lock
 */
const ImageEditor = ({ element, onUploadFile, onChange, onFieldsChange, onBlur }) => {
  const checked_center = 'center' in element ? element.center : false
  const lockAspectRatio = element.lockAspectRatio !== false
  const aspectRatio = resolveAspectRatio(element)

  const updateFields = (fields, options) => {
    if (typeof onFieldsChange === 'function') {
      if (options) {
        onFieldsChange(fields, options)
        return
      }
      onFieldsChange(fields)
      return
    }
    Object.entries(fields).forEach(([key, value]) => {
      const targetKey = typeof value === 'boolean' ? 'checked' : 'value'
      onChange(key, targetKey, { target: { [targetKey]: value } })
    })
  }

  const handleWidthChange = (e) => {
    const nextWidth = e.target.value
    const parsedWidth = toNumber(nextWidth)
    if (lockAspectRatio && parsedWidth) {
      updateFields({
        width: nextWidth,
        height: Math.round(parsedWidth / aspectRatio),
        aspectRatio,
      })
      return
    }
    onChange('width', 'value', e)
  }

  const handleHeightChange = (e) => {
    const nextHeight = e.target.value
    const parsedHeight = toNumber(nextHeight)
    if (lockAspectRatio && parsedHeight) {
      updateFields({
        height: nextHeight,
        width: Math.round(parsedHeight * aspectRatio),
        aspectRatio,
      })
      return
    }
    onChange('height', 'value', e)
  }

  const handleLockChange = (e) => {
    const locked = e.target.checked
    const width = toNumber(element.width)
    const height = toNumber(element.height)
    updateFields(
      {
        lockAspectRatio: locked,
        aspectRatio: width && height ? width / height : aspectRatio,
      },
      { immediate: true }
    )
  }

  return (
    <div>
      <div className="form-group">
        <label className="control-label">Upload Image:</label>
        <Upload
          beforeUpload={(file) => {
            onUploadFile({ target: { files: [file] } })
            return false
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </div>

      <CheckboxFieldEditor
        id="do-center"
        label="Center?"
        checked={checked_center}
        onChange={(e) => onChange('center', 'checked', e)}
      />

      <CheckboxFieldEditor
        id="lock-aspect-ratio"
        label="Lock aspect ratio"
        checked={lockAspectRatio}
        onChange={handleLockChange}
      />

      <div className="form-group">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label className="control-label" htmlFor="elementWidth">
              Width:
            </label>
            <Input
              id="elementWidth"
              value={element.width}
              onBlur={onBlur}
              onChange={handleWidthChange}
            />
          </div>
          <div>
            <label className="control-label" htmlFor="elementHeight">
              Height:
            </label>
            <Input
              id="elementHeight"
              value={element.height}
              onBlur={onBlur}
              onChange={handleHeightChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageEditor
