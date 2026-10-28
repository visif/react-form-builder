import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import FileUpload from './FileUpload'

if (typeof window.ResizeObserver !== 'function') {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

const longName = '1.file-8369.PDF'

describe('FileUpload', () => {
  it('renders the file name on one readable line', () => {
    render(
      <FileUpload
        mutable
        data={{ field_name: 'fileupload_1', isShowLabel: false }}
        defaultValue={{
          fileList: [{ originalName: longName, fileName: 'stored.pdf' }],
        }}
      />
    )

    const nameButton = screen.getByRole('button', { name: new RegExp(longName) })
    expect(nameButton).toHaveClass('rfb-file-upload-name')
    expect(nameButton.querySelector('.rfb-file-upload-name-text')).toHaveTextContent(
      `1.${longName}`
    )
    expect(nameButton.closest('.rfb-file-upload-list')).toBeTruthy()
  })

  it('asks for confirmation before deleting an attached file', () => {
    render(
      <FileUpload
        mutable
        data={{ field_name: 'fileupload_1', isShowLabel: false }}
        defaultValue={{
          fileList: [{ originalName: longName, fileName: 'stored.pdf' }],
        }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Delete file' }))
    expect(screen.getByText('Confirm delete?')).toBeTruthy()
    expect(screen.getByText(`Are you sure you want to delete "${longName}"?`)).toBeTruthy()
  })

  it('does not list a file when the upload returns no server file name', async () => {
    render(
      <FileUpload
        mutable
        data={{ field_name: 'fileupload_1', isShowLabel: false }}
        onUploadFile={async () => ''}
        defaultValue={{ fileList: [] }}
      />
    )

    const input = document.querySelector('input[type="file"]')
    const file = new File(['hello'], 'QP.doc', { type: 'application/msword' })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.queryByText(/QP\.doc/)).toBeNull()
    })
  })
})
