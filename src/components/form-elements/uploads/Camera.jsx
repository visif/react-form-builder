import React from 'react'
import { Button, Image } from 'antd'
import { CameraOutlined, CloseOutlined } from '@ant-design/icons'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Camera = (props) => {
  const [img, setImg] = React.useState(null)

  const displayImage = React.useCallback((e) => {
    const { target } = e
    let file
    let reader

    if (target.files && target.files.length) {
      file = target.files[0]
      // eslint-disable-next-line no-undef
      reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = () => {
        setImg(reader.result)
      }
    }
  }, [])

  const clearImage = React.useCallback(() => {
    setImg(null)
  }, [])

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  const name = props.data.field_name
  const fileInputStyle = img ? { display: 'none' } : null
  let sourceDataURL
  if (props.read_only === true && props.defaultValue && props.defaultValue.length > 0) {
    if (props.defaultValue.indexOf(name > -1)) {
      sourceDataURL = props.defaultValue
    } else {
      sourceDataURL = `data:image/png;base64,${props.defaultValue}`
    }
  }
  console.log('sourceDataURL', sourceDataURL)
  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        {props.read_only === true && props.defaultValue && props.defaultValue.length > 0 ? (
          <div>
            <img src={sourceDataURL} />
          </div>
        ) : (
          <div className="image-upload-container">
            <div style={fileInputStyle}>
              <input
                name={name}
                type="file"
                accept="image/*"
                capture="camera"
                className="image-upload"
                onChange={displayImage}
                style={{ display: 'none' }}
                id={`camera-input-${name}`}
              />
              <label htmlFor={`camera-input-${name}`}>
                <Button icon={<CameraOutlined />} onClick={() => document.getElementById(`camera-input-${name}`).click()}>
                  Upload Photo
                </Button>
              </label>
              <p style={{ marginTop: '8px', color: '#8c8c8c' }}>Select an image from your computer or device.</p>
            </div>

            {img && (
              <div>
                <Image src={img} height={100} className="image-upload-preview" />
                <br />
                <Button
                  icon={<CloseOutlined />}
                  onClick={clearImage}
                  danger
                  style={{ marginTop: '8px' }}
                >
                  Clear Photo
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Camera
