import React from 'react'
import { Input, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import CheckboxFieldEditor from './CheckboxFieldEditor'

/**
 * Image upload and configuration editor
 * Handles file upload, src URL, dimensions, and centering
 */
const ImageEditor = ({ element, onUploadFile, onChange, onBlur }) => {
  const checked_center = 'center' in element ? element.center : false

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

      <div className="form-group">
        <label className="control-label" htmlFor="srcInput">
          Link to:
        </label>
        <Input
          id="srcInput"
          value={element.src}
          defaultValue={element.src}
          onBlur={onBlur}
          onChange={(e) => onChange('src', 'value', e)}
        />
      </div>

      <CheckboxFieldEditor
        id="do-center"
        label="Center?"
        checked={checked_center}
        onChange={(e) => onChange('center', 'checked', e)}
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
              defaultValue={element.width}
              onBlur={onBlur}
              onChange={(e) => onChange('width', 'value', e)}
            />
          </div>
          <div>
            <label className="control-label" htmlFor="elementHeight">
              Height:
            </label>
            <Input
              id="elementHeight"
              value={element.height}
              defaultValue={element.height}
              onBlur={onBlur}
              onChange={(e) => onChange('height', 'value', e)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageEditor
