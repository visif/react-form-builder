import DataSourceEditor from '../editors/specific/DataSourceEditor'
import FormLinkEditor from '../editors/specific/FormLinkEditor'
import ImageEditor from '../editors/specific/ImageEditor'
import LabelEditor from '../editors/specific/LabelEditor'
import RangeEditor from '../editors/specific/RangeEditor'
import SelectFieldEditor from '../editors/specific/SelectFieldEditor'
import SignatureEditor from '../editors/specific/SignatureEditor'
import TextFieldEditor from '../editors/specific/TextFieldEditor'
import ReactQuillEditor from '../editors/specific/ReactQuillEditor'
import DynamicColumnList from '../DynamicColumnList'
import DynamicOptionList from '../DynamicOptionList'
import FixedRowList from '../FixedRowList'

/**
 * Build field configuration array for rendering appropriate editors
 * Each config maps element properties to their corresponding editor component
 */
export const buildFieldConfigs = ({
  props,
  element,
  fileOptions,
  formDataSource,
  activeForm,
  onUploadFile,
  editElementProp,
  onContentChange,
  updateElement,
}) => {
  const {
    canHaveDisplayHorizontal,
    canHaveOptionCorrect,
    canHaveOptionValue,
    canHaveInfo,
  } = props.element

  return [
    // Rich text content editor (for Paragraph, Header, etc.)
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

    // File selection dropdown
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

    // Hyperlink URL field
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

    // Image upload and properties
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

    // Label editor (for most input elements)
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

    // Signature-specific settings
    {
      condition: () => element.element === 'Signature' || element.element === 'Signature2',
      component: SignatureEditor,
      props: {
        element: props.element,
        onChange: editElementProp,
        onBlur: updateElement,
      },
    },

    // Range/Slider settings
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

    // Question description field
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

    // Correct answer field (for validation mode)
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

    // Section header field
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

    // Dynamic options list (for Dropdown, Radio, Checkboxes)
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

    // Table row count
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

    // Table row labels
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

    // Table columns configuration
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

    // DataSource element configuration
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

    // Formula field
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

    // Formula key field
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

    // FormLink element configuration
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
}
