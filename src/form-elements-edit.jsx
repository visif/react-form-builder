import React, { useState, useRef, useCallback } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import TextAreaAutosize from 'react-textarea-autosize'
import { ContentState, convertFromHTML, convertToRaw, EditorState, convertFromRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
// eslint-disable-next-line import/no-cycle
import DynamicColumnList from './dynamic-column-list'
import DynamicOptionList from './dynamic-option-list'
import FixedRowList from './fixed-row-list'
import { get } from './stores/requests'
import ID from './UUID'
import './styles/draft-align.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

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
    const optionsApiUrl = document.getElementById('optionsApiUrl').value
    if (optionsApiUrl) {
      get(optionsApiUrl).then((data) => {
        props.element.options = []
        const { options } = props.element
        data.forEach((x) => {
          // eslint-disable-next-line no-param-reassign
          x.key = ID.uuid()
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

  // Helper variables for render
  const this_checked = props.element.hasOwnProperty('required')
    ? props.element.required
    : false
    const this_read_only = props.element.hasOwnProperty('readOnly')
      ? props.element.readOnly
      : false
    const this_default_today = props.element.hasOwnProperty('defaultToday')
      ? props.element.defaultToday
      : false
    const this_show_time_select = props.element.hasOwnProperty('showTimeSelect')
      ? props.element.showTimeSelect
      : false
    const this_show_time_select_only = props.element.hasOwnProperty(
      'showTimeSelectOnly'
    )
      ? props.element.showTimeSelectOnly
      : false
    const this_checked_inline = props.element.hasOwnProperty('inline')
      ? props.element.inline
      : false
    const this_checked_bold = props.element.hasOwnProperty('bold')
      ? props.element.bold
      : false
    const this_checked_italic = props.element.hasOwnProperty('italic')
      ? props.element.italic
      : false
    const this_checked_center = props.element.hasOwnProperty('center')
      ? props.element.center
      : false
    const this_checked_page_break = props.element.hasOwnProperty('pageBreakBefore')
      ? props.element.pageBreakBefore
      : false
    const this_checked_alternate_form = props.element.hasOwnProperty('alternateForm')
      ? props.element.alternateForm
      : false

    // Determine if element is inside a DynamicColumnRow or other column container
    const isInsideColumnContainer =
      props.element.parentId &&
      props.preview &&
      typeof props.preview.getDataById === 'function'
        ? (() => {
            const parentElement = props.preview.getDataById(
              props.element.parentId
            )
            return (
              parentElement &&
              (parentElement.element === 'DynamicColumnRow' ||
                parentElement.element?.includes('ColumnRow') ||
                (parentElement.isContainer && parentElement.childItems))
            )
          })()
        : false

    const {
      canHaveDisplayHorizontal,
      canHaveOptionCorrect,
      canHaveOptionValue,
      canHaveInfo,
    } = props.element

    const this_files = props.files.length ? props.files : []
    if (this_files.length < 1 || (this_files.length > 0 && this_files[0].id !== '')) {
      this_files.unshift({ id: '', file_name: '' })
    }

    // Build editor states (prefer stored raw)
    const contentEditorState = getEditorStateFrom(element, 'content')
    const labelEditorState = getEditorStateFrom(element, 'label')

    return (
      <div>
        <div className="clearfix">
          <h4 className="float-left">{props.element.text}</h4>
          <i
            className="float-right fas fa-times dismiss-edit"
            onClick={props.manualEditModeOff}
          />
        </div>
        {props.element.hasOwnProperty('content') && (
          <div className="form-group">
            <label className="control-label">Text to display:</label>
            <Editor
              toolbar={toolbar}
              defaultEditorState={contentEditorState}
              editorState={editorStates.content || contentEditorState}
              onBlur={updateElement}
              onEditorStateChange={(es) => onEditorStateChange('content', es)}
              stripPastedStyles={false}
            />
          </div>
        )}
        {props.element.hasOwnProperty('file_path') && (
          <div className="form-group">
            <label className="control-label" htmlFor="fileSelect">
              Choose file:
            </label>
            <select
              id="fileSelect"
              className="form-control"
              defaultValue={props.element.file_path}
              onBlur={updateElement}
              onChange={(e) => editElementProp("file_path", "value", e)}
            >
              {this_files.map((file) => {
                const this_key = `file_${file.id}`
                return (
                  <option value={file.id} key={this_key}>
                    {file.file_name}
                  </option>
                )
              })}
            </select>
          </div>
        )}
        {props.element.hasOwnProperty('href') && (
          <div className="form-group">
            <TextAreaAutosize
              type="text"
              className="form-control"
              defaultValue={props.element.href}
              onBlur={updateElement}
              onChange={(e) => editElementProp("href", "value", e)}
            />
          </div>
        )}

        {props.element.hasOwnProperty('src') && (
          <div>
            <div className="form-group">
              <input id="srcImage" type="file" onChange={onUploadFile} />
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="srcInput">
                Link to:
              </label>
              <input
                id="srcInput"
                type="text"
                className="form-control"
                value={props.element.src}
                defaultValue={props.element.src}
                onBlur={updateElement}
                onChange={(e) => editElementProp("src", "value", e)}
              />
            </div>
            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  id="do-center"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_checked_center}
                  value
                  onChange={(e) => editElementProp("center", "checked", e)}
                />
                <label className="custom-control-label" htmlFor="do-center">
                  Center?
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <label className="control-label" htmlFor="elementWidth">
                  Width:
                </label>
                <input
                  id="elementWidth"
                  type="text"
                  className="form-control"
                  value={props.element.width}
                  defaultValue={props.element.width}
                  onBlur={updateElement}
                  onChange={(e) => editElementProp("width", "value", e)}
                />
              </div>
              <div className="col-sm-3">
                <label className="control-label" htmlFor="elementHeight">
                  Height:
                </label>
                <input
                  id="elementHeight"
                  type="text"
                  className="form-control"
                  value={props.element.height}
                  defaultValue={props.element.height}
                  onBlur={updateElement}
                  onChange={(e) => editElementProp("height", "value", e)}
                />
              </div>
            </div>
          </div>
        )}

        {(props.element.hasOwnProperty('label') ||
          props.element.element === 'Signature2') && (
          <div className="form-group">
            {props.element.element !== 'Signature2' && (
              <>
                {/* Always show label editing section regardless of container type */}
                <label>Display Label</label>
                <Editor
                  toolbar={toolbar}
                  defaultEditorState={labelEditorState}
                  editorState={editorStates.label || labelEditorState}
                  onBlur={updateElement}
                  onEditorStateChange={(es) => onEditorStateChange('label', es)}
                  stripPastedStyles={false}
                />
                <br />
              </>
            )}

            <div className="custom-control custom-checkbox">
              <input
                id="is-required"
                className="custom-control-input"
                type="checkbox"
                checked={this_checked}
                value
                onChange={(e) => editElementProp("required", "checked", e)}
              />
              <label className="custom-control-label" htmlFor="is-required">
                Required
              </label>
            </div>

            {/* "Display label in column" option removed as it's no longer needed */}

            {/*props.element.hasOwnProperty('defaultToday') && (
              <div className="custom-control custom-checkbox">
                <input
                  id="is-default-to-today"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_default_today}
                  value
                  onChange={(e) => editElementProp("defaultToday", "checked", e)}
                />
                <label className="custom-control-label" htmlFor="is-default-to-today">
                  Default to Today?
                </label>
              </div>
            )*/}

            {props.element.hasOwnProperty('showTimeSelect') && (
              <div className="custom-control custom-checkbox">
                <input
                  id="show-time-select"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_show_time_select}
                  value
                  onChange={(e) => editElementProp("showTimeSelect", "checked", e)}
                />
                <label className="custom-control-label" htmlFor="show-time-select">
                  Show Time Select?
                </label>
              </div>
            )}

            {this_show_time_select &&
              props.element.hasOwnProperty('showTimeSelectOnly') && (
                <div className="custom-control custom-checkbox">
                  <input
                    id="show-time-select-only"
                    className="custom-control-input"
                    type="checkbox"
                    checked={this_show_time_select_only}
                    value
                    onChange={this.editElementProp.bind(
                      this,
                      'showTimeSelectOnly',
                      'checked'
                    )}
                  />
                  <label className="custom-control-label" htmlFor="show-time-select-only">
                    Show Time Select Only?
                  </label>
                </div>
              )}

            {props.element.hasOwnProperty('overdueNotification') && (
              <div className="custom-control custom-checkbox">
                <input
                  id="overdueNotification"
                  className="custom-control-input"
                  type="checkbox"
                  checked={!!props.element.overdueNotification}
                  value
                  onChange={this.editElementProp.bind(
                    this,
                    'overdueNotification',
                    'checked'
                  )}
                />
                <label className="custom-control-label" htmlFor="overdueNotification">
                  Overdue Notification
                </label>
              </div>
            )}

            {(element.element === 'RadioButtons' ||
              element.element === 'Checkboxes') &&
              canHaveDisplayHorizontal && (
                <div className="custom-control custom-checkbox">
                  <input
                    id="display-horizontal"
                    className="custom-control-input"
                    type="checkbox"
                    checked={this_checked_inline}
                    value
                    onChange={(e) => editElementProp("inline", "checked", e)}
                  />
                  <label className="custom-control-label" htmlFor="display-horizontal">
                    Display horizonal
                  </label>
                </div>
              )}
          </div>
        )}

        {element.element === 'Signature' && props.element.readOnly ? (
          <div className="form-group">
            <label className="control-label" htmlFor="variableKey">
              Variable Key:
            </label>
            <input
              id="variableKey"
              type="text"
              className="form-control"
              defaultValue={props.element.variableKey}
              onBlur={updateElement}
              onChange={(e) => editElementProp("variableKey", "value", e)}
            />
            <p className="help-block">
              This will give the element a key that can be used to replace the content
              with a runtime value.
            </p>
          </div>
        ) : (
          <div />
        )}

        {props.element.hasOwnProperty('step') && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="rangeStep">
                Step
              </label>
              <input
                id="rangeStep"
                type="number"
                className="form-control"
                defaultValue={props.element.step}
                onBlur={updateElement}
                onChange={(e) => editElementProp("step", "value", e)}
              />
            </div>
          </div>
        )}

        {props.element.hasOwnProperty('min_value') && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="rangeMin">
                Min
              </label>
              <input
                id="rangeMin"
                type="number"
                className="form-control"
                defaultValue={props.element.min_value}
                onBlur={updateElement}
                onChange={(e) => editElementProp("min_value", "value", e)}
              />
              <input
                type="text"
                className="form-control"
                defaultValue={props.element.min_label}
                onBlur={updateElement}
                onChange={(e) => editElementProp("min_label", "value", e)}
              />
            </div>
          </div>
        )}

        {props.element.hasOwnProperty('max_value') && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="rangeMax">
                Max
              </label>
              <input
                id="rangeMax"
                type="number"
                className="form-control"
                defaultValue={props.element.max_value}
                onBlur={updateElement}
                onChange={(e) => editElementProp("max_value", "value", e)}
              />
              <input
                type="text"
                className="form-control"
                defaultValue={props.element.max_label}
                onBlur={updateElement}
                onChange={(e) => editElementProp("max_label", "value", e)}
              />
            </div>
          </div>
        )}
        {props.element.hasOwnProperty('default_value') && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="defaultSelected">
                Default Selected
              </label>
              <input
                id="defaultSelected"
                type="number"
                className="form-control"
                defaultValue={props.element.default_value}
                onBlur={updateElement}
                onChange={(e) => editElementProp("default_value", "value", e)}
              />
            </div>
          </div>
        )}
        {/*props.element.hasOwnProperty('static') && props.element.static && (
          <div className="form-group">
            <label className="control-label">Text Style</label>
            <div className="custom-control custom-checkbox">
              <input
                id="do-bold"
                className="custom-control-input"
                type="checkbox"
                checked={this_checked_bold}
                value
                onChange={(e) => editElementProp("bold", "checked", e)}
              />
              <label className="custom-control-label" htmlFor="do-bold">
                Bold
              </label>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                id="do-italic"
                className="custom-control-input"
                type="checkbox"
                checked={this_checked_italic}
                value
                onChange={(e) => editElementProp("italic", "checked", e)}
              />
              <label className="custom-control-label" htmlFor="do-italic">
                Italic
              </label>
            </div>
          </div>
        )*/}
        {props.element.showDescription && (
          <div className="form-group">
            <label className="control-label" htmlFor="questionDescription">
              Description
            </label>
            <TextAreaAutosize
              type="text"
              className="form-control"
              id="questionDescription"
              defaultValue={props.element.description}
              onBlur={updateElement}
              onChange={(e) => editElementProp("description", "value", e)}
            />
          </div>
        )}
        {props.showCorrectColumn &&
          props.element.canHaveAnswer &&
          !props.element.hasOwnProperty('options') && (
            <div className="form-group">
              <label className="control-label" htmlFor="correctAnswer">
                Correct Answer
              </label>
              <input
                id="correctAnswer"
                type="text"
                className="form-control"
                defaultValue={props.element.correct}
                onBlur={updateElement}
                onChange={(e) => editElementProp("correct", "value", e)}
              />
            </div>
          )}
        {props.element.hasOwnProperty('header') && (
          <div className="form-group">
            <label className="control-label" htmlFor="header">
              Section Header
            </label>
            <input
              id="header"
              type="text"
              className="form-control"
              defaultValue={props.element.header}
              onBlur={updateElement}
              onChange={(e) => editElementProp("header", "value", e)}
            />
          </div>
        )}
        {props.element.hasOwnProperty('position') && (
          <div className="form-group">
            <label className="control-label" htmlFor="position">
              Role / Position
            </label>
            <input
              id="position"
              type="text"
              className="form-control"
              defaultValue={props.element.position}
              onBlur={updateElement}
              onChange={(e) => editElementProp("position", "value", e)}
            />
          </div>
        )}
        {props.element.hasOwnProperty('specificRole') && (
          <div className="form-group">
            <label className="control-label">
              Pre Defined User / Role {Boolean(props.element.specificRole)}
            </label>
            <select
              className="form-control"
              id="specificRole"
              defaultValue={props.element.specificRole}
              onBlur={updateElement}
              onChange={(e) => editElementProp("specificRole", "value", e)}
            >
              <option value="specific" key="specific">
                Specific role only
              </option>
              <option value="notSpecific" key="notSpecific">
                Anyone can sign
              </option>
            </select>
          </div>
        )}

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

        {props.element.hasOwnProperty('rows') && (
          <div className="form-group">
            <label className="control-label" htmlFor="rowInput">
              Row Count
            </label>
            <input
              id="rowInput"
              type="text"
              className="form-control"
              defaultValue={props.element.rows}
              onBlur={updateElement}
              onChange={(e) => editElementProp("rows", "value", e)}
            />
          </div>
        )}

        {props.element.hasOwnProperty('rowLabels') && (
          <FixedRowList
            data={props.preview?.state?.data}
            updateElement={props.updateElement}
            preview={props.preview}
            element={props.element}
            key="table-row-labels"
          />
        )}

        {props.element.hasOwnProperty('columns') && (
          <DynamicColumnList
            data={props.preview?.state?.data}
            updateElement={props.updateElement}
            preview={props.preview}
            element={props.element}
            key="table-columns"
          />
        )}

        {props.element.hasOwnProperty('sourceType') && (
          <div className="form-group">
            <label className="control-label" htmlFor="sourceType">
              Source Type
            </label>
            <select
              className="form-control"
              id="sourceType"
              defaultValue={props.element.sourceType}
              onBlur={updateElement}
              onChange={(e) => editElementProp("sourceType", "value", e)}
            >
              <option value="name" key="name">
                Name
              </option>
              <option value="department" key="department">
                Department
              </option>
              <option value="role" key="role">
                Role
              </option>
              <option value="form" key="form">
                Form
              </option>
            </select>
          </div>
        )}

        {props.element.sourceType === 'form' && (
          <div>
            {props.element.hasOwnProperty('formSource') && (
              <div className="form-group">
                <label className="control-label" htmlFor="formSource">
                  Form Source
                </label>
                <select
                  className="form-control"
                  id="formSource"
                  value={props.element.formSource}
                  defaultValue={props.element.formSource}
                  onBlur={updateElement}
                  onChange={(e) => editElementProp("formSource", "value", e)}
                >
                  <option value={-1} key={-1}>
                    " Please select "
                  </option>
                  {formDataSource &&
                    formDataSource.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {props.element.sourceType === 'form' && (
              <div className="form-group">
                <label className="control-label" htmlFor="formSource">
                  Select Fields
                </label>
                {activeForm &&
                  activeForm.columns &&
                  activeForm.columns.map((item) => (
                    <div className="custom-control custom-checkbox">
                      <input
                        id={item.field_name}
                        className="custom-control-input"
                        type="checkbox"
                        checked={
                          props.element.hasOwnProperty(`formField${item.field_name}`)
                            ? props.element[`formField${item.field_name}`]
                            : false
                        }
                        value={item.field_name}
                        onChange={this.editElementProp.bind(
                          this,
                          `formField${item.field_name}`,
                          'checked'
                        )}
                      />
                      <label className="custom-control-label" htmlFor={item.field_name}>
                        {item.label || item.text || ''}
                      </label>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {props.element.hasOwnProperty('formula') && (
          <div className="form-group">
            <label className="control-label" htmlFor="rowInput">
              Formula
            </label>
            <input
              id="formula"
              type="text"
              className="form-control"
              defaultValue={props.element.formula}
              onBlur={updateElement}
              onChange={(e) => editElementProp("formula", "value", e)}
            />
          </div>
        )}

        {props.element.hasOwnProperty('formularKey') && (
          <div className="form-group">
            <label className="control-label" htmlFor="rowInput">
              Formula Key
            </label>
            <input
              id="formularKey"
              type="text"
              className="form-control"
              defaultValue={props.element.formularKey}
              onBlur={updateElement}
              onChange={(e) => editElementProp("formularKey", "value", e)}
            />
          </div>
        )}
        {props.element.element === 'FormLink' && (
          <div className="form-group">
            <label className="control-label" htmlFor="formLinkSource">
              Select Form
            </label>
            <select
              className="form-control"
              id="formLinkSource"
              value={props.element.formSource || ''}
              defaultValue={props.element.formSource || ''}
              onBlur={updateElement}
              onChange={(e) => editElementProp("formSource", "value", e)}
            >
              <option value="" key={-1}>
                Select a form...
              </option>
              {formDataSource &&
                formDataSource.map((form) => (
                  <option value={form.id} key={form.id}>
                    {form.name || form.title}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>
    )
}

FormElementsEdit.defaultProps = { className: 'edit-element-fields' }

export default FormElementsEdit
