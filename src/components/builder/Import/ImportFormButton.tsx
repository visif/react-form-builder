import React, { useCallback, useState } from 'react'

import { FileAddOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import type { FormImportConfig } from '../../../import/types'
import ImportFormModal from './ImportFormModal'

type Props = {
  config?: FormImportConfig
}

/**
 * "Import from file" entry point rendered at the top of the Toolbox.
 */
const ImportFormButton = ({ config }: Props) => {
  const [open, setOpen] = useState(false)
  const show = useCallback(() => setOpen(true), [])
  const hide = useCallback(() => setOpen(false), [])

  return (
    <>
      <Button
        block
        icon={<FileAddOutlined />}
        onClick={show}
        className="rfb-import-button"
        data-testid="rfb-import-button"
      >
        Import from file
      </Button>
      {open && <ImportFormModal open={open} onClose={hide} config={config} />}
    </>
  )
}

export default ImportFormButton
