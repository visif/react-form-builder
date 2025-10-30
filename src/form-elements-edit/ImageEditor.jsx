import React from 'react'
import CheckboxFieldEditor from './CheckboxFieldEditor'

/**
 * Image upload and configuration editor
 * Handles file upload, src URL, dimensions, and centering
 */
const ImageEditor = ({
  element,
  onUploadFile,
  onChange,
  onBlur
}) => {
  const checked_center = element.hasOwnProperty('center') ? element.center : false

  return (
    <div>
      <div className="form-group">
        <input id="srcImage" type="file" onChange={onUploadFile} />
      </div>

      <div className="form-group">
        <label className="control-label" htmlFor="srcInput">
          Link to:
        </label>
        <input
          id="srcInput"
          type="text"
          className="form-control"
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

      <div className="row">
        <div className="col-sm-3">
          <label className="control-label" htmlFor="elementWidth">
            Width:
          </label>
          <input
            id="elementWidth"
            type="text"
            className="form-control"
            value={element.width}
            defaultValue={element.width}
            onBlur={onBlur}
            onChange={(e) => onChange('width', 'value', e)}
          />
        </div>
        <div className="col-sm-3">
          <label className="control-label" htmlFor="elementHeight">
            Height:
          </label>
          <input
            id="elementHeight"
            type="text"
            className="form-control"
            value={element.height}
            defaultValue={element.height}
            onBlur={onBlur}
            onChange={(e) => onChange('height', 'value', e)}
          />
        </div>
      </div>
    </div>
  )
}

export default ImageEditor
