/**
 * Main entry point for visiforge-form-builder library
 *
 * Exports:
 * - ReactFormBuilder: Drag-and-drop form builder component
 * - ReactFormGenerator: Form renderer/display component
 * - Form import helpers: build a form automatically from PDF / DOCX / XLSX / images
 */
import ReactFormBuilder from './components/builder/ReactFormBuilder'
import ReactFormGenerator from './components/generator/ReactFormGenerator'
import { IS_LOCAL_BUILD } from './constants/localBuild'
import FORM_BUILDER_VERSION from './constants/version'
import type { FormBuildersExport } from './types/form'
import Registry from './utils/registry'

const FormBuilders: FormBuildersExport = {
  ReactFormBuilder,
  ReactFormGenerator,
}

export default FormBuilders

export {
  ReactFormBuilder,
  ReactFormGenerator,
  FORM_BUILDER_VERSION,
  IS_LOCAL_BUILD,
  Registry,
}

export {
  importFormFromFile,
  extractFormSchema,
  textToFormSchema,
  schemaToFormElements,
  createRemoteImportAdapter,
  createFunctionImportAdapter,
  builtInImportAdapters,
  detectFileKind,
  DEFAULT_IMPORT_ACCEPT,
  UnsupportedImportFileError,
  OcrDisabledError,
} from './import'

export type {
  FormImportAdapter,
  FormImportConfig,
  ImportedField,
  ImportedFieldType,
  ImportedFormSchema,
  ImportContext,
  ImportProgress,
  ImportFormResult,
  ExtractResult,
  ExtractedText,
  ExtractedSheets,
  ExtractedSchema,
  OcrOptions,
  PdfOptions,
  RemoteImportAdapterOptions,
  RemoteImportResponse,
  ImportFileKind,
} from './import'

export type {
  FormElementData,
  ReactFormBuilderProps,
  ReactFormGeneratorProps,
  ToolbarItem,
} from './types/form'
