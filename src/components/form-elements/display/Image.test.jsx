import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { describe, expect, it, vi } from 'vitest'

import Image from './Image'

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeEventListener: () => {},
      addEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

const renderImage = (ui) => render(<DndProvider backend={HTML5Backend}>{ui}</DndProvider>)

describe('Image display element', () => {
  it('shows the original 100x100 empty placeholder when there is no src', () => {
    const { container } = render(<Image mutable data={{ field_name: 'image_1' }} />)

    expect(screen.getByText('No Image')).toBeTruthy()
    expect(container.querySelector('.no-image')).toBeTruthy()
    expect(container.querySelector('.ant-empty')).toBeNull()
  })

  it('sizes the image box from stored pixel width', () => {
    const { container } = render(
      <Image
        mutable
        data={{ src: 'https://example.com/logo.png', width: 100, height: 80 }}
      />
    )

    const box = container.querySelector('.rfb-display-image-box')
    expect(box).toBeTruthy()
    expect(box.style.width).toBe('100px')
    expect(box.style.maxWidth).toBe('100%')
  })

  it('treats editor string width values as CSS pixels', () => {
    const { container } = render(
      <Image
        mutable
        data={{ src: 'https://example.com/logo.png', width: '120', height: '90' }}
      />
    )

    const box = container.querySelector('.rfb-display-image-box')
    expect(box.style.width).toBe('120px')
  })

  it('does not show a resize handle when filling out the form', () => {
    render(
      <Image
        mutable
        data={{ src: 'https://example.com/logo.png', width: 100, height: 80 }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Resize image' })).toBeNull()
  })

  it('shows a mouse resize handle in builder preview', () => {
    renderImage(
      <Image
        preview
        updateElement={() => {}}
        data={{ src: 'https://example.com/logo.png', width: 100, height: 80 }}
      />
    )

    expect(screen.getByRole('button', { name: 'Resize image' })).toBeTruthy()
  })

  it('keeps aspect ratio when dragging the resize handle', () => {
    const updateElement = vi.fn()
    const { container } = renderImage(
      <Image
        preview
        updateElement={updateElement}
        data={{
          src: 'https://example.com/logo.png',
          width: 100,
          height: 50,
          aspectRatio: 2,
          lockAspectRatio: true,
        }}
      />
    )

    const box = container.querySelector('.rfb-display-image-box')
    box.getBoundingClientRect = () => ({
      width: 100,
      height: 50,
      top: 0,
      left: 0,
      bottom: 50,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    })

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Resize image' }), {
      clientX: 100,
      clientY: 50,
    })
    fireEvent.pointerMove(window, { clientX: 200, clientY: 50 })
    fireEvent.pointerUp(window)

    expect(updateElement).toHaveBeenCalledTimes(1)
    const updated = updateElement.mock.calls[0][0]
    expect(updated.width).toBe(200)
    expect(updated.height).toBe(100)
  })
})
