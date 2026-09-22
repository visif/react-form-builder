import {
  defaultCellName,
  isCellNameTaken,
  isUniqueNameTaken,
  nextDynamicColumnRowUniqueName,
  templateColumnTagPreview,
  templateSubFormColumnTagPreview,
} from '../../../../utils/dynamic-column-row-names'
import DynamicColumnList from '../DynamicColumnList'
import DynamicOptionList from '../DynamicOptionList'
import CheckboxFieldEditor from '../editors/specific/CheckboxFieldEditor'
import DataSourceEditor from '../editors/specific/DataSourceEditor'
import FormLinkEditor from '../editors/specific/FormLinkEditor'
import ImageEditor from '../editors/specific/ImageEditor'
import LabelEditor from '../editors/specific/LabelEditor'
import RangeEditor from '../editors/specific/RangeEditor'
import ReactQuillEditor from '../editors/specific/ReactQuillEditor'
import SelectFieldEditor from '../editors/specific/SelectFieldEditor'
import SignatureEditor from '../editors/specific/SignatureEditor'
import TextFieldEditor from '../editors/specific/TextFieldEditor'
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
  editElementFields,
  onContentChange,
  onUniqueNameChange,
  onUniqueNameBlur,
  onCellNameChange,
  onCellNameBlur,
  onSubFormNameChange,
  onSubFormNameBlur,
  formDesignData,
  updateElement,
}) => {
  const {
    canHaveDisplayHorizontal,
    canHaveOptionCorrect,
    canHaveOptionValue,
    canHaveInfo,
    canHaveDefaultValue,
  } = props.element

  const designData = typeof formDesignData === 'function' ? formDesignData() : []
  const parentElement =
    props.element.parentId && typeof props.preview?.getDataById === 'function'
      ? props.preview.getDataById(props.element.parentId)
      : null
  const cellNameValue = element.cellName || defaultCellName(element.row, element.col)

  return [
    // Dynamic Column Row table unique name
    {
      condition: () => props.element.element === 'DynamicColumnRow',
      component: TextFieldEditor,
      props: {
        id: 'dcrUniqueName',
        label: 'Unique name',
        value: element.uniqueName || '',
        placeholder: nextDynamicColumnRowUniqueName(
          designData.filter((item) => item && item.id !== props.element.id)
        ),
        onChange: onUniqueNameChange || ((e) => editElementProp('uniqueName', 'value', e)),
        onBlur: onUniqueNameBlur || updateElement,
        errorText: isUniqueNameTaken(designData, element.uniqueName, props.element.id)
          ? 'Unique name must be unique among Dynamic Column Rows on this form.'
          : null,
        helpText:
          'Required. Used in template tags such as #WorkHistory_c1#. On a master form, tables inside a SubForm use #SubFormName_WorkHistory_c1#.',
      },
    },

    // Show the Display Label for the input elements inside a Dynamic Column Row
    {
      condition: () => props.element.element === 'DynamicColumnRow',
      component: CheckboxFieldEditor,
      props: {
        id: 'dcrShowDisplayLabel',
        label: 'Show the Display Label for the input element',
        checked: element.showDisplayLabel === true,
        onChange: (e) => editElementProp('showDisplayLabel', 'checked', e),
      },
    },

    // Cell unique name when editing a child of Dynamic Column Row
    {
      condition: () =>
        !!props.element.parentId && parentElement?.element === 'DynamicColumnRow',
      component: TextFieldEditor,
      props: {
        id: 'dcrCellName',
        label: 'Cell unique name',
        value: cellNameValue,
        onChange: onCellNameChange || ((e) => editElementProp('cellName', 'value', e)),
        onBlur: onCellNameBlur || updateElement,
        errorText: isCellNameTaken(
          designData,
          props.element.parentId,
          cellNameValue,
          props.element.id
        )
          ? 'Cell unique name must be unique within this table.'
          : null,
        helpText: `Default is r{row}c{col} (e.g. r1c1). Any language is allowed. Template tag: ${templateColumnTagPreview(
          parentElement?.uniqueName,
          element.col
        )}`,
      },
    },

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
        element,
        onUploadFile,
        onChange: editElementProp,
        onFieldsChange: editElementFields,
        onBlur: updateElement,
      },
    },

    // Label editor (for most input elements)
    {
      condition: () =>
        'label' in props.element ||
        props.element.element === 'Signature2' ||
        props.element.element === 'ImageUpload',
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
      condition: () => 'header' in props.element && props.element.element !== 'ImageUpload',
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
        canHaveDefaultValue,
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
        onChange: editElementProp,
        onBlur: updateElement,
        onSubFormNameChange,
        onSubFormNameBlur,
        subFormTagPreview: templateSubFormColumnTagPreview(
          element,
          'DynamicColumnRow1',
          0
        ),
      },
    },
  ]
}
