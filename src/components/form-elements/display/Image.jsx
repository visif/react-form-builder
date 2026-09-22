import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image as AntImage } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'

const MIN_SIZE = 40

const toPixelSize = (value) => {
  if (value == null || value === '') return undefined
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const parsed = parseFloat(String(value).replace(/px$/i, '').trim())
  return Number.isFinite(parsed) ? parsed : undefined
}

const toRatio = (value) => {
  const parsed = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

const ImageResizeHandle = ({ onResizeStart }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      className="rfb-image-resize-handle"
      aria-label="Resize image"
      title="Drag to resize"
      onPointerDown={onResizeStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      style={{
        backgroundColor: hovered ? '#0958d9' : '#1677ff',
      }}
    />
  )
}

const Image = (props) => {
  const style = props.data.center ? { textAlign: 'center' } : null
  const width = toPixelSize(props.data.width)
  const height = toPixelSize(props.data.height)
  const lockAspectRatio = props.data.lockAspectRatio !== false
  const aspectRatio =
    toRatio(props.data.aspectRatio) || (width && height ? width / height : 1)

  const canResize =
    Boolean(props.data.src) &&
    typeof props.updateElement === 'function' &&
    (Boolean(props.preview) || Boolean(props.editModeOn))

  const boxRef = useRef(null)
  const dataRef = useRef(props.data)
  dataRef.current = props.data
  const dragRef = useRef(null)
  const [draftSize, setDraftSize] = useState(null)

  useEffect(() => {
    setDraftSize(null)
  }, [props.data.width, props.data.height, props.data.src])

  const displayWidth = draftSize?.width ?? width
  const displayHeight = draftSize?.height ?? height

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  const stopResize = useCallback(() => {
    const drag = dragRef.current
    if (!drag) return

    dragRef.current = null
    document.body.classList.remove('rfb-image-resizing')
    window.removeEventListener('pointermove', drag.move)
    window.removeEventListener('pointerup', drag.up)
    window.removeEventListener('pointercancel', drag.up)

    const current = dataRef.current
    const keepRatio = current.lockAspectRatio !== false
    if (typeof props.updateElement === 'function' && drag.currentSize) {
      current.width = drag.currentSize.width
      current.height = drag.currentSize.height
      current.aspectRatio = keepRatio
        ? drag.ratio
        : drag.currentSize.width / drag.currentSize.height
      current.dirty = true
      props.updateElement(current)
    }
  }, [props])

  const onResizeStart = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (!canResize || !boxRef.current) return

      const box = boxRef.current.getBoundingClientRect()
      const startWidth = box.width
      const startHeight = box.height
      const ratio = aspectRatio || (startWidth && startHeight ? startWidth / startHeight : 1)

      const move = (moveEvent) => {
        const dx = moveEvent.clientX - event.clientX
        const dy = moveEvent.clientY - event.clientY
        let nextWidth = Math.max(MIN_SIZE, startWidth + dx)
        let nextHeight = lockAspectRatio
          ? Math.max(MIN_SIZE, nextWidth / ratio)
          : Math.max(MIN_SIZE, startHeight + dy)

        if (lockAspectRatio) {
          nextWidth = nextHeight * ratio
        }

        const currentSize = {
          width: Math.round(nextWidth),
          height: Math.round(nextHeight),
        }
        if (dragRef.current) {
          dragRef.current.currentSize = currentSize
        }
        setDraftSize(currentSize)
      }

      const drag = { move, up: () => stopResize(), ratio, currentSize: null }
      dragRef.current = drag
      document.body.classList.add('rfb-image-resizing')
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', drag.up)
      window.addEventListener('pointercancel', drag.up)

      if (event.currentTarget.setPointerCapture && event.pointerId != null) {
        event.currentTarget.setPointerCapture(event.pointerId)
      }
    },
    [aspectRatio, canResize, lockAspectRatio, stopResize]
  )

  useEffect(
    () => () => {
      document.body.classList.remove('rfb-image-resizing')
    },
    []
  )

  return (
    <div className={baseClasses} style={style}>
      <ComponentHeader {...props} />
      {props.data.src ? (
        <div
          ref={boxRef}
          className={`rfb-display-image-box${canResize ? ' rfb-display-image-box--resizable' : ''}`}
          style={{
            width: displayWidth,
            maxWidth: '100%',
            height: lockAspectRatio ? 'auto' : displayHeight,
          }}
        >
          <AntImage
            classNames={{ root: 'rfb-display-image' }}
            src={props.data.src}
            width="100%"
            styles={{
              root: {
                width: '100%',
                maxWidth: '100%',
                height: lockAspectRatio ? 'auto' : '100%',
              },
              image: {
                width: '100%',
                maxWidth: '100%',
                height: lockAspectRatio ? 'auto' : '100%',
                objectFit: lockAspectRatio ? 'contain' : 'fill',
              },
            }}
            preview={
              canResize
                ? false
                : {
                    mask: 'Click to preview',
                  }
            }
          />
          {canResize ? <ImageResizeHandle onResizeStart={onResizeStart} /> : null}
        </div>
      ) : (
        <div className="no-image">No Image</div>
      )}
    </div>
  )
}

export default Image
