/**
 * <Toolbar />
 */
import React from 'react'
import store from './stores/store'
import ToolbarItem from './toolbar-draggable-item'
import ID from './UUID'

function isDefaultItem(item) {
  const keys = Object.keys(item)
  return keys.filter((x) => x !== 'element' && x !== 'key').length === 0
}

function buildItems(items, defaultItems) {
  if (!items) {
    return defaultItems
  }
  return items.map((x) => {
    let found
    if (isDefaultItem(x)) {
      found = defaultItems.find((y) => (x.element || x.key) === (y.element || y.key))
    }
    return found || x
  })
}

const DATE_FORMAT = 'DD MMM YYYY'

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props)

    const items = buildItems(props.items, this._defaultItems())
    this.state = {
      items,
    }
    store.subscribe((state) => {
      this.setState({ store: state })
    })
    this.create = this.create.bind(this)
  }

  static _defaultItemOptions(element) {
    switch (element) {
      case 'Dropdown':
        return [
          {
            value: '1',
            text: 'Place holder option 1',
            key: `dropdown_option_${ID.uuid()}`,
          },
          {
            value: '2',
            text: 'Place holder option 2',
            key: `dropdown_option_${ID.uuid()}`,
          },
          {
            value: '3',
            text: 'Place holder option 3',
            key: `dropdown_option_${ID.uuid()}`,
          },
        ]
      case 'Tags':
        return [
          {
            value: '1',
            text: 'Place holder tag 1',
            key: `tags_option_${ID.uuid()}`,
          },
          {
            value: '2',
            text: 'Place holder tag 2',
            key: `tags_option_${ID.uuid()}`,
          },
          {
            value: '3',
            text: 'Place holder tag 3',
            key: `tags_option_${ID.uuid()}`,
          },
        ]
      case 'Checkboxes':
        return [
          {
            value: '1',
            text: 'Place holder option 1',
            key: `checkboxes_option_${ID.uuid()}`,
          },
          {
            value: '2',
            text: 'Place holder option 2',
            key: `checkboxes_option_${ID.uuid()}`,
          },
          {
            value: '3',
            text: 'Place holder option 3',
            key: `checkboxes_option_${ID.uuid()}`,
          },
        ]
      case 'RadioButtons':
        return [
          {
            value: '1',
            text: 'Place holder option 1',
            key: `radiobuttons_option_${ID.uuid()}`,
          },
          {
            value: '2',
            text: 'Place holder option 2',
            key: `radiobuttons_option_${ID.uuid()}`,
          },
          {
            value: '3',
            text: 'Place holder option 3',
            key: `radiobuttons_option_${ID.uuid()}`,
          },
        ]
      default:
        return []
    }
  }

  static _defaultItemColumns() {
    return [
      { text: 'Column1', key: `table_column_${ID.uuid()}`, width: 1 },
      { text: 'Column2', key: `table_column_${ID.uuid()}`, width: 1 },
      { text: 'Column3', key: `table_column_${ID.uuid()}`, width: 1 },
    ]
  }

  _defaultItems() {
    return [
      {
        key: 'Header',
        name: 'Header Text',
        icon: 'fas fa-heading',
        static: true,
        content: 'Placeholder Text...',
      },
      {
        key: 'Label',
        name: 'Label',
        static: true,
        icon: 'fas fa-font',
        content: 'Placeholder Text...',
      },
      {
        key: 'Paragraph',
        name: 'Paragraph',
        static: true,
        icon: 'fas fa-paragraph',
        content: 'Placeholder Text...',
      },
      {
        key: 'LineBreak',
        name: 'Line Break',
        static: true,
        icon: 'fas fa-arrows-alt-h',
      },
      {
        key: 'Dropdown',
        canHaveAnswer: true,
        name: 'Dropdown',
        icon: 'far fa-caret-square-down',
        label: 'Placeholder Label',
        field_name: 'dropdown_',
        options: [],
        formularKey: '',
      },
      {
        key: 'Tags',
        canHaveAnswer: true,
        name: 'Tags',
        icon: 'fas fa-tags',
        label: 'Placeholder Label',
        field_name: 'tags_',
        options: [],
      },
      {
        key: 'Checkboxes',
        canHaveAnswer: true,
        canHaveInfo: true,
        name: 'Checkboxes',
        icon: 'far fa-check-square',
        label: 'Placeholder Label',
        field_name: 'checkboxes_',
        options: [],
      },
      {
        key: 'RadioButtons',
        canHaveAnswer: true,
        canHaveInfo: true,
        name: 'Multiple Choice',
        icon: 'far fa-dot-circle',
        label: 'Placeholder Label',
        field_name: 'radiobuttons_',
        options: [],
        formularKey: '',
      },
      {
        key: 'TextInput',
        canHaveAnswer: true,
        name: 'Text Input',
        label: 'Placeholder Label',
        icon: 'fas fa-font',
        field_name: 'text_input_',
        formularKey: '',
      },
      {
        key: 'FormulaInput', // Add FormulaInput to the default items
        name: 'Formula Input',
        label: 'Placeholder Label',
        icon: 'fas fa-calculator',
        field_name: 'formula_input_',
        formula: '',
      },
      {
        key: 'NumberInput',
        canHaveAnswer: true,
        name: 'Number Input',
        label: 'Placeholder Label',
        icon: 'fas fa-plus',
        field_name: 'number_input_',
        formularKey: '',
      },
      {
        key: 'TextArea',
        canHaveAnswer: true,
        name: 'Multi-line Input',
        label: 'Placeholder Label',
        icon: 'fas fa-text-height',
        field_name: 'text_area_',
      },
      {
        key: 'DataSource',
        name: 'DataSource',
        icon: 'fa fa-database',
        field_name: 'data_source_',
        sourceType: 'name',
        formSource: '',
        formField: {},
        canHaveAnswer: true,
        label: 'Placeholder Label',
      },
      {
        key: 'Table',
        name: 'Table',
        icon: 'fas fa-table',
        field_name: 'tables_',
        columns: [],
        rowLabels: [],
        rows: 3,
      },
      {
        key: 'TwoColumnRow',
        canHaveAnswer: false,
        name: 'Two Column Row',
        label: '',
        icon: 'fas fa-columns',
        field_name: 'two_col_row_',
      },
      {
        key: 'ThreeColumnRow',
        canHaveAnswer: false,
        name: 'Three Column Row',
        label: '',
        icon: 'fas fa-columns',
        field_name: 'three_col_row_',
      },
      {
        key: 'FourColumnRow',
        canHaveAnswer: false,
        name: 'Four Column Row',
        label: '',
        icon: 'fas fa-columns',
        field_name: 'four_col_row_',
      },
      {
        key: 'DynamicColumnRow',
        name: 'Dynamic Columns',
        icon: 'fas fa-columns',
        content: 'Dynamic Column Layout',
        element: 'DynamicColumnRow',
        field_name: 'dynamic_col_row_',
        rows: 1,
        columns: [],
      },
      {
        key: 'Image',
        name: 'Image',
        label: '',
        icon: 'far fa-image',
        field_name: 'image_',
        src: '',
      },
      {
        key: 'Rating',
        canHaveAnswer: true,
        name: 'Rating',
        label: 'Placeholder Label',
        icon: 'fas fa-star',
        field_name: 'rating_',
      },
      {
        key: 'DatePicker',
        canDefaultToday: true,
        canReadOnly: true,
        dateFormat: DATE_FORMAT,
        timeFormat: 'hh:mm aa',
        showTimeSelect: false,
        showTimeSelectOnly: false,
        name: 'Date',
        icon: 'far fa-calendar-alt',
        label: 'Placeholder Label',
        field_name: 'date_picker_',
      },
      {
        key: 'Signature',
        canReadOnly: true,
        name: 'Signature',
        icon: 'fas fa-pen-square',
        label: 'Signature',
        field_name: 'signature_',
      },
      {
        key: 'Signature2',
        name: 'Signature',
        // label: "Signature",
        icon: 'fas fa-signature',
        field_name: 'signature2_',
        position: 'Placeholder Text',
        specificRole: 'specific',
      },
      {
        key: 'HyperLink',
        name: 'Web site',
        icon: 'fas fa-link',
        static: true,
        content: 'Placeholder Web site link ...',
        href: 'http://www.example.com',
      },
      {
        key: 'Download',
        name: 'File Attachment',
        icon: 'fas fa-file',
        static: true,
        content: 'Placeholder file name ...',
        field_name: 'download_',
        file_path: '',
        _href: '',
      },
      {
        key: 'Range',
        name: 'Range',
        icon: 'fas fa-sliders-h',
        label: 'Placeholder Label',
        field_name: 'range_',
        step: 1,
        default_value: 3,
        min_value: 1,
        max_value: 5,
        min_label: 'Easy',
        max_label: 'Difficult',
      },
      {
        key: 'Camera',
        name: 'Camera',
        icon: 'fas fa-camera',
        label: 'Placeholder Label',
        field_name: 'camera_',
      },
      {
        key: 'Section',
        name: 'Section',
        icon: 'fas fa-cut',
        field_name: 'section_',
        header: 'Placeholder Text',
      },
      {
        key: 'FileUpload',
        name: 'FileUpload',
        icon: 'fas fa-upload',
        field_name: 'fileupload_',
        header: 'Placeholder Text',
      },
      {
        key: 'ImageUpload',
        name: 'ImageUpload',
        icon: 'fas fa-image',
        field_name: 'fileimage_',
        header: 'Placeholder Text',
      },
    ]
  }

  create(item) {
    const elementOptions = {
      id: ID.uuid(),
      element: item.element || item.key,
      text: item.name,
      static: item.static,
      required: false,
      showDescription: item.showDescription,
    }

    if (this.props.showDescription === true && !item.static) {
      elementOptions.showDescription = true
    }

    if (item.type === 'custom') {
      elementOptions.key = item.key
      elementOptions.custom = true
      elementOptions.forwardRef = item.forwardRef
      elementOptions.bare = item.bare
      elementOptions.props = item.props
      elementOptions.component = item.component || null
      elementOptions.custom_options = item.custom_options || []
    }

    if (item.static) {
      elementOptions.bold = false
      elementOptions.italic = false
    }

    if (item.canHaveAnswer) {
      elementOptions.canHaveAnswer = item.canHaveAnswer
    }

    if (item.canHaveInfo) {
      elementOptions.canHaveInfo = item.canHaveInfo
    }

    if (item.canReadOnly) {
      elementOptions.readOnly = false
    }

    if (item.canDefaultToday) {
      elementOptions.defaultToday = false
    }

    if (item.content) {
      elementOptions.content = item.content
    }

    if (item.href) {
      elementOptions.href = item.href
    }

    elementOptions.canHavePageBreakBefore = item.canHavePageBreakBefore !== false
    elementOptions.canHaveAlternateForm = item.canHaveAlternateForm !== false
    elementOptions.canHaveDisplayHorizontal = item.canHaveDisplayHorizontal !== false
    if (elementOptions.canHaveDisplayHorizontal) {
      elementOptions.inline = item.inline
    }
    elementOptions.canHaveOptionCorrect = item.canHaveOptionCorrect !== false
    elementOptions.canHaveOptionValue = item.canHaveOptionValue !== false
    elementOptions.canPopulateFromApi = item.canPopulateFromApi !== false

    if (item.class_name) {
      elementOptions.class_name = item.class_name
    }

    if (item.key === 'Image') {
      elementOptions.src = item.src
      elementOptions.width = item.src.width || 100
      elementOptions.height = item.src.height || 100
    }

    if (item.key === 'DatePicker') {
      elementOptions.dateFormat = item.dateFormat
      elementOptions.timeFormat = item.timeFormat
      elementOptions.showTimeSelect = item.showTimeSelect
      elementOptions.showTimeSelectOnly = item.showTimeSelectOnly
      elementOptions.overdueNotification = false
    }

    if (item.key === 'Download') {
      elementOptions._href = item._href
      elementOptions.file_path = item.file_path
    }

    if (item.key === 'Range') {
      elementOptions.step = item.step
      elementOptions.default_value = item.default_value
      elementOptions.min_value = item.min_value
      elementOptions.max_value = item.max_value
      elementOptions.min_label = item.min_label
      elementOptions.max_label = item.max_label
    }

    if (item.defaultValue) {
      elementOptions.defaultValue = item.defaultValue
    }

    if (item.field_name) {
      elementOptions.field_name = item.field_name + ID.uuid()
    }

    if (item.label) {
      elementOptions.label = item.label
    }

    if (item.options) {
      if (item.options.length > 0) {
        elementOptions.options = item.options
      } else {
        elementOptions.options = Toolbar._defaultItemOptions(elementOptions.element)
      }
    }

    if (item.key === 'Table' || item.key === 'DynamicColumnRow') {
      if (item.columns.length > 0) {
        elementOptions.columns = item.columns
      } else {
        elementOptions.columns = Toolbar._defaultItemColumns()
      }

      if (item.rowLabels?.length > 0) {
        elementOptions.rowLabels = item.rowLabels
      } else {
        elementOptions.rowLabels = []
      }
      elementOptions.rows = item.rows || 3
    }

    if (item.key === 'Section') {
      elementOptions.header = 'Placeholder Text'
    }

    if (item.key === 'Signature2') {
      elementOptions.position = 'Placeholder Text'
      elementOptions.specificRole = 'specific'
    }

    if (item.key === 'DataSource') {
      elementOptions.sourceType = item.sourceType
      elementOptions.formSource = item.formSource
      elementOptions.formField = item.formField || {}
    }

    if (item.formularKey !== undefined) {
      elementOptions.formularKey = item.formularKey
    }

    if (item.key === 'FormulaInput') {
      elementOptions.formula = item.formula
    }

    return elementOptions
  }

  _onClick(item) {
    // ElementActions.createElement(this.create(item));
    store.dispatch('create', this.create(item))
  }

  render() {
    return (
      <div className="react-form-builder-toolbar" style={{ marginTop: 0 }}>
        <h4>Toolbox</h4>
        <ul>
          {this.state.items.map((item) => (
            <ToolbarItem
              data={item}
              key={item.key}
              onClick={this._onClick.bind(this, item)}
              onCreate={this.create}
            />
          ))}
        </ul>
      </div>
    )
  }
}
