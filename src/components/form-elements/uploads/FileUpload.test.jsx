import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import FileUpload from './FileUpload'

const longName = '1.document-control-ai-robotics-en-th.docx'

describe('FileUpload', () => {
  it('wraps attached file names inside the available column width', () => {
    render(
      <FileUpload
        mutable
        data={{ field_name: 'fileupload_1', isShowLabel: false }}
        defaultValue={{
          fileList: [{ originalName: longName, fileName: 'stored.docx' }],
        }}
      />
    )

    const nameButton = screen.getByRole('button', { name: new RegExp(longName) })
    expect(nameButton).toHaveClass('rfb-file-upload-name')
    expect(nameButton).toHaveStyle({
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
      maxWidth: '100%',
    })
    expect(nameButton.closest('.rfb-file-upload-list')).toBeTruthy()
  })
})
