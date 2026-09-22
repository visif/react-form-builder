import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ImageEditor from './ImageEditor'

describe('ImageEditor', () => {
  const baseElement = {
    src: 'https://example.com/logo.png',
    width: 100,
    height: 50,
    aspectRatio: 2,
    center: false,
  }

  it('hides the Link to input', () => {
    render(
      <ImageEditor
        element={baseElement}
        onUploadFile={() => {}}
        onChange={() => {}}
        onBlur={() => {}}
      />
    )

    expect(screen.queryByLabelText('Link to:')).toBeNull()
    expect(screen.queryByText('Link to:')).toBeNull()
    expect(screen.getByText('Upload Image:')).toBeTruthy()
  })

  it('locks aspect ratio by default', () => {
    render(
      <ImageEditor
        element={baseElement}
        onUploadFile={() => {}}
        onChange={() => {}}
        onBlur={() => {}}
      />
    )

    const lock = screen.getByLabelText('Lock aspect ratio')
    expect(lock.checked).toBe(true)
  })

  it('updates height to match aspect ratio when width changes', () => {
    const onFieldsChange = vi.fn()

    render(
      <ImageEditor
        element={baseElement}
        onUploadFile={() => {}}
        onChange={() => {}}
        onFieldsChange={onFieldsChange}
        onBlur={() => {}}
      />
    )

    fireEvent.change(screen.getByLabelText('Width:'), { target: { value: '200' } })

    expect(onFieldsChange).toHaveBeenCalledWith({
      width: '200',
      height: 100,
      aspectRatio: 2,
    })
  })
})
