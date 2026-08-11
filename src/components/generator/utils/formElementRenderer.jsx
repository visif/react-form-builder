/**
 * Form Element Rendering Utilities
 *
 * Provides functions to render different types of form elements:
 * - Input elements (TextInput, Dropdown, etc.)
 * - Custom elements
 * - Container elements (rows/columns)
 * - Simple display elements
 */
import React from 'react'

import Registry from '../../../utils/registry'
import FormElements from '../../form-elements/index'
import {
  DynamicColumnRow,
  FourColumnRow,
  ThreeColumnRow,
  TwoColumnRow,
} from '../../form-elements/layout'
import CustomElement from '../../form-elements/shared/CustomElement'

const {
  Image,
  Checkboxes,
  Signature,
  Signature2,
  FileUpload,
  ImageUpload,
  Download,
  Camera,
  DataSource,
  Dataset,
  FormLink,
} = FormElements

/**
 * Get custom element component
 */
export const getCustomElement = (item, props, handleChange, getDefaultValue) => {
  if (!item.component || typeof item.component !== 'function') {
    item.component = Registry.get(item.key)
    if (!item.component) {
      console.error(`${item.element} was not registered`)
    }
  }

  const inputProps = item.forwardRef && {
    handleChange,
    defaultValue: getDefaultValue(item),
  }

  return (
    <CustomElement
      mutable
      read_only={props.read_only}
      key={`form_${item.id}`}
      data={item}
      {...inputProps}
    />
  )
}

/**
 * Get standard input element
 */
export const getInputElement = (
  item,
  props,
  handleChange,
  getDefaultValue,
  getEditor,
  formContext,
  getCustomElementFn
) => {
  if (item.custom) {
    return getCustomElementFn(item, props, handleChange, getDefaultValue)
  }
  const Input = FormElements[item.element]
  return (
    <Input
      handleChange={handleChange}
      mutable
      key={`form_${item.id}`}
      data={item}
      read_only={props.read_only}
      defaultValue={getDefaultValue(item)}
      editor={getEditor(item)}
      getActiveUserProperties={props.getActiveUserProperties}
      getDataSource={props.getDataSource}
      onUploadFile={props.onUploadFile}
      onDownloadFile={props.onDownloadFile}
      onUploadImage={props.onUploadImage}
      getFormSource={props.getFormSource}
      broadcastChange={props.broadcastChange}
      variables={formContext.getAllVariables()}
    />
  )
}

/**
 * Get container element (rows/columns)
 */
const wrapWithRequiredIndicator = (element, item) => {
  if (item?.required === true && item?.hideLabel === true) {
    return (
      <>
        <span style={{ color: 'red', fontSize: '11px', display: 'block', marginBottom: '4px' }}>
          * Required
        </span>
        {element}
      </>
    )
  }
  return element
}

export const getContainerElement = (item, Element, getDataById, getInputElementFn) => {
  const controls = Array.isArray(item.childItems[0])
    ? item.childItems.map((row) =>
        row.map((x) => {
          const currentItem = getDataById(x)
          return x && currentItem ? (
            wrapWithRequiredIndicator(getInputElementFn(currentItem), currentItem)
          ) : (
            <div>&nbsp;</div>
          )
        })
      )
    : [
        item.childItems.map((x) => {
          const currentItem = getDataById(x)
          return x && currentItem ? (
            wrapWithRequiredIndicator(getInputElementFn(currentItem), currentItem)
          ) : (
            <div>&nbsp;</div>
          )
        }),
      ]
  return <Element mutable key={`form_${item.id}`} data={item} controls={controls} />
}

/**
 * Get simple display element
 */
export const getSimpleElement = (item) => {
  const Element = FormElements[item.element]
  return <Element mutable key={`form_${item.id}`} data={item} />
}

/**
 * Render form element based on type
 */
export const renderFormElement = (item, props, handlers, helpers) => {
  const {
    handleChange,
    handleSignature2Change,
    getDefaultValue,
    getEditor,
    optionsDefaultValue,
    getDataById,
    formContext,
  } = helpers

  if (!item) return null

  const customElementRenderer = (customItem) =>
    getCustomElement(customItem, props, handleChange, getDefaultValue)

  switch (item.element) {
    case 'TextInput':
    case 'NumberInput':
    case 'TextArea':
    case 'Table':
    case 'Dropdown':
    case 'DatePicker':
    case 'RadioButtons':
    case 'Rating':
    case 'Tags':
    case 'FormulaInput':
    case 'Range':
      return getInputElement(
        item,
        props,
        handleChange,
        getDefaultValue,
        getEditor,
        formContext,
        (customItem) => customElementRenderer(customItem)
      )

    case 'DataSource':
    case 'Dataset': {
      const DataSourceElement = item.element === 'Dataset' ? Dataset : DataSource
      return (
        <DataSourceElement
          handleChange={handleChange}
          mutable
          key={`form_${item.id}`}
          data={item}
          read_only={props.read_only}
          defaultValue={getDefaultValue(item)}
          editor={getEditor(item)}
          getDataSource={props.getDataSource}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )
    }

    case 'CustomElement':
      return customElementRenderer(item)

    case 'FourColumnRow':
      return getContainerElement(item, FourColumnRow, getDataById, (currentItem) =>
        getInputElement(
          currentItem,
          props,
          handleChange,
          getDefaultValue,
          getEditor,
          formContext,
          (customItem) => customElementRenderer(customItem)
        )
      )

    case 'ThreeColumnRow':
      return getContainerElement(item, ThreeColumnRow, getDataById, (currentItem) =>
        getInputElement(
          currentItem,
          props,
          handleChange,
          getDefaultValue,
          getEditor,
          formContext,
          (customItem) => customElementRenderer(customItem)
        )
      )

    case 'TwoColumnRow':
      return getContainerElement(item, TwoColumnRow, getDataById, (currentItem) =>
        getInputElement(
          currentItem,
          props,
          handleChange,
          getDefaultValue,
          getEditor,
          formContext,
          (customItem) => customElementRenderer(customItem)
        )
      )

    case 'DynamicColumnRow':
      return getContainerElement(item, DynamicColumnRow, getDataById, (currentItem) =>
        getInputElement(
          currentItem,
          props,
          handleChange,
          getDefaultValue,
          getEditor,
          formContext,
          (customItem) => customElementRenderer(customItem)
        )
      )

    case 'Signature':
      return (
        <Signature
          read_only={props.read_only || item.readOnly}
          mutable
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          editor={getEditor(item)}
          handleChange={handleChange}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )

    case 'Signature2':
      return (
        <Signature2
          read_only={props.read_only || item.readOnly}
          mutable
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          getActiveUserProperties={props.getActiveUserProperties}
          editor={getEditor(item)}
          handleChange={handleChange}
          onSignChange={handleSignature2Change}
        />
      )

    case 'Checkboxes':
      return (
        <Checkboxes
          read_only={props.read_only}
          handleChange={handleChange}
          mutable
          key={`form_${item.id}`}
          data={item}
          defaultValue={optionsDefaultValue(item)}
          getActiveUserProperties={props.getActiveUserProperties}
          editor={getEditor(item)}
        />
      )

    case 'Image':
      return (
        <Image
          handleChange={handleChange}
          mutable
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          getActiveUserProperties={props.getActiveUserProperties}
          editor={getEditor(item)}
        />
      )

    case 'Download':
      return (
        <Download
          download_path={props.download_path}
          mutable
          key={`form_${item.id}`}
          data={item}
          editor={getEditor(item)}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )

    case 'Camera':
      return (
        <Camera
          read_only={props.read_only || item.readOnly}
          mutable
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          editor={getEditor(item)}
          handleChange={handleChange}
        />
      )

    case 'FileUpload':
      return (
        <FileUpload
          read_only={props.read_only || item.readOnly}
          mutable
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          handleChange={handleChange}
          onUploadFile={props.onUploadFile}
          onDownloadFile={props.onDownloadFile}
          editor={getEditor(item)}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )

    case 'FormLink':
      return (
        <FormLink
          read_only={props.read_only || item.readOnly}
          mutable
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          onUploadFile={props.onUploadFile}
          onSelectChildForm={props.onSelectChildForm}
          getFormInfo={props.getFormInfo}
          onDownloadFile={props.onDownloadFile}
          editor={getEditor(item)}
          getActiveUserProperties={props.getActiveUserProperties}
          parentElementId={props.parentElementId}
        />
      )

    case 'ImageUpload':
      return (
        <ImageUpload
          read_only={props.read_only || item.readOnly}
          mutable
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          handleChange={handleChange}
          onUploadImage={props.onUploadImage}
          resolveImageUrl={props.resolveImageUrl}
          editor={getEditor(item)}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )

    default:
      return getSimpleElement(item)
  }
}
