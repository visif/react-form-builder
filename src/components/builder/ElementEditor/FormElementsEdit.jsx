import React, { useCallback, useRef, useState } from 'react'

import '../../../styles/draft-align.css'
import { get } from '../../../utils/requests'
// eslint-disable-next-line import/no-cycle
import DynamicColumnList from './DynamicColumnList'
import DynamicOptionList from './DynamicOptionList'
import DataSourceEditor from './editors/specific/DataSourceEditor'
import FormLinkEditor from './editors/specific/FormLinkEditor'
import ImageEditor from './editors/specific/ImageEditor'
import LabelEditor from './editors/specific/LabelEditor'
import RangeEditor from './editors/specific/RangeEditor'
import SelectFieldEditor from './editors/specific/SelectFieldEditor'
import SignatureEditor from './editors/specific/SignatureEditor'
// Import reusable field editors
import TextFieldEditor from './editors/specific/TextFieldEditor'
import ReactQuillEditor from './editors/specific/ReactQuillEditor'
import FixedRowList from './FixedRowList'

const FormElementsEdit = (props) => {
  // State
  const [element, setElement] = useState(props.element)
  const [data, setData] = useState(props.data)
  const [dirty, setDirty] = useState(false)
  const [formDataSource, setFormDataSource] = useState([])
  const [activeForm, setActiveForm] = useState(null)

  // Refs for debounced update
  const debouncedPushRef = useRef(null)

  // Debounce utility
  const debounce = useCallback((fn, ms) => {
    let t
    return (...a) => {
      clearTimeout(t)
      t = setTimeout(() => fn(...a), ms)
    }
  }, [])

  // Initialize debounced push on mount
  if (!debouncedPushRef.current) {
    debouncedPushRef.current = debounce(() => updateElement(), 400)
  }

  const onUploadFile = useCallback(
    async (event) => {
      if (!event || !event.target || !event.target.files || !props.onImageUpload) {
        if (!props.onImageUpload) {
          setElement((prev) => {
            const updated = { ...prev }
            updated.src = 'Please provide upload callback'
            return updated
          })
        }

        return
      }

      try {
        const file = event.target.files[0]

        const imageUrl = await props.onImageUpload(file, props.element.id)

        const reader = new FileReader()
        reader.onload = function (e) {
          const img = new Image()
          img.onload = function () {
            setElement((prev) => {
              const updated = { ...prev }
              updated.width = img.width
              updated.height = img.height
              updated.src = imageUrl
              props.updateElement.call(props.preview, updated)
              return updated
            })
          }
          img.src = reader.result
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.log('error upload', error)
        setElement((prev) => {
          const updated = { ...prev }
          updated.src = 'cannot upload file'
          return updated
        })
      }
    },
    [props]
  )

  const editElementProp = useCallback(
    async (elemProperty, targProperty, e) => {
      // elemProperty could be content or label
      // targProperty could be value or checked
      const this_element = { ...element }
      this_element[elemProperty] = e.target[targProperty]

      // Update props.element directly for immediate parent sync
      props.element[elemProperty] = e.target[targProperty]

      if (elemProperty === 'formSource' && formDataSource) {
        const activeFormItem = formDataSource.find((item) => item.id == this_element[elemProperty])

        let activeFormContent = {}

        /// Call api to get current form field

        if (activeFormItem && props.getFormContent) {
          activeFormContent = (await props.getFormContent(activeFormItem)) || {}
        }

        setActiveForm(activeFormContent)
      }

      setElement(this_element)
      setDirty(true)

      // Update immediately for checked properties, debounced for others
      if (targProperty === 'checked') {
        props.updateElement.call(props.preview, this_element)
        setDirty(false)
      } else {
        // Call debounced push for text inputs
        if (debouncedPushRef.current) {
          debouncedPushRef.current()
        }
      }
    },
    [element, formDataSource, props]
  )

  // useEffect for componentDidMount logic
  React.useEffect(() => {
    const loadFormData = async () => {
      if (
        (props.element.element === 'DataSource' || props.element.element === 'FormLink') &&
        props.getFormSource
      ) {
        // call api to get form data - pass element data as parameter
        const formData = (await props.getFormSource(props.element)) || []
        if (formData) {
          const activeFormItem = formData.find((item) => item.id == props.element.formSource)

          /// Call api to get current form field
          if (activeFormItem && props.getFormContent) {
            const activeFormContent = (await props.getFormContent(activeFormItem)) || {}
            setActiveForm(activeFormContent)
          }
        }

        setFormDataSource(formData)
      }
    }

    loadFormData()
  }, []) // Empty deps - only run on mount

  const onContentChange = useCallback(
    (property, html) => {
      const updatedElement = { ...element }
      updatedElement[property] = html

      // Update props.element directly for immediate parent sync
      props.element[property] = html

      setElement(updatedElement)
      setDirty(true)

      // Call debounced push to update parent component
      if (debouncedPushRef.current) {
        debouncedPushRef.current()
      }
    },
    [element, props.element]
  )
  const updateElement = useCallback(() => {
    // Get the current element state and update parent
    const currentElement = element
    props.updateElement.call(props.preview, currentElement)
    setDirty(false)

    // If this is a Signature2 element in a DynamicColumnRow, we need to sync changes
    if (
      currentElement.element === 'Signature2' &&
      currentElement.parentId &&
      currentElement.row !== undefined &&
      currentElement.col !== undefined &&
      props.preview &&
      props.preview.syncRowChanges
    ) {
      props.preview.syncRowChanges(currentElement)
    }
  }, [element, props])

  const addOptions = useCallback(() => {
    const optionsApiUrl = document.getElementById('optionsApiUrl')?.value
    if (optionsApiUrl) {
      get(optionsApiUrl).then((data) => {
        props.element.options = []
        const { options } = props.element
        data.forEach((x) => {
          // eslint-disable-next-line no-param-reassign
          x.key = `${Math.random()}-${Date.now()}`
          options.push(x)
        })
        setElement(element)
        setDirty(true)
      })
    }
  }, [props, element])

  // Update debounced reference to use current updateElement
  React.useEffect(() => {
    debouncedPushRef.current = debounce(() => updateElement(), 400)
  }, [updateElement, debounce])

  // Synchronize dirty flag to props.element if needed
  if (dirty) {
    props.element.dirty = true
  }

  // Extract element capabilities
  const { canHaveDisplayHorizontal, canHaveOptionCorrect, canHaveOptionValue, canHaveInfo } =
    props.element

  // Prepare file options if needed
  const fileOptions = props.files?.length ? props.files : []
  if (fileOptions.length < 1 || (fileOptions.length > 0 && fileOptions[0].id !== '')) {
    fileOptions.unshift({ id: '', file_name: '' })
  }

  // Field-to-component mapping configuration
  const fieldConfigs = [
    {
      condition: () => 'content' in props.element,
      component: ReactQuillEditor,
      props: {
        label: 'Text to display:',
        value: element.content || '',
        onChange: (html) => onContentChange('content', html),
        onBlur: updateElement,
      },
    },
    {
      condition: () => 'file_path' in props.element,
      component: SelectFieldEditor,
      props: {
        id: 'fileSelect',
        label: 'Choose file:',
        value: props.element.file_path,
        options: fileOptions,
        onChange: (e) => editElementProp('file_path', 'value', e),
        onBlur: updateElement,
        renderOption: (file) => (
          <option value={file.id} key={`file_${file.id}`}>
            {file.file_name}
          </option>
        ),
      },
    },
    {
      condition: () => 'href' in props.element,
      component: TextFieldEditor,
      props: {
        id: 'href',
        value: props.element.href,
        onChange: (e) => editElementProp('href', 'value', e),
        onBlur: updateElement,
        multiline: true,
      },
    },
    {
      condition: () => 'src' in props.element,
      component: ImageEditor,
      props: {
        element: props.element,
        onUploadFile,
        onChange: editElementProp,
        onBlur: updateElement,
      },
    },
    {
      condition: () => 'label' in props.element || props.element.element === 'Signature2',
      component: LabelEditor,
      props: {
        element: props.element,
        onChange: editElementProp,
        onContentChange,
        onBlur: updateElement,
        canHaveDisplayHorizontal,
      },
    },
    {
      condition: () => element.element === 'Signature' || element.element === 'Signature2',
      component: SignatureEditor,
      props: {
        element: props.element,
        onChange: editElementProp,
        onBlur: updateElement,
      },
    },
    {
      condition: () =>
        'step' in props.element ||
        'min_value' in props.element ||
        'max_value' in props.element ||
        'default_value' in props.element,
      component: RangeEditor,
      props: {
        element: props.element,
        onChange: editElementProp,
        onBlur: updateElement,
      },
    },
    {
      condition: () => props.element.showDescription,
      component: TextFieldEditor,
      props: {
        id: 'questionDescription',
        label: 'Description',
        value: props.element.description,
        onChange: (e) => editElementProp('description', 'value', e),
        onBlur: updateElement,
        multiline: true,
      },
    },
    {
      condition: () =>
        props.showCorrectColumn && props.element.canHaveAnswer && !('options' in props.element),
      component: TextFieldEditor,
      props: {
        id: 'correctAnswer',
        label: 'Correct Answer',
        value: props.element.correct,
        onChange: (e) => editElementProp('correct', 'value', e),
        onBlur: updateElement,
      },
    },
    {
      condition: () => 'header' in props.element,
      component: TextFieldEditor,
      props: {
        id: 'header',
        label: 'Section Header',
        value: props.element.header,
        onChange: (e) => editElementProp('header', 'value', e),
        onBlur: updateElement,
      },
    },
    {
      condition: () => 'options' in props.element,
      component: DynamicOptionList,
      props: {
        showCorrectColumn: props.showCorrectColumn,
        canHaveOptionCorrect,
        canHaveOptionValue,
        canHaveInfo,
        data: props.preview?.state?.data,
        updateElement: props.updateElement,
        preview: props.preview,
        element: props.element,
        key: `option-${props.element.options?.length || 0}`,
      },
    },
    {
      condition: () => 'rows' in props.element,
      component: TextFieldEditor,
      props: {
        id: 'rowInput',
        label: 'Row Count',
        value: props.element.rows,
        onChange: (e) => editElementProp('rows', 'value', e),
        onBlur: updateElement,
        type: 'text',
      },
    },
    {
      condition: () => 'rowLabels' in props.element,
      component: FixedRowList,
      props: {
        data: props.preview?.state?.data,
        updateElement: props.updateElement,
        preview: props.preview,
        element: props.element,
        key: 'table-row-labels',
      },
    },
    {
      condition: () => 'columns' in props.element,
      component: DynamicColumnList,
      props: {
        data: props.preview?.state?.data,
        updateElement: props.updateElement,
        preview: props.preview,
        element: props.element,
        key: 'table-columns',
      },
    },
    {
      condition: () => 'sourceType' in props.element,
      component: DataSourceEditor,
      props: {
        element: props.element,
        formDataSource,
        activeForm,
        onChange: editElementProp,
        onBlur: updateElement,
      },
    },
    {
      condition: () => 'formula' in props.element,
      component: TextFieldEditor,
      props: {
        id: 'formula',
        label: 'Formula',
        value: props.element.formula,
        onChange: (e) => editElementProp('formula', 'value', e),
        onBlur: updateElement,
      },
    },
    {
      condition: () => 'formularKey' in props.element,
      component: TextFieldEditor,
      props: {
        id: 'formularKey',
        label: 'Formula Key',
        value: props.element.formularKey,
        onChange: (e) => editElementProp('formularKey', 'value', e),
        onBlur: updateElement,
      },
    },
    {
      condition: () => props.element.element === 'FormLink',
      component: FormLinkEditor,
      props: {
        element: props.element,
        formDataSource,
        activeForm,
        onChange: editElementProp,
        onBlur: updateElement,
      },
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 0,
        }}
      >
        <h2 style={{ margin: 0 }}>{props.element.text}</h2>
        <button
          type="button"
          className="dismiss-edit"
          onClick={props.manualEditModeOff}
          style={{
            border: 'none',
            background: 'none',
            padding: '5px',
            paddingRight: '24px',
            cursor: 'pointer',
            fontSize: '125%',
            color: '#333',
          }}
        >
          <i className="fas fa-times" />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '30px' }}>
        {fieldConfigs.map((config, index) => {
          if (!config.condition()) return null
          const Component = config.component
          return <Component key={index} {...config.props} />
        })}
      </div>
    </div>
  )
}

FormElementsEdit.defaultProps = { className: 'edit-element-fields' }

export default FormElementsEdit
