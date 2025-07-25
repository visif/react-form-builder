import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import TextAreaAutosize from 'react-textarea-autosize'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
// eslint-disable-next-line import/no-cycle
import DynamicColumnList from './dynamic-column-list'
import DynamicOptionList from './dynamic-option-list'
import FixedRowList from './fixed-row-list'
import { get } from './stores/requests'
import ID from './UUID'

const toolbar = {
  options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
  },
}

export default class FormElementsEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      formDataSource: [],
      activeForm: null,
    }
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

  onEditorStateChange(index, property, editorContent) {
    // const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
    const html = draftToHtml(convertToRaw(editorContent.getCurrentContent()))
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/(?:\r\n|\r|\n)/g, ' ')
    const this_element = this.state.element
    this_element[property] = html

    this.setState({
      element: this_element,
      dirty: true,
    })
  }

  updateElement = () => {
    const this_element = this.state.element
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

    let editorState
    if (this.props.element.hasOwnProperty('content')) {
      editorState = this.convertFromHTML(this.props.element.content)
    }
    if (this.props.element.hasOwnProperty('label')) {
      editorState = this.convertFromHTML(this.props.element.label)
    }

    return (
      <div>
        <div className="clearfix">
          <h4 className="float-left">{this.props.element.text}</h4>
          <i
            className="float-right fas fa-times dismiss-edit"
            onClick={this.props.manualEditModeOff}
          />
        </div>
        {this.props.element.hasOwnProperty('content') && (
          <div className="form-group">
            <label className="control-label">Text to display:</label>
            <Editor
              toolbar={toolbar}
              defaultEditorState={editorState}
              onBlur={this.updateElement.bind(this)}
              onEditorStateChange={this.onEditorStateChange.bind(this, 0, 'content')}
              stripPastedStyles
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
                {/* Always show label editing section regardless of container type */}
                <label>Display Label</label>
                <Editor
                  toolbar={toolbar}
                  defaultEditorState={editorState}
                  onBlur={this.updateElement.bind(this)}
                  onEditorStateChange={this.onEditorStateChange.bind(this, 0, 'label')}
                  stripPastedStyles
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

            {/* "Display label in column" option removed as it's no longer needed */}

            {this.props.element.hasOwnProperty('defaultToday') && (
              <div className="custom-control custom-checkbox">
                <input
                  id="is-default-to-today"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_default_today}
                  value
                  onChange={this.editElementProp.bind(this, 'defaultToday', 'checked')}
                />
                <label className="custom-control-label" htmlFor="is-default-to-today">
                  Default to Today?
                </label>
              </div>
            )}

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
        {this.props.element.hasOwnProperty('static') && this.props.element.static && (
          <div className="form-group">
            <label className="control-label">Text Style</label>
            <div className="custom-control custom-checkbox">
              <input
                id="do-bold"
                className="custom-control-input"
                type="checkbox"
                checked={this_checked_bold}
                value
                onChange={this.editElementProp.bind(this, 'bold', 'checked')}
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
                onChange={this.editElementProp.bind(this, 'italic', 'checked')}
              />
              <label className="custom-control-label" htmlFor="do-italic">
                Italic
              </label>
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
            updateElement={this.props.updateElement}
            preview={this.props.preview}
            element={this.props.element}
            key={`option-${this.props.element.options.length}`}
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
            updateElement={this.props.updateElement}
            preview={this.props.preview}
            element={this.props.element}
            key="table-row-labels"
          />
        )}

        {this.props.element.hasOwnProperty('columns') && (
          <DynamicColumnList
            data={this.props.preview?.state?.data}
            updateElement={this.props.updateElement}
            preview={this.props.preview}
            element={this.props.element}
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
