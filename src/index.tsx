/**
 * Main entry point for visiforge-form-builder library
 *
 * Exports:
 * - ReactFormBuilder: Drag-and-drop form builder component
 * - ReactFormGenerator: Form renderer/display component
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
