import React, { useCallback, useRef, useState } from 'react'

import { ContentState, convertFromHTML, convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

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
import WysiwygEditor from './editors/specific/WysiwygEditor'
import FixedRowList from './FixedRowList'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const toolbar = {
  options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'colorPicker', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
  },
  link: {
    popupClassName: 'link-popup-left', // Add this to position the link popup to the left
  },
  colorPicker: {
    className: 'rainbow-color-picker', // Add this custom class
    component: undefined,
    popupClassName: 'color-picker-popup-left', // Add this to position the popup to the left
    colors: [
      'rgb(97,189,109)',
      'rgb(26,188,156)',
      'rgb(84,172,210)',
      'rgb(44,130,201)',
      'rgb(147,101,184)',
      'rgb(71,85,119)',
      'rgb(204,204,204)',
      'rgb(65,168,95)',
      'rgb(0,168,133)',
      'rgb(61,142,185)',
      'rgb(41,105,176)',
      'rgb(85,57,130)',
      'rgb(40,50,78)',
      'rgb(0,0,0)',
      'rgb(247,218,100)',
      'rgb(251,160,38)',
      'rgb(235,107,86)',
      'rgb(226,80,65)',
      'rgb(163,143,132)',
      'rgb(239,239,239)',
      'rgb(255,255,255)',
      'rgb(250,197,28)',
      'rgb(243,121,52)',
      'rgb(209,72,65)',
      'rgb(184,49,47)',
      'rgb(124,112,107)',
      'rgb(209,213,216)',
    ],
  },
}

const FormElementsEdit = (props) => {
  // State
  const [element, setElement] = useState(props.element)
  const [data, setData] = useState(props.data)
  const [dirty, setDirty] = useState(false)
  const [formDataSource, setFormDataSource] = useState([])
  const [activeForm, setActiveForm] = useState(null)
  const [editorStates, setEditorStates] = useState({})

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

      if (targProperty === 'checked') {
        // Need to call updateElement immediately for checked properties
        setTimeout(() => {
          if (dirty || targProperty === 'checked') {
            props.updateElement.call(props.preview, this_element)
            setDirty(false)
          }
        }, 0)
      }
    },
    [element, formDataSource, props, dirty]
  )

  // useEffect for componentDidMount logic
  React.useEffect(() => {
    const loadFormData = async () => {
      if (
        (props.element.element === 'DataSource' || props.element.element === 'FormLink') &&
        props.getFormSource
      ) {
        // call api to get form data
        const formData = (await props.getFormSource()) || []
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

  const getEditorStateFrom = useCallback((element, key) => {
    try {
      const rawStr = element[`${key}Raw`]
      if (rawStr) {
        const raw = typeof rawStr === 'string' ? JSON.parse(rawStr) : rawStr
        return EditorState.createWithContent(convertFromRaw(raw))
      }
    } catch (e) {
      // ignore
    }
    if (element[key]) return convertFromHTMLHelper(element[key])
    return EditorState.createEmpty()
  }, [])

  const onEditorStateChange = useCallback(
    (property, editorState) => {
      const contentState = editorState.getCurrentContent()
      const raw = convertToRaw(contentState)

      // Build HTML (original)
      let html = draftToHtml(raw)

      // Patch in alignment styles for blocks (p, li, headers) when present in raw
      html = applyBlockAlignmentStyles(raw, html)

      const updatedElement = { ...element }
      updatedElement[property] = html
      updatedElement[`${property}Raw`] = JSON.stringify(raw)

      setElement(updatedElement)
      setDirty(true)
      setEditorStates((prev) => ({ ...prev, [property]: editorState }))

      // Call debounced push
      if (debouncedPushRef.current) {
        debouncedPushRef.current()
      }
    },
    [element]
  )

  // Inject text-align styles based on block.data alignment fields
  const applyBlockAlignmentStyles = useCallback((raw, html) => {
    if (!raw || !raw.blocks || !html) return html
    if (typeof window === 'undefined' || !window.DOMParser) return html

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // Collect block-level elements (draftjs-to-html keeps order)
      const blockEls = []
      const collect = (node) => {
        if (node.nodeType !== 1) return
        const tag = node.tagName.toLowerCase()
        if (
          [
            'p',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'blockquote',
            'pre',
            'li',
            'figure',
            'div',
          ].includes(tag)
        ) {
          // figure/div can appear for atomic/custom blocks
          blockEls.push(node)
        }
        Array.from(node.children).forEach(collect)
      }
      Array.from(doc.body.children).forEach(collect)

      let idx = 0
      raw.blocks.forEach((block) => {
        const el = blockEls[idx]
        idx += 1
        if (!el) return
        const data = block.data || {}
        const align = data['text-align'] || data.textAlign || data.textAlignment || data.alignment
        if (!align) return

        // Normalize alignment value
        const a = ['left', 'right', 'center', 'justify'].includes(align) ? align : 'left'

        // Apply inline style (if not stripped later)
        const prev = el.getAttribute('style') || ''
        if (!prev.includes('text-align')) {
          el.setAttribute('style', `text-align:${a};${prev}`)
        }

        // Add class for resilience
        el.classList.add(`draft-align-${a}`)

        // If list item, also align parent list container
        if (el.tagName.toLowerCase() === 'li' && el.parentElement) {
          const listParent = el.parentElement
          const parentPrev = listParent.getAttribute('style') || ''
          if (!parentPrev.includes('text-align')) {
            listParent.setAttribute('style', `text-align:${a};${parentPrev}`)
          }
          listParent.classList.add(`draft-align-${a}`)
        }
      })

      return doc.body.innerHTML
    } catch (e) {
      return html
    }
  }, [])

  const updateElement = useCallback(() => {
    // to prevent ajax calls with no change
    if (dirty) {
      props.updateElement.call(props.preview, element)
      setDirty(false)
    }

    // If this is a Signature2 element in a DynamicColumnRow, we need to sync changes
    if (
      element.element === 'Signature2' &&
      element.parentId &&
      element.row !== undefined &&
      element.col !== undefined &&
      props.preview &&
      props.preview.syncRowChanges
    ) {
      props.preview.syncRowChanges(element)
    }
  }, [dirty, props, element])

  const convertFromHTMLHelper = useCallback((content) => {
    const newContent = convertFromHTML(content || '')
    if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
      // to prevent crash when no contents in editor
      return EditorState.createEmpty()
    }
    const contentState = ContentState.createFromBlockArray(newContent)
    return EditorState.createWithContent(contentState)
  }, [])

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

  // Build editor states (prefer stored raw)
  const contentEditorState = getEditorStateFrom(element, 'content')
  const labelEditorState = getEditorStateFrom(element, 'label')

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
      component: WysiwygEditor,
      props: {
        label: 'Text to display:',
        toolbar,
        defaultEditorState: contentEditorState,
        editorState: editorStates.content || contentEditorState,
        onBlur: updateElement,
        onChange: (es) => onEditorStateChange('content', es),
        stripPastedStyles: false,
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
        labelEditorState,
        editorStates,
        toolbar,
        onChange: editElementProp,
        onEditorStateChange,
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
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <h4 style={{ margin: 0 }}>{props.element.text}</h4>
        <button
          type="button"
          className="dismiss-edit"
          onClick={props.manualEditModeOff}
          style={{
            border: 'none',
            background: 'none',
            padding: '5px',
            cursor: 'pointer',
            fontSize: '125%',
            color: '#333',
          }}
        >
          <i className="fas fa-times" />
        </button>
      </div>

      {fieldConfigs.map((config, index) => {
        if (!config.condition()) return null
        const Component = config.component
        return <Component key={index} {...config.props} />
      })}
    </div>
  )
}

FormElementsEdit.defaultProps = { className: 'edit-element-fields' }

export default FormElementsEdit
