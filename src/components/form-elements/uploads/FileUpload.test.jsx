import React from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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
    expect(nameButton.querySelector('.anticon-download')).toBeNull()
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy()
    expect(nameButton.closest('.rfb-file-upload-list')).toBeTruthy()
  })

  it('views a pdf from the file name and downloads from the icon', () => {
    const onViewFile = vi.fn()
    const onDownloadFile = vi.fn()
    const file = { originalName: 'report.pdf', fileName: '1.pdf' }

    render(
      <FileUpload
        mutable
        data={{ field_name: 'fileupload_1', isShowLabel: false }}
        onViewFile={onViewFile}
        onDownloadFile={onDownloadFile}
        defaultValue={{ fileList: [file] }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /report\.pdf/ }))
    expect(onViewFile).toHaveBeenCalledWith(file)
    expect(onDownloadFile).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Download' }))
    expect(onDownloadFile).toHaveBeenCalledWith(file)
  })

  it('asks before downloading a file that cannot be viewed', async () => {
    const onViewFile = vi.fn()
    const onDownloadFile = vi.fn()
    const file = { originalName: 'archive.zip', fileName: '2.zip' }

    render(
      <FileUpload
        mutable
        data={{ field_name: 'fileupload_1', isShowLabel: false }}
        onViewFile={onViewFile}
        onDownloadFile={onDownloadFile}
        defaultValue={{ fileList: [file] }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Download' }))
    expect(onDownloadFile).toHaveBeenCalledWith(file)
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /archive\.zip/ }))
    expect(onViewFile).not.toHaveBeenCalled()

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getAllByText('This file cannot be viewed').length).toBeGreaterThan(0)
    expect(
      within(dialog).getByText('Do you want to download "archive.zip" instead?')
    ).toBeTruthy()

    fireEvent.click(within(dialog).getByRole('button', { name: 'Download' }))
    await waitFor(() => {
      expect(onDownloadFile).toHaveBeenCalledTimes(2)
    })
    expect(onDownloadFile).toHaveBeenLastCalledWith(file)
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
