/**
 * Main entry point for visiforge-form-builder library
 *
 * Exports:
 * - ReactFormBuilder: Drag-and-drop form builder component
 * - ReactFormGenerator: Form renderer/display component
 */
import ReactFormBuilder from './components/builder/ReactFormBuilder'
import ReactFormGenerator from './components/generator/ReactFormGenerator'

const FormBuilders = {}
FormBuilders.ReactFormBuilder = ReactFormBuilder
FormBuilders.ReactFormGenerator = ReactFormGenerator

export default FormBuilders

export { ReactFormBuilder, ReactFormGenerator }
