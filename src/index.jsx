/**
 * Main entry point for react-form-builder2 library
 *
 * Exports:
 * - ReactFormBuilder: Drag-and-drop form builder component
 * - ReactFormGenerator: Form renderer/display component
 */
import ReactFormBuilder from './components/builder/ReactFormBuilder'
import ReactFormGenerator from './components/generator/ReactForm'

const FormBuilders = {}
FormBuilders.ReactFormBuilder = ReactFormBuilder
FormBuilders.ReactFormGenerator = ReactFormGenerator

export default FormBuilders

export { ReactFormBuilder, ReactFormGenerator }
