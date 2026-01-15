import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import TextAreaAutosize from 'react-textarea-autosize'
import {
  ContentState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
// eslint-disable-next-line import/no-cycle
import DynamicColumnList from './dynamic-column-list'
import DynamicOptionList from './dynamic-option-list'
import FixedRowList from './fixed-row-list'
import { get } from './stores/requests'
import './styles/draft-align.css'
import ID from './UUID'

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

export default class FormElementsEdit extends React.Component {
  constructor(props) {
    super(props)
    this.debouncedPush = this.debounce(() => this.updateElement(), 400)
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      formDataSource: [],
      activeForm: null,
      // keep ephemeral editor states if you want fully controlled editors
      editorStates: {},
    }

    // Synchronously track the latest element edits to avoid setState race conditions
    this.latestElement = this.props.element
  }

  debounce(fn, ms) {
    let t
    const debounced = (...a) => {
      clearTimeout(t)
      t = setTimeout(() => fn(...a), ms)
    }
    debounced.flush = () => {
      clearTimeout(t)
      fn()
    }
    debounced.cancel = () => {
      clearTimeout(t)
    }
    return debounced
  }

  async onUploadFile(event) {
    if (!event || !event.target || !event.target.files || !this.props.onImageUpload) {
      if (!this.props.onImageUpload) {
        const this_element = this.state.element
        this_element.src = 'Please provide upload callback'
        this.setState({
          element: this_element,
        })
      }

      return
    }

    try {
      const file = event.target.files[0]

      const imageUrl = await this.props.onImageUpload(file, this.props.element.id)

      const reader = new FileReader()
      reader.onload = function (e) {
        const img = new Image()
        img.onload = function () {
          const this_element = this.state.element
          this_element.width = img.width
          this_element.height = img.height
          this_element.src = imageUrl
          this.setState({
            element: this_element,
          })
          this.props.updateElement.call(this.props.preview, this_element)
        }.bind(this)
        img.src = reader.result
      }.bind(this)
      reader.readAsDataURL(file)
    } catch (error) {
      console.log('error upload', error)
      const this_element = this.state.element
      this_element.src = 'cannot upload file'
      this.setState({
        element: this_element,
      })
    }
  }

  async componentDidMount() {
    let formDataSource = []
    let activeForm = {}
    let activeFormContent = {}

    if (
      (this.props.element.element === 'DataSource' ||
        this.props.element.element === 'FormLink') &&
      this.props.getFormSource
    ) {
      // call api to get form data
      formDataSource = (await this.props.getFormSource()) || []
      if (formDataSource) {
        activeForm = formDataSource.find(
          (item) => item.id == this.props.element.formSource
        )

        /// Call api to get current form field
        if (activeForm && this.props.getFormContent) {
          activeFormContent = (await this.props.getFormContent(activeForm)) || {}
        }
      }

      this.setState((current) => ({
        ...current,
        formDataSource,
        activeForm: activeFormContent,
      }))
    }
  }

  componentDidUpdate(prevProps) {
    // Update state when element prop changes (e.g., when reopening the edit modal)
    if (prevProps.element !== this.props.element) {
      // Keep synchronous copy updated too
      this.latestElement = this.props.element

      // If a different element was selected (different id), reset editorStates
      const prevId = prevProps.element && prevProps.element.id
      const newId = this.props.element && this.props.element.id
      if (prevId !== newId) {
        this.setState({
          element: this.props.element,
          data: this.props.data,
          dirty: false,
          editorStates: {}, // Reset editor states to use new content
        })
      } else {
        // Same element updated (e.g., save returned), preserve editorStates to avoid cursor jump
        this.setState({
          element: this.props.element,
          data: this.props.data,
          dirty: false,
        })
      }
    }
  }

  async editElementProp(elemProperty, targProperty, e) {
    // elemProperty could be content or label
    // targProperty could be value or checked
    const this_element = this.state.element
    this_element[elemProperty] = e.target[targProperty]

    if (elemProperty === 'formSource' && this.state.formDataSource) {
      const activeForm = this.state.formDataSource.find(
        (item) => item.id == this_element[elemProperty]
      )

      let activeFormContent = {}

      /// Call api to get current form field

      if (activeForm && this.props.getFormContent) {
        activeFormContent = (await this.props.getFormContent(activeForm)) || {}
      }

      this.setState((current) => ({
        ...current,
        activeForm: activeFormContent,
      }))
    }

    this.latestElement = this_element
    this.setState(
      {
        element: this_element,
        dirty: true,
      },
      () => {
        if (targProperty === 'checked') {
          this.updateElement()
        }
      }
    )
  }

  getEditorStateFrom(element, key) {
    try {
      const rawStr = element[`${key}Raw`]
      if (rawStr) {
        const raw = typeof rawStr === 'string' ? JSON.parse(rawStr) : rawStr
        return EditorState.createWithContent(convertFromRaw(raw))
      }
    } catch (e) {
      // ignore
    }
    if (element[key]) return this.convertFromHTML(element[key])
    return EditorState.createEmpty()
  }

  onEditorStateChange(property, editorState) {
    const contentState = editorState.getCurrentContent()
    const raw = convertToRaw(contentState)

    // Build HTML (original)
    let html = draftToHtml(raw)

    // Patch in alignment styles for blocks (p, li, headers) when present in raw
    html = this.applyBlockAlignmentStyles(raw, html)

    const element = { ...this.state.element }
    element[property] = html
    element[`${property}Raw`] = JSON.stringify(raw)

    // Keep synchronous copy to avoid losing edits if user quickly edits options
    this.latestElement = element

    // Debug: log label updates
    if (property === 'label' && typeof console !== 'undefined') {
      console.log('[FormElementsEdit] onEditorStateChange - label (preview)', {
        id: element?.id,
        label: element?.label?.slice?.(0, 200),
      })
    }

    this.setState(
      {
        element,
        dirty: true,
        editorStates: { ...this.state.editorStates, [property]: editorState },
      },
      this.debouncedPush
    )
  }

  // Inject text-align styles based on block.data alignment fields
  applyBlockAlignmentStyles(raw, html) {
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
        const align =
          data['text-align'] || data.textAlign || data.textAlignment || data.alignment
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
  }

  updateElement = () => {
    const this_element = this.latestElement || this.state.element
    // Debug: show what is being saved from parent
    if (typeof console !== 'undefined') {
      console.log('[FormElementsEdit] updateElement - saving element', {
        id: this_element?.id,
        label: this_element?.label?.slice?.(0, 200),
        options: this_element?.options?.map?.((o) => ({ text: o.text, value: o.value })),
      })
    }
    // to prevent ajax calls with no change
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element)
      this.setState({ dirty: false })
    }

    // If this is a Signature2 element in a DynamicColumnRow, we need to sync changes
    if (
      this_element.element === 'Signature2' &&
      this_element.parentId &&
      this_element.row !== undefined &&
      this_element.col !== undefined &&
      this.props.preview &&
      this.props.preview.syncRowChanges
    ) {
      this.props.preview.syncRowChanges(this_element)
    }
  }

  // Wrapper for child components to ensure pending label/content updates are saved first
  updateElementWithFlush = (childElement) => {
    // Cancel any pending debounced updates (avoid double-save races)
    if (this.debouncedPush && this.debouncedPush.cancel) {
      this.debouncedPush.cancel()
    }

    // Use latestElement to get synchronously updated values
    const currentElement = this.latestElement || this.state.element

    // Merge: preserve parent's label/content but accept child's options/columns/rows
    const mergedElement = {
      ...childElement,
      label: currentElement.label,
      labelRaw: currentElement.labelRaw,
      content: currentElement.content,
      contentRaw: currentElement.contentRaw,
      dirty: true,
    }

    if (typeof console !== 'undefined' && console.debug) {
      console.debug('[FormElementsEdit] updateElementWithFlush - mergedElement', {
        id: mergedElement?.id,
        label: mergedElement?.label?.slice?.(0, 200),
        options: mergedElement?.options?.map?.((o) => ({ text: o.text, value: o.value })),
      })
    }

    // Clear dirty flag since we're saving now
    this.setState({ dirty: false })
    this.props.updateElement.call(this.props.preview, mergedElement)
  }

  onEditorBlur = () => {
    // Flush any pending debounced updates immediately when editor loses focus
    if (this.debouncedPush && this.debouncedPush.flush) {
      this.debouncedPush.flush()
    }
  }

  convertFromHTML(content) {
    const newContent = convertFromHTML(content || '')
    if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
      // to prevent crash when no contents in editor
      return EditorState.createEmpty()
    }
    const contentState = ContentState.createFromBlockArray(newContent)
    return EditorState.createWithContent(contentState)
  }

  addOptions() {
    const optionsApiUrl = document.getElementById('optionsApiUrl').value
    if (optionsApiUrl) {
      get(optionsApiUrl).then((data) => {
        this.props.element.options = []
        const { options } = this.props.element
        data.forEach((x) => {
          // eslint-disable-next-line no-param-reassign
          x.key = ID.uuid()
          options.push(x)
        })
        const this_element = this.state.element
        this.setState({
          element: this_element,
          dirty: true,
        })
      })
    }
  }

  render() {
    if (this.state.dirty) {
      this.props.element.dirty = true
    }

    const this_checked = this.props.element.hasOwnProperty('required')
      ? this.props.element.required
      : false
    const this_read_only = this.props.element.hasOwnProperty('readOnly')
      ? this.props.element.readOnly
      : false
    const this_default_today = this.props.element.hasOwnProperty('defaultToday')
      ? this.props.element.defaultToday
      : false
    const this_show_time_select = this.props.element.hasOwnProperty('showTimeSelect')
      ? this.props.element.showTimeSelect
      : false
    const this_show_time_select_only = this.props.element.hasOwnProperty(
      'showTimeSelectOnly'
    )
      ? this.props.element.showTimeSelectOnly
      : false
    const this_checked_inline = this.props.element.hasOwnProperty('inline')
      ? this.props.element.inline
      : false
    const this_checked_bold = this.props.element.hasOwnProperty('bold')
      ? this.props.element.bold
      : false
    const this_checked_italic = this.props.element.hasOwnProperty('italic')
      ? this.props.element.italic
      : false
    const this_checked_center = this.props.element.hasOwnProperty('center')
      ? this.props.element.center
      : false
    const this_checked_page_break = this.props.element.hasOwnProperty('pageBreakBefore')
      ? this.props.element.pageBreakBefore
      : false
    const this_checked_alternate_form = this.props.element.hasOwnProperty('alternateForm')
      ? this.props.element.alternateForm
      : false

    // Determine if element is inside a DynamicColumnRow or other column container
    const isInsideColumnContainer =
      this.props.element.parentId &&
      this.props.preview &&
      typeof this.props.preview.getDataById === 'function'
        ? (() => {
            const parentElement = this.props.preview.getDataById(
              this.props.element.parentId
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
    } = this.props.element

    const this_files = this.props.files.length ? this.props.files : []
    if (this_files.length < 1 || (this_files.length > 0 && this_files[0].id !== '')) {
      this_files.unshift({ id: '', file_name: '' })
    }

    // Build editor states (prefer stored raw)
    const contentEditorState = this.getEditorStateFrom(this.state.element, 'content')
    const labelEditorState = this.getEditorStateFrom(this.state.element, 'label')

    return (
      <div>
        <div className="clearfix">
          <h4 className="float-left">{this.props.element.text}</h4>
          <i
            className="float-right fas fa-times dismiss-edit"
            onClick={this.props.manualEditModeOff}
          />
        </div>
        {this.props.element.hasOwnProperty('content') &&
          this.props.element.content != null && (
            <div className="form-group">
              <label className="control-label">Text to display:</label>
              <Editor
                toolbar={toolbar}
                defaultEditorState={contentEditorState}
                editorState={this.state.editorStates.content || contentEditorState}
                onBlur={this.onEditorBlur}
                onEditorStateChange={(es) => this.onEditorStateChange('content', es)}
                stripPastedStyles={false}
              />
            </div>
          )}
        {this.props.element.hasOwnProperty('file_path') && (
          <div className="form-group">
            <label className="control-label" htmlFor="fileSelect">
              Choose file:
            </label>
            <select
              id="fileSelect"
              className="form-control"
              defaultValue={this.props.element.file_path}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'file_path', 'value')}
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
        {this.props.element.hasOwnProperty('href') && (
          <div className="form-group">
            <TextAreaAutosize
              type="text"
              className="form-control"
              defaultValue={this.props.element.href}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'href', 'value')}
            />
          </div>
        )}

        {this.props.element.hasOwnProperty('src') && (
          <div>
            <div className="form-group">
              <input id="srcImage" type="file" onChange={this.onUploadFile.bind(this)} />
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="srcInput">
                Link to:
              </label>
              <input
                id="srcInput"
                type="text"
                className="form-control"
                value={this.props.element.src}
                defaultValue={this.props.element.src}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, 'src', 'value')}
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
                  onChange={this.editElementProp.bind(this, 'center', 'checked')}
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
                  value={this.props.element.width}
                  defaultValue={this.props.element.width}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(this, 'width', 'value')}
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
                  value={this.props.element.height}
                  defaultValue={this.props.element.height}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(this, 'height', 'value')}
                />
              </div>
            </div>
          </div>
        )}

        {(this.props.element.hasOwnProperty('label') ||
          this.props.element.element === 'Signature2') && (
          <div className="form-group">
            {this.props.element.element !== 'Signature2' && (
              <>
                <label>Display Label</label>
                <Editor
                  toolbar={toolbar}
                  defaultEditorState={labelEditorState}
                  editorState={this.state.editorStates.label || labelEditorState}
                  onBlur={this.onEditorBlur}
                  onEditorStateChange={(es) => this.onEditorStateChange('label', es)}
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
                onChange={this.editElementProp.bind(this, 'required', 'checked')}
              />
              <label className="custom-control-label" htmlFor="is-required">
                Required
              </label>
            </div>

            {this.props.element.hasOwnProperty('showTimeSelect') && (
              <div className="custom-control custom-checkbox">
                <input
                  id="show-time-select"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_show_time_select}
                  value
                  onChange={this.editElementProp.bind(this, 'showTimeSelect', 'checked')}
                />
                <label className="custom-control-label" htmlFor="show-time-select">
                  Show Time Select?
                </label>
              </div>
            )}

            {this_show_time_select &&
              this.props.element.hasOwnProperty('showTimeSelectOnly') && (
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

            {this.props.element.hasOwnProperty('overdueNotification') && (
              <div className="custom-control custom-checkbox">
                <input
                  id="overdueNotification"
                  className="custom-control-input"
                  type="checkbox"
                  checked={!!this.props.element.overdueNotification}
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

            {(this.state.element.element === 'RadioButtons' ||
              this.state.element.element === 'Checkboxes') &&
              canHaveDisplayHorizontal && (
                <div className="custom-control custom-checkbox">
                  <input
                    id="display-horizontal"
                    className="custom-control-input"
                    type="checkbox"
                    checked={this_checked_inline}
                    value
                    onChange={this.editElementProp.bind(this, 'inline', 'checked')}
                  />
                  <label className="custom-control-label" htmlFor="display-horizontal">
                    Display horizonal
                  </label>
                </div>
              )}
          </div>
        )}

        {this.state.element.element === 'Signature' && this.props.element.readOnly ? (
          <div className="form-group">
            <label className="control-label" htmlFor="variableKey">
              Variable Key:
            </label>
            <input
              id="variableKey"
              type="text"
              className="form-control"
              defaultValue={this.props.element.variableKey}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'variableKey', 'value')}
            />
            <p className="help-block">
              This will give the element a key that can be used to replace the content
              with a runtime value.
            </p>
          </div>
        ) : (
          <div />
        )}

        {this.props.element.hasOwnProperty('step') && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="rangeStep">
                Step
              </label>
              <input
                id="rangeStep"
                type="number"
                className="form-control"
                defaultValue={this.props.element.step}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, 'step', 'value')}
              />
            </div>
          </div>
        )}

        {this.props.element.hasOwnProperty('min_value') && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="rangeMin">
                Min
              </label>
              <input
                id="rangeMin"
                type="number"
                className="form-control"
                defaultValue={this.props.element.min_value}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, 'min_value', 'value')}
              />
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.element.min_label}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, 'min_label', 'value')}
              />
            </div>
          </div>
        )}

        {this.props.element.hasOwnProperty('max_value') && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="rangeMax">
                Max
              </label>
              <input
                id="rangeMax"
                type="number"
                className="form-control"
                defaultValue={this.props.element.max_value}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, 'max_value', 'value')}
              />
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.element.max_label}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, 'max_label', 'value')}
              />
            </div>
          </div>
        )}

        {this.props.element.hasOwnProperty('default_value') && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="defaultSelected">
                Default Selected
              </label>
              <input
                id="defaultSelected"
                type="number"
                className="form-control"
                defaultValue={this.props.element.default_value}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, 'default_value', 'value')}
              />
            </div>
          </div>
        )}

        {this.props.element.showDescription && (
          <div className="form-group">
            <label className="control-label" htmlFor="questionDescription">
              Description
            </label>
            <TextAreaAutosize
              type="text"
              className="form-control"
              id="questionDescription"
              defaultValue={this.props.element.description}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'description', 'value')}
            />
          </div>
        )}

        {this.props.showCorrectColumn &&
          this.props.element.canHaveAnswer &&
          !this.props.element.hasOwnProperty('options') && (
            <div className="form-group">
              <label className="control-label" htmlFor="correctAnswer">
                Correct Answer
              </label>
              <input
                id="correctAnswer"
                type="text"
                className="form-control"
                defaultValue={this.props.element.correct}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, 'correct', 'value')}
              />
            </div>
          )}
        {this.props.element.hasOwnProperty('header') && (
          <div className="form-group">
            <label className="control-label" htmlFor="header">
              Section Header
            </label>
            <input
              id="header"
              type="text"
              className="form-control"
              defaultValue={this.props.element.header}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'header', 'value')}
            />
          </div>
        )}
        {this.props.element.hasOwnProperty('position') && (
          <div className="form-group">
            <label className="control-label" htmlFor="position">
              Role / Position
            </label>
            <input
              id="position"
              type="text"
              className="form-control"
              defaultValue={this.props.element.position}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'position', 'value')}
            />
          </div>
        )}
        {this.props.element.hasOwnProperty('specificRole') && (
          <div className="form-group">
            <label className="control-label">
              Pre Defined User / Role {Boolean(this.props.element.specificRole)}
            </label>
            <select
              className="form-control"
              id="specificRole"
              defaultValue={this.props.element.specificRole}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'specificRole', 'value')}
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

        {this.props.element.hasOwnProperty('options') && (
          <DynamicOptionList
            showCorrectColumn={this.props.showCorrectColumn}
            canHaveOptionCorrect={canHaveOptionCorrect}
            canHaveOptionValue={canHaveOptionValue}
            canHaveInfo={canHaveInfo}
            data={this.props.preview?.state?.data}
            updateElement={this.updateElementWithFlush}
            preview={this.props.preview}
            element={this.state.element}
            key={`option-${this.state.element.options.length}`}
          />
        )}

        {this.props.element.hasOwnProperty('rows') && (
          <div className="form-group">
            <label className="control-label" htmlFor="rowInput">
              Row Count
            </label>
            <input
              id="rowInput"
              type="text"
              className="form-control"
              defaultValue={this.props.element.rows}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'rows', 'value')}
            />
          </div>
        )}

        {this.props.element.hasOwnProperty('rowLabels') && (
          <FixedRowList
            data={this.props.preview?.state?.data}
            updateElement={this.updateElementWithFlush}
            preview={this.props.preview}
            element={this.state.element}
            key="table-row-labels"
          />
        )}

        {this.props.element.hasOwnProperty('columns') && (
          <DynamicColumnList
            data={this.props.preview?.state?.data}
            updateElement={this.updateElementWithFlush}
            preview={this.props.preview}
            element={this.state.element}
            key="table-columns"
          />
        )}

        {this.props.element.hasOwnProperty('sourceType') && (
          <div className="form-group">
            <label className="control-label" htmlFor="sourceType">
              Source Type
            </label>
            <select
              className="form-control"
              id="sourceType"
              defaultValue={this.props.element.sourceType}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'sourceType', 'value')}
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

        {this.props.element.sourceType === 'form' && (
          <div>
            {this.props.element.hasOwnProperty('formSource') && (
              <div className="form-group">
                <label className="control-label" htmlFor="formSource">
                  Form Source
                </label>
                <select
                  className="form-control"
                  id="formSource"
                  value={this.props.element.formSource}
                  defaultValue={this.props.element.formSource}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(this, 'formSource', 'value')}
                >
                  <option value={-1} key={-1}>
                    " Please select "
                  </option>
                  {this.state.formDataSource &&
                    this.state.formDataSource.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {this.props.element.sourceType === 'form' && (
              <div className="form-group">
                <label className="control-label" htmlFor="formSource">
                  Select Fields
                </label>
                {this.state.activeForm &&
                  this.state.activeForm.columns &&
                  this.state.activeForm.columns.map((item) => (
                    <div className="custom-control custom-checkbox">
                      <input
                        id={item.field_name}
                        className="custom-control-input"
                        type="checkbox"
                        checked={
                          this.props.element.hasOwnProperty(`formField${item.field_name}`)
                            ? this.props.element[`formField${item.field_name}`]
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

        {this.props.element.hasOwnProperty('formula') && (
          <div className="form-group">
            <label className="control-label" htmlFor="rowInput">
              Formula
            </label>
            <input
              id="formula"
              type="text"
              className="form-control"
              defaultValue={this.props.element.formula}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'formula', 'value')}
            />
          </div>
        )}

        {this.props.element.hasOwnProperty('formularKey') && (
          <div className="form-group">
            <label className="control-label" htmlFor="rowInput">
              Formula Key
            </label>
            <input
              id="formularKey"
              type="text"
              className="form-control"
              defaultValue={this.props.element.formularKey}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'formularKey', 'value')}
            />
          </div>
        )}
        {this.props.element.element === 'FormLink' && (
          <div className="form-group">
            <label className="control-label" htmlFor="formLinkSource">
              Select Form
            </label>
            <select
              className="form-control"
              id="formLinkSource"
              value={this.props.element.formSource || ''}
              defaultValue={this.props.element.formSource || ''}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, 'formSource', 'value')}
            >
              <option value="" key={-1}>
                Select a form...
              </option>
              {this.state.formDataSource &&
                this.state.formDataSource.map((form) => (
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
}

FormElementsEdit.defaultProps = { className: 'edit-element-fields' }
