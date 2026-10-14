import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { InboxOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Checkbox,
  Input,
  Modal,
  Progress,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd'

import store from '../../../contexts/FormBuilderContext'
import { DEFAULT_IMPORT_ACCEPT } from '../../../import/extractors/fileKind'
import { extractFormSchema } from '../../../import/importFormFromFile'
import { schemaToFormElements } from '../../../import/schemaToElements'
import type {
  FormImportConfig,
  ImportProgress,
  ImportedField,
  ImportedFieldType,
  ImportedFormSchema,
} from '../../../import/types'
import type { FormElementData } from '../../../types/form'

const { Text, Paragraph } = Typography
const { Dragger } = Upload

type Stage = 'idle' | 'working' | 'review' | 'error'
type ApplyMode = 'replace' | 'append'

type ReviewRow = {
  id: string
  /** [fieldIndex] or [fieldIndex, childIndex] for column-row children */
  path: [number] | [number, number]
  field: ImportedField
  include: boolean
  isChild: boolean
}

const TYPE_LABELS: Record<Exclude<ImportedFieldType, 'row'>, string> = {
  header: 'Header',
  section: 'Section',
  paragraph: 'Paragraph',
  label: 'Label',
  linebreak: 'Line Break',
  text: 'Text Input',
  textarea: 'Multi-line Input',
  number: 'Number Input',
  date: 'Date',
  dropdown: 'Dropdown',
  checkboxes: 'Checkboxes',
  radio: 'Multiple Choice',
  rating: 'Rating',
  signature: 'Signature',
  fileupload: 'File Upload',
  imageupload: 'Image Upload',
  camera: 'Camera',
  table: 'Table',
}

const TYPE_OPTIONS = (Object.keys(TYPE_LABELS) as Array<Exclude<ImportedFieldType, 'row'>>).map((value) => ({
  value,
  label: TYPE_LABELS[value],
}))

const STATIC_TYPES: ImportedFieldType[] = ['header', 'section', 'paragraph', 'label', 'linebreak']

/** Cells of a column row in reading order; `grid` rows are flattened. */
const rowCells = (field: ImportedField): Array<ImportedField | null> =>
  (field.grid ? field.grid.flat() : field.children || [])

const schemaToRows = (schema: ImportedFormSchema): ReviewRow[] => {
  const rows: ReviewRow[] = []
  schema.fields.forEach((field, index) => {
    if (field.type === 'row') {
      rowCells(field).forEach((child, childIndex) => {
        if (!child) return
        rows.push({
          id: `${index}-${childIndex}`,
          path: [index, childIndex],
          field: { ...child },
          include: true,
          isChild: true,
        })
      })
      return
    }
    rows.push({ id: `${index}`, path: [index], field: { ...field }, include: true, isChild: false })
  })
  return rows
}

const rowsToSchema = (schema: ImportedFormSchema, rows: ReviewRow[]): ImportedFormSchema => {
  const fields: ImportedField[] = []
  schema.fields.forEach((field, index) => {
    if (field.type === 'row' && field.grid) {
      const kept = new Map(
        rows.filter((r) => r.path[0] === index && r.include).map((r) => [r.path[1] ?? 0, r.field])
      )
      let flat = 0
      const grid = field.grid
        .map((line) =>
          line.map((cell) => {
            const at = flat
            flat += 1
            return cell ? kept.get(at) || null : null
          })
        )
        .filter((line) => line.some(Boolean))
      if (grid.length > 0) fields.push({ ...field, grid })
      return
    }
    if (field.type === 'row') {
      const children = rows
        .filter((r) => r.path[0] === index && r.include)
        .sort((a, b) => (a.path[1] ?? 0) - (b.path[1] ?? 0))
        .map((r) => r.field)
      if (children.length === 0) return
      if (children.length === 1) {
        fields.push(children[0])
        return
      }
      fields.push({ ...field, children })
      return
    }
    const row = rows.find((r) => r.path.length === 1 && r.path[0] === index)
    if (row && row.include) fields.push(row.field)
  })
  return { ...schema, fields }
}

const describeField = (field: ImportedField): React.ReactNode => {
  if (field.type === 'table') {
    const cols = field.columns?.length || 0
    const rows = field.rowLabels?.length || field.rows || 0
    return (
      <Text type="secondary">
        {cols}
        {' '}
        columns ×
        {rows}
        {' '}
        rows
      </Text>
    )
  }
  if (field.options && field.options.length > 0) {
    const shown = field.options.slice(0, 4)
    return (
      <Space size={[4, 4]} wrap>
        {shown.map((o) => (
          <Tag key={o} style={{ marginInlineEnd: 0 }}>
            {o}
          </Tag>
        ))}
        {field.options.length > shown.length && (
        <Tag>
          +
          {field.options.length - shown.length}
        </Tag>
)}
      </Space>
    )
  }
  if (field.description) return <Text type="secondary">{field.description}</Text>
  return null
}

type Props = {
  open: boolean
  onClose: () => void
  config?: FormImportConfig
}

const ImportFormModal = ({ open, onClose, config }: Props) => {
  const [stage, setStage] = useState<Stage>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<ImportProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [schema, setSchema] = useState<ImportedFormSchema | null>(null)
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [mode, setMode] = useState<ApplyMode>('replace')
  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  useEffect(
    () => () => {
      mountedRef.current = false
      abortRef.current?.abort()
    },
    []
  )

  const maxBytes = (config?.maxFileSizeMb ?? 25) * 1024 * 1024
  const accept = config?.accept || DEFAULT_IMPORT_ACCEPT

  const existingCount = store.state?.payload?.data?.filter((d: FormElementData) => d && !d.parentId).length || 0

  const runImport = useCallback(
    async (picked: File) => {
      if (picked.size > maxBytes) {
        setError(`File is larger than ${config?.maxFileSizeMb ?? 25} MB`)
        setStage('error')
        return
      }
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setFile(picked)
      setError(null)
      setProgress({ step: 'reading', message: 'Starting…', percent: 0 })
      setStage('working')
      try {
        const result = await extractFormSchema(picked, config || {}, {
          signal: controller.signal,
          onProgress: (p) => {
            if (mountedRef.current && !controller.signal.aborted) setProgress(p)
          },
        })
        if (!mountedRef.current || controller.signal.aborted) return
        if (result.schema.fields.length === 0) {
          setError('No form fields could be detected in this file.')
          setStage('error')
          return
        }
        setSchema(result.schema)
        setRows(schemaToRows(result.schema))
        setStage('review')
      } catch (err) {
        if (!mountedRef.current || controller.signal.aborted) return
        const message = err instanceof Error ? err.message : String(err)
        console.error('[form-builder] import failed:', err)
        setError(message)
        setStage('error')
      }
    },
    [config, maxBytes]
  )

  const cancelWork = useCallback(() => {
    abortRef.current?.abort()
    setStage('idle')
    setProgress(null)
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setStage('idle')
    setFile(null)
    setSchema(null)
    setRows([])
    setError(null)
    setProgress(null)
  }, [])

  const updateRow = useCallback((id: string, patch: Partial<ReviewRow> | ((row: ReviewRow) => ReviewRow)) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row
        return typeof patch === 'function' ? patch(row) : { ...row, ...patch }
      })
    )
  }, [])

  const includedCount = useMemo(() => rows.filter((r) => r.include).length, [rows])

  const apply = useCallback(() => {
    if (!schema || !file) return
    const finalSchema = rowsToSchema(schema, rows)
    const existing: FormElementData[] = store.state?.payload?.data || []
    const elements = schemaToFormElements(finalSchema, {
      existingData: mode === 'append' ? existing : [],
    })
    config?.onImported?.(elements, finalSchema, file)
    const nextData = mode === 'append' ? [...existing, ...elements] : elements
    store.dispatch('updateOrder', nextData)
    onClose()
  }, [schema, file, rows, mode, config, onClose])

  const columns = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'include',
        width: 40,
        render: (_: unknown, row: ReviewRow) => (
          <Checkbox
            checked={row.include}
            aria-label="Include field"
            onChange={(e) => updateRow(row.id, { include: e.target.checked })}
          />
        ),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        width: 170,
        render: (_: unknown, row: ReviewRow) => (
          <Select
            size="small"
            style={{ width: '100%' }}
            value={row.field.type as Exclude<ImportedFieldType, 'row'>}
            options={TYPE_OPTIONS}
            disabled={!row.include}
            onChange={(type) => updateRow(row.id, (r) => ({ ...r, field: { ...r.field, type } }))}
          />
        ),
      },
      {
        title: 'Label / Text',
        dataIndex: 'label',
        render: (_: unknown, row: ReviewRow) => (
          <Input
            size="small"
            value={row.field.label || ''}
            disabled={!row.include || row.field.type === 'linebreak'}
            prefix={row.isChild ? <Text type="secondary">↳</Text> : undefined}
            onChange={(e) => updateRow(row.id, (r) => ({ ...r, field: { ...r.field, label: e.target.value } }))}
          />
        ),
      },
      {
        title: 'Req.',
        dataIndex: 'required',
        width: 56,
        render: (_: unknown, row: ReviewRow) =>
          (STATIC_TYPES.includes(row.field.type) ? null : (
            <Checkbox
              checked={Boolean(row.field.required)}
              disabled={!row.include}
              aria-label="Required"
              onChange={(e) =>
                updateRow(row.id, (r) => ({ ...r, field: { ...r.field, required: e.target.checked } }))}
            />
          )),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        width: 220,
        render: (_: unknown, row: ReviewRow) => describeField(row.field),
      },
    ],
    [updateRow]
  )

  const footer = (() => {
    switch (stage) {
      case 'working':
        return [
          <Button key="cancel" onClick={cancelWork}>
            Cancel
          </Button>,
        ]
      case 'review':
        return [
          <Button key="back" onClick={reset}>
            Choose another file
          </Button>,
          <Button key="apply" type="primary" onClick={apply} disabled={includedCount === 0}>
            {mode === 'replace' ? 'Replace form' : 'Add to form'}
            {' '}
            (
            {includedCount}
            )
          </Button>,
        ]
      case 'error':
        return [
          <Button key="retry" type="primary" onClick={reset}>
            Try another file
          </Button>,
        ]
      default:
        return [
          <Button key="close" onClick={onClose}>
            Close
          </Button>,
        ]
    }
  })()

  return (
    <Modal
      open={open}
      title="Import form from file"
      onCancel={onClose}
      footer={footer}
      width={stage === 'review' ? 860 : 560}
      destroyOnHidden
      maskClosable={stage !== 'working'}
      className="rfb-import-modal"
    >
      {stage === 'idle' && (
        <div>
          <Dragger
            multiple={false}
            maxCount={1}
            accept={accept}
            showUploadList={false}
            beforeUpload={(picked) => {
              runImport(picked as unknown as File)
              return false
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag a file here</p>
            <p className="ant-upload-hint">
              PDF, Word (.docx), spreadsheet (.xlsx / .csv / .numbers) or an image (.png / .jpg). The form layout is
              detected automatically and you can review every field before it is added.
            </p>
          </Dragger>
          <Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0, fontSize: 12 }}>
            Images and scanned PDFs are read with on-device OCR; the OCR engine and language data
            are downloaded on first use. Fillable PDF forms keep their original fields.
          </Paragraph>
        </div>
      )}

      {stage === 'working' && (
        <div style={{ padding: '12px 0' }}>
          <Text strong>{file?.name}</Text>
          <Progress
            percent={progress?.percent ?? 0}
            status="active"
            showInfo={typeof progress?.percent === 'number'}
            style={{ marginTop: 12 }}
          />
          <Text type="secondary">{progress?.message || 'Working…'}</Text>
        </div>
      )}

      {stage === 'error' && (
        <Alert
          type="error"
          showIcon
          message="Import failed"
          description={(
            <div>
              <div>{error}</div>
              {file && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {file.name}
                </Text>
              )}
            </div>
          )}
        />
      )}

      {stage === 'review' && schema && (
        <div>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Space wrap>
              <Text strong>{file?.name}</Text>
              <Tag>{String(schema.meta?.adapter || 'import')}</Tag>
              <Text type="secondary">
                {rows.length}
                {' '}
                field
                {rows.length === 1 ? '' : 's'}
                {' '}
                detected
              </Text>
            </Space>
            <Radio.Group value={mode} onChange={(e) => setMode(e.target.value as ApplyMode)}>
              <Radio value="replace">
                Replace current form
                {existingCount > 0 ? ` (${existingCount} elements)` : ''}
              </Radio>
              <Radio value="append">Append to current form</Radio>
            </Radio.Group>
          </Space>
          <Table<ReviewRow>
            size="small"
            rowKey="id"
            dataSource={rows}
            columns={columns}
            pagination={false}
            scroll={{ y: 380 }}
            style={{ marginTop: 12 }}
            rowClassName={(row) => (row.include ? '' : 'rfb-import-row-excluded')}
          />
        </div>
      )}
    </Modal>
  )
}

export default ImportFormModal
