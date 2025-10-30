import React, { useState, useRef, useCallback } from 'react'
import { ContentState, convertFromHTML, convertToRaw, EditorState, convertFromRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
// eslint-disable-next-line import/no-cycle
import DynamicColumnList from './dynamic-column-list'
import DynamicOptionList from './dynamic-option-list'
import FixedRowList from './fixed-row-list'
import { get } from './stores/requests'
import './styles/draft-align.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// Import reusable field editors
import TextFieldEditor from './form-elements-edit/TextFieldEditor'
import SelectFieldEditor from './form-elements-edit/SelectFieldEditor'
import WysiwygEditor from './form-elements-edit/WysiwygEditor'
import LabelEditor from './form-elements-edit/LabelEditor'
import ImageEditor from './form-elements-edit/ImageEditor'
import RangeEditor from './form-elements-edit/RangeEditor'
import SignatureEditor from './form-elements-edit/SignatureEditor'
import FormLinkEditor from './form-elements-edit/FormLinkEditor'
import DataSourceEditor from './form-elements-edit/DataSourceEditor'

const toolbar = {
  options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'colorPicker', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
  },
  link: {
    popupClassName: 'link-popup-left',  // Add this to position the link popup to the left
  },
  colorPicker: {
    className: 'rainbow-color-picker',  // Add this custom class
    component: undefined,
    popupClassName: 'color-picker-popup-left',  // Add this to position the popup to the left
    colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
             'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)',
             'rgb(0,168,133)', 'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)',
             'rgb(40,50,78)', 'rgb(0,0,0)', 'rgb(247,218,100)', 'rgb(251,160,38)',
             'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)', 'rgb(239,239,239)',
             'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
             'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
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

  const onUploadFile = useCallback(async (event) => {
    if (!event || !event.target || !event.target.files || !props.onImageUpload) {
      if (!props.onImageUpload) {
        setElement(prev => {
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
          setElement(prev => {
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
      setElement(prev => {
        const updated = { ...prev }
        updated.src = 'cannot upload file'
        return updated
      })
    }
  }, [props])

  const editElementProp = useCallback(async (elemProperty, targProperty, e) => {
    // elemProperty could be content or label
    // targProperty could be value or checked
    const this_element = { ...element }
    this_element[elemProperty] = e.target[targProperty]

    if (elemProperty === 'formSource' && formDataSource) {
      const activeFormItem = formDataSource.find(
        (item) => item.id == this_element[elemProperty]
      )

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
  }, [element, formDataSource, props, dirty])

  // useEffect for componentDidMount logic
  React.useEffect(() => {
    const loadFormData = async () => {
      if (
        (props.element.element === 'DataSource' ||
          props.element.element === 'FormLink') &&
        props.getFormSource
      ) {
        // call api to get form data
        const formData = (await props.getFormSource()) || []
        if (formData) {
          const activeFormItem = formData.find(
            (item) => item.id == props.element.formSource
          )

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

  const onEditorStateChange = useCallback((property, editorState) => {
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
    setEditorStates(prev => ({ ...prev, [property]: editorState }))

    // Call debounced push
    if (debouncedPushRef.current) {
      debouncedPushRef.current()
    }
  }, [element])

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
        if (['p','h1','h2','h3','h4','h5','h6','blockquote','pre','li','figure','div'].includes(tag)) {
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
        const align =
          data['text-align'] ||
          data.textAlign ||
          data.textAlignment ||
          data.alignment
        if (!align) return

        // Normalize alignment value
        const a = ['left','right','center','justify'].includes(align) ? align : 'left'

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
  const {
    canHaveDisplayHorizontal,
    canHaveOptionCorrect,
    canHaveOptionValue,
    canHaveInfo,
  } = props.element

  // Prepare file options if needed
  const fileOptions = props.files?.length ? props.files : []
  if (fileOptions.length < 1 || (fileOptions.length > 0 && fileOptions[0].id !== '')) {
    fileOptions.unshift({ id: '', file_name: '' })
  }

  return (
    <div>
      <div className="clearfix">
        <h4 className="float-left">{props.element.text}</h4>
        <i
          className="float-right fas fa-times dismiss-edit"
          onClick={props.manualEditModeOff}
        />
      </div>

      {/* Content Editor (WYSIWYG) */}
      {props.element.hasOwnProperty('content') && (
        <WysiwygEditor
          label="Text to display:"
          toolbar={toolbar}
          defaultEditorState={contentEditorState}
          editorState={editorStates.content || contentEditorState}
          onBlur={updateElement}
          onChange={(es) => onEditorStateChange('content', es)}
          stripPastedStyles={false}
        />
      )}

      {/* File Selection */}
      {props.element.hasOwnProperty('file_path') && (
        <SelectFieldEditor
          id="fileSelect"
          label="Choose file:"
          value={props.element.file_path}
          options={fileOptions}
          onChange={(e) => editElementProp('file_path', 'value', e)}
          onBlur={updateElement}
          renderOption={(file) => (
            <option value={file.id} key={`file_${file.id}`}>
              {file.file_name}
            </option>
          )}
        />
      )}

      {/* Href/Link */}
      {props.element.hasOwnProperty('href') && (
        <TextFieldEditor
          id="href"
          value={props.element.href}
          onChange={(e) => editElementProp('href', 'value', e)}
          onBlur={updateElement}
          multiline
        />
      )}

      {/* Image Upload & Configuration */}
      {props.element.hasOwnProperty('src') && (
        <ImageEditor
          element={props.element}
          onUploadFile={onUploadFile}
          onChange={editElementProp}
          onBlur={updateElement}
        />
      )}

      {/* Label & Required Settings */}
      {(props.element.hasOwnProperty('label') || props.element.element === 'Signature2') && (
        <LabelEditor
          element={props.element}
          labelEditorState={labelEditorState}
          editorStates={editorStates}
          toolbar={toolbar}
          onChange={editElementProp}
          onEditorStateChange={onEditorStateChange}
          onBlur={updateElement}
          canHaveDisplayHorizontal={canHaveDisplayHorizontal}
        />
      )}

      {/* Signature-specific fields */}
      {(element.element === 'Signature' || element.element === 'Signature2') && (
        <SignatureEditor
          element={props.element}
          onChange={editElementProp}
          onBlur={updateElement}
        />
      )}

      {/* Range-specific fields (step, min, max, default) */}
      {(props.element.hasOwnProperty('step') ||
        props.element.hasOwnProperty('min_value') ||
        props.element.hasOwnProperty('max_value') ||
        props.element.hasOwnProperty('default_value')) && (
        <RangeEditor
          element={props.element}
          onChange={editElementProp}
          onBlur={updateElement}
        />
      )}

      {/* Description */}
      {props.element.showDescription && (
        <TextFieldEditor
          id="questionDescription"
          label="Description"
          value={props.element.description}
          onChange={(e) => editElementProp('description', 'value', e)}
          onBlur={updateElement}
          multiline
        />
      )}

      {/* Correct Answer (for grading) */}
      {props.showCorrectColumn &&
        props.element.canHaveAnswer &&
        !props.element.hasOwnProperty('options') && (
          <TextFieldEditor
            id="correctAnswer"
            label="Correct Answer"
            value={props.element.correct}
            onChange={(e) => editElementProp('correct', 'value', e)}
            onBlur={updateElement}
          />
        )}

      {/* Section Header */}
      {props.element.hasOwnProperty('header') && (
        <TextFieldEditor
          id="header"
          label="Section Header"
          value={props.element.header}
          onChange={(e) => editElementProp('header', 'value', e)}
          onBlur={updateElement}
        />
      )}

      {/* Options (Dropdown, RadioButtons, Checkboxes) */}
      {props.element.hasOwnProperty('options') && (
        <DynamicOptionList
          showCorrectColumn={props.showCorrectColumn}
          canHaveOptionCorrect={canHaveOptionCorrect}
          canHaveOptionValue={canHaveOptionValue}
          canHaveInfo={canHaveInfo}
          data={props.preview?.state?.data}
          updateElement={props.updateElement}
          preview={props.preview}
          element={props.element}
          key={`option-${props.element.options.length}`}
        />
      )}

      {/* Table Rows */}
      {props.element.hasOwnProperty('rows') && (
        <TextFieldEditor
          id="rowInput"
          label="Row Count"
          value={props.element.rows}
          onChange={(e) => editElementProp('rows', 'value', e)}
          onBlur={updateElement}
          type="text"
        />
      )}

      {/* Table Row Labels */}
      {props.element.hasOwnProperty('rowLabels') && (
        <FixedRowList
          data={props.preview?.state?.data}
          updateElement={props.updateElement}
          preview={props.preview}
          element={props.element}
          key="table-row-labels"
        />
      )}

      {/* Table Columns */}
      {props.element.hasOwnProperty('columns') && (
        <DynamicColumnList
          data={props.preview?.state?.data}
          updateElement={props.updateElement}
          preview={props.preview}
          element={props.element}
          key="table-columns"
        />
      )}

      {/* DataSource Editor */}
      {props.element.hasOwnProperty('sourceType') && (
        <DataSourceEditor
          element={props.element}
          formDataSource={formDataSource}
          activeForm={activeForm}
          onChange={editElementProp}
          onBlur={updateElement}
        />
      )}

      {/* Formula */}
      {props.element.hasOwnProperty('formula') && (
        <TextFieldEditor
          id="formula"
          label="Formula"
          value={props.element.formula}
          onChange={(e) => editElementProp('formula', 'value', e)}
          onBlur={updateElement}
        />
      )}

      {/* Formula Key */}
      {props.element.hasOwnProperty('formularKey') && (
        <TextFieldEditor
          id="formularKey"
          label="Formula Key"
          value={props.element.formularKey}
          onChange={(e) => editElementProp('formularKey', 'value', e)}
          onBlur={updateElement}
        />
      )}

      {/* FormLink Editor */}
      {props.element.element === 'FormLink' && (
        <FormLinkEditor
          element={props.element}
          formDataSource={formDataSource}
          activeForm={activeForm}
          onChange={editElementProp}
          onBlur={updateElement}
        />
      )}
    </div>
  )
}

FormElementsEdit.defaultProps = { className: 'edit-element-fields' }

export default FormElementsEdit
