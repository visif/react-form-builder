/**
 * <DynamicColumnList />
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {
  ContentState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
  EditorState,
  RichUtils,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
// eslint-disable-next-line import/no-cycle
import FormElementsEdit from './form-elements-edit'
import ID from './UUID'

const columnNameToolbar = {
  options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'colorPicker', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
  },
  link: {
    popupClassName: 'link-popup-left',
  },
  colorPicker: {
    className: 'rainbow-color-picker',
    component: undefined,
    popupClassName: 'color-picker-popup-left',
    colors: [
      'rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
      'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)',
      'rgb(0,168,133)', 'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)',
      'rgb(40,50,78)', 'rgb(0,0,0)', 'rgb(247,218,100)', 'rgb(251,160,38)',
      'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)', 'rgb(239,239,239)',
      'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
      'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)',
    ],
  },
}

export default class DynamicColumnList extends React.Component {
  constructor(props) {
    super(props)
    const { element } = props
    this.state = {
      element,
      showEditModal: false,
      editingColumn: null,
      dirty: false,
      editorStates: {},
    }
  }

  componentDidUpdate(prevProps) {
    const { element } = this.props
    if (prevProps.element !== element) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ element })
    }
  }

  handleEditModalClose = () => {
    this.setState({
      showEditModal: false,
      editingColumn: null,
    })
  }

  _setValue = (text) => `${text}`.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()

  editorStateFor = (text) => {
    if (text) {
      try {
        const rawStr = text.__raw
        if (rawStr) {
          const raw = typeof rawStr === 'string' ? JSON.parse(rawStr) : rawStr
          return EditorState.createWithContent(convertFromRaw(raw))
        }
      } catch (e) {
        // ignore
      }
      try {
        const blocks = convertFromHTML(text)
        if (blocks.contentBlocks && blocks.contentBlocks.length) {
          return EditorState.createWithContent(
            ContentState.createFromBlockArray(blocks)
          )
        }
      } catch (e) {
        // ignore
      }
    }
    return RichUtils.toggleInlineStyle(EditorState.createEmpty(), 'BOLD')
  }

  onColumnEditorStateChange = (columnKey, editorState) => {
    this.setState((prev) => ({
      editorStates: { ...prev.editorStates, [columnKey]: editorState },
      dirty: true,
    }))
  }

  onColumnEditorBlur = (index, columnKey) => {
    const { editorStates, element } = this.state
    const editorState = editorStates[columnKey]
    if (editorState) {
      const raw = convertToRaw(editorState.getCurrentContent())
      const html = draftToHtml(raw)
      const plainText = editorState.getCurrentContent().getPlainText()
      const oldValue = element.columns[index].value
      const oldText = element.columns[index].text
      const newVal =
        oldValue !== this._setValue(typeof oldText === 'string' ? oldText.replace(/<[^>]+>/g, '') : oldText)
          ? oldValue
          : this._setValue(plainText)
      element.columns[index].text = html
      element.columns[index].value = newVal
      this.setState({ element, dirty: true }, this.updateColumn)
    }
  }

  editColumn = (index, key, e) => {
    const { element } = this.state

    if (key === 'isSync' || key === 'required') {
      element.columns[index][key] = e.target.checked
    } else {
      const val =
        element.columns[index].value !== this._setValue(element.columns[index][key])
          ? element.columns[index].value
          : this._setValue(e.target.value)

      element.columns[index][key] = e.target.value
      element.columns[index].value = val
    }

    this.setState({ element, dirty: true })
  }

  updateColumn = () => {
    const { element, dirty } = this.state
    const { updateElement, preview } = this.props
    if (dirty) {
      if (preview) {
        updateElement.call(preview, element)
      } else {
        updateElement(element)
      }
      this.setState({ dirty: false })
    }
  }

  addColumn = (index) => {
    const { element } = this.state
    const { updateElement, preview } = this.props
    if (!element.columns) {
      element.columns = []
    }
    element.columns.splice(index + 1, 0, {
      value: '',
      text: '',
      key: ID.uuid(),
      width: 1,
      isSync: true,
      required: false,
    })
    if (preview) {
      updateElement.call(preview, element)
    } else {
      updateElement(element)
    }
  }

  removeColumn = (index) => {
    const { element } = this.state
    const { updateElement, preview } = this.props
    element.columns.splice(index, 1)
    if (preview) {
      updateElement.call(preview, element)
    } else {
      updateElement(element)
    }
  }

  editColumnSettings = (column) => {
    this.setState({
      showEditModal: true,
      editingColumn: column,
    })
  }

  render() {
    const { element, dirty, showEditModal, editingColumn, editorStates } = this.state
    const { preview, allowSync } = this.props

    if (dirty) {
      element.dirty = true
    }

    return (
      <>
        <div className="dynamic-option-list">
          <ul>
            <li>
              <div className="row">
                <div className="col-sm-12">
                  <b>Columns</b>
                </div>
              </div>
            </li>
            <li className="clearfix">
              <div className="row">
                <div className={allowSync ? 'col-sm-5' : 'col-sm-6'}>Header Text</div>
                <div className="col-sm-2">Width</div>
                {allowSync && <div className="col-sm-1 text-center">Sync</div>}
                <div className="col-sm-1 text-center">Required</div>
                <div className={allowSync ? 'col-sm-3' : 'col-sm-3'} />
              </div>
            </li>
            {(!element.columns || element.columns.length === 0) && (
              <li className="clearfix">
                <div className="row">
                  <div className="col-sm-12">
                    <button
                      type="button"
                      onClick={() => this.addColumn(-1)}
                      className="btn btn-success"
                    >
                      <i className="fas fa-plus-circle" /> Add Column
                    </button>
                  </div>
                </div>
              </li>
            )}
            {(element.columns || []).map((option, index) => {
              const editKey = `edit_${option.key}`
              return (
                <li className="clearfix" key={editKey}>
                  <div className="row">
                    <div className={allowSync ? 'col-sm-5' : 'col-sm-6'}>
                      <Editor
                        toolbar={columnNameToolbar}
                        editorState={
                          editorStates[option.key] || this.editorStateFor(option.text)
                        }
                        onEditorStateChange={(es) =>
                          this.onColumnEditorStateChange(option.key, es)
                        }
                        onBlur={() => this.onColumnEditorBlur(index, option.key)}
                        stripPastedStyles={false}
                      />
                    </div>
                    <div className="col-sm-2">
                      <input
                        tabIndex={index + 1}
                        className="form-control"
                        style={{ width: '100%' }}
                        type="text"
                        name={`width_${index}`}
                        placeholder="Width"
                        value={option.width}
                        onBlur={this.updateColumn}
                        onChange={(e) => this.editColumn(index, 'width', e)}
                      />
                    </div>
                    {allowSync && (
                      <div className="col-sm-1">
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: '38px', minWidth: '56px' }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`sync_${index}`}
                            checked={option.isSync || false}
                            onChange={(e) => this.editColumn(index, 'isSync', e)}
                            onBlur={this.updateColumn}
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-sm-1">
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: '38px', minWidth: '56px' }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`required_${index}`}
                          checked={option.required || false}
                          onChange={(e) => this.editColumn(index, 'required', e)}
                          onBlur={this.updateColumn}
                        />
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="dynamic-options-actions-buttons">
                        <button
                          type="button"
                          onClick={() => this.addColumn(index)}
                          className="btn btn-success"
                        >
                          <i className="fas fa-plus-circle" />
                        </button>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => this.removeColumn(index)}
                            className="btn btn-danger"
                          >
                            <i className="fas fa-minus-circle" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {showEditModal && editingColumn && (
          <div className="modal show d-block">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <FormElementsEdit
                  element={editingColumn}
                  updateElement={(updatedElement) => {
                    const { element: currentElement } = this.state
                    const columns = [...currentElement.columns]
                    const index = columns.findIndex(
                      (col) => col.key === updatedElement.key
                    )
                    if (index !== -1) {
                      columns[index] = updatedElement
                      this.setState(
                        (prevState) => {
                          const newElement = { ...prevState.element }
                          newElement.columns = columns
                          return { element: newElement, dirty: true }
                        },
                        () => {
                          this.updateColumn()
                          this.handleEditModalClose()
                        }
                      )
                    }
                  }}
                  manualEditModeOff={this.handleEditModalClose}
                  preview={preview}
                />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

DynamicColumnList.propTypes = {
  element: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        type: PropTypes.string,
        isSync: PropTypes.bool,
      })
    ).isRequired,
  }).isRequired,
  preview: PropTypes.shape({}),
  updateElement: PropTypes.func.isRequired,
  allowSync: PropTypes.bool,
}

DynamicColumnList.defaultProps = {
  preview: null,
  allowSync: true,
}
