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
  FormLink,
} = FormElements

/**
 * Get custom element component
 */
export const getCustomElement = (item, props, handleChange, getDefaultValue, inputsRef) => {
  if (!item.component || typeof item.component !== 'function') {
    item.component = Registry.get(item.key)
    if (!item.component) {
      console.error(`${item.element} was not registered`)
    }
  }

  const inputProps = item.forwardRef && {
    handleChange: handleChange,
    defaultValue: getDefaultValue(item),
    ref: (c) => (inputsRef.current[item.field_name] = c),
  }

  return (
    <CustomElement
      mutable={true}
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
  inputsRef,
  getCustomElement
) => {
  if (item.custom) {
    return getCustomElement(item, props, handleChange, getDefaultValue, inputsRef)
  }
  const Input = FormElements[item.element]
  return (
    <Input
      handleChange={handleChange}
      ref={(c) => {
        inputsRef.current[item.field_name] = c
      }}
      mutable={true}
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
export const getContainerElement = (item, Element, getDataById, getInputElement) => {
  const controls = Array.isArray(item.childItems[0])
    ? item.childItems.map((row) => {
        return row.map((x) => {
          const currentItem = getDataById(x)
          return x && currentItem ? getInputElement(currentItem) : <div>&nbsp;</div>
        })
      })
    : [
        item.childItems.map((x) => {
          const currentItem = getDataById(x)
          return x && currentItem ? getInputElement(currentItem) : <div>&nbsp;</div>
        }),
      ]
  return <Element mutable={true} key={`form_${item.id}`} data={item} controls={controls} />
}

/**
 * Get simple display element
 */
export const getSimpleElement = (item) => {
  const Element = FormElements[item.element]
  return <Element mutable={true} key={`form_${item.id}`} data={item} />
}

/**
 * Render form element based on type
 */
export const renderFormElement = (
  item,
  props,
  handlers,
  helpers,
  refs
) => {
  const {
    handleChange,
    getDefaultValue,
    getEditor,
    optionsDefaultValue,
    getDataById,
    formContext,
  } = helpers

  const { inputsRef } = refs

  if (!item) return null

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
        inputsRef,
        (customItem) => getCustomElement(customItem, props, handleChange, getDefaultValue, inputsRef)
      )

    case 'DataSource':
      return (
        <DataSource
          handleChange={handleChange}
          ref={(c) => {
            inputsRef.current[item.field_name] = c
          }}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          read_only={props.read_only}
          defaultValue={getDefaultValue(item)}
          editor={getEditor(item)}
          getDataSource={props.getDataSource}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )

    case 'CustomElement':
      return getCustomElement(item, props, handleChange, getDefaultValue, inputsRef)

    case 'FourColumnRow':
      return getContainerElement(
        item,
        FourColumnRow,
        getDataById,
        (currentItem) => getInputElement(
          currentItem,
          props,
          handleChange,
          getDefaultValue,
          getEditor,
          formContext,
          inputsRef,
          (customItem) => getCustomElement(customItem, props, handleChange, getDefaultValue, inputsRef)
        )
      )

    case 'ThreeColumnRow':
      return getContainerElement(
        item,
        ThreeColumnRow,
        getDataById,
        (currentItem) => getInputElement(
          currentItem,
          props,
          handleChange,
          getDefaultValue,
          getEditor,
          formContext,
          inputsRef,
          (customItem) => getCustomElement(customItem, props, handleChange, getDefaultValue, inputsRef)
        )
      )

    case 'TwoColumnRow':
      return getContainerElement(
        item,
        TwoColumnRow,
        getDataById,
        (currentItem) => getInputElement(
          currentItem,
          props,
          handleChange,
          getDefaultValue,
          getEditor,
          formContext,
          inputsRef,
          (customItem) => getCustomElement(customItem, props, handleChange, getDefaultValue, inputsRef)
        )
      )

    case 'DynamicColumnRow':
      return getContainerElement(
        item,
        DynamicColumnRow,
        getDataById,
        (currentItem) => getInputElement(
          currentItem,
          props,
          handleChange,
          getDefaultValue,
          getEditor,
          formContext,
          inputsRef,
          (customItem) => getCustomElement(customItem, props, handleChange, getDefaultValue, inputsRef)
        )
      )

    case 'Signature':
      return (
        <Signature
          ref={(c) => (inputsRef.current[item.field_name] = c)}
          read_only={props.read_only || item.readOnly}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          editor={getEditor(item)}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )

    case 'Signature2':
      return (
        <Signature2
          ref={(c) => (inputsRef.current[item.field_name] = c)}
          read_only={props.read_only || item.readOnly}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          getActiveUserProperties={props.getActiveUserProperties}
          editor={getEditor(item)}
          handleChange={handleChange}
        />
      )

    case 'Checkboxes':
      return (
        <Checkboxes
          ref={(c) => (inputsRef.current[item.field_name] = c)}
          read_only={props.read_only}
          handleChange={handleChange}
          mutable={true}
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
          ref={(c) => (inputsRef.current[item.field_name] = c)}
          handleChange={handleChange}
          mutable={true}
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
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          editor={getEditor(item)}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )

    case 'Camera':
      return (
        <Camera
          ref={(c) => (inputsRef.current[item.field_name] = c)}
          read_only={props.read_only || item.readOnly}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          editor={getEditor(item)}
        />
      )

    case 'FileUpload':
      return (
        <FileUpload
          ref={(c) => (inputsRef.current[item.field_name] = c)}
          read_only={props.read_only || item.readOnly}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          onUploadFile={props.onUploadFile}
          onDownloadFile={props.onDownloadFile}
          editor={getEditor(item)}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )

    case 'FormLink':
      return (
        <FormLink
          ref={(c) => (inputsRef.current[item.field_name] = c)}
          read_only={props.read_only || item.readOnly}
          mutable={true}
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
          ref={(c) => (inputsRef.current[item.field_name] = c)}
          read_only={props.read_only || item.readOnly}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          defaultValue={getDefaultValue(item)}
          onUploadImage={props.onUploadImage}
          editor={getEditor(item)}
          getActiveUserProperties={props.getActiveUserProperties}
        />
      )

    default:
      return getSimpleElement(item)
  }
}
