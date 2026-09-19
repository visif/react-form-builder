import { describe, expect, it } from 'vitest'

import { buildFieldConfigs } from './fieldConfigs'

const noop = () => {}

describe('buildFieldConfigs', () => {
  it('includes content editor when element has content', () => {
    const configs = buildFieldConfigs({
      props: {
        element: {
          content: 'Hello',
        },
      },
      element: { content: 'Hello' },
      fileOptions: [],
      formDataSource: [],
      activeForm: null,
      onUploadFile: noop,
      editElementProp: noop,
      onContentChange: noop,
      updateElement: noop,
    })

    const contentConfig = configs.find((config) => config.condition())
    expect(contentConfig).toBeTruthy()
    expect(contentConfig.props.label).toBe('Text to display:')
  })

  it('includes signature settings for Signature2 elements', () => {
    const configs = buildFieldConfigs({
      props: {
        element: {
          element: 'Signature2',
          position: 'Approver',
        },
      },
      element: {
        element: 'Signature2',
        position: 'Approver',
      },
      fileOptions: [],
      formDataSource: [],
      activeForm: null,
      onUploadFile: noop,
      editElementProp: noop,
      onContentChange: noop,
      updateElement: noop,
    })

    const signatureConfig = configs.find(
      (config) =>
        config.condition &&
        config.condition() &&
        config.props &&
        Object.prototype.hasOwnProperty.call(config.props, 'element')
    )

    expect(signatureConfig).toBeTruthy()
    expect(signatureConfig.props.element.element).toBe('Signature2')
  })

  it('skips configs whose conditions fail', () => {
    const configs = buildFieldConfigs({
      props: {
        element: {
          element: 'TextInput',
          label: 'Name',
        },
      },
      element: {
        element: 'TextInput',
        label: 'Name',
      },
      fileOptions: [],
      formDataSource: [],
      activeForm: null,
      onUploadFile: noop,
      editElementProp: noop,
      onContentChange: noop,
      updateElement: noop,
    })

    const hrefConfig = configs.find((config) => {
      try {
        return (
          config.props &&
          config.props.id === 'href' &&
          typeof config.condition === 'function' &&
          config.condition()
        )
      } catch (_) {
        return false
      }
    })

    expect(hrefConfig).toBeUndefined()
  })

  it('includes Unique name for DynamicColumnRow', () => {
    const configs = buildFieldConfigs({
      props: {
        element: {
          id: 'dcr-1',
          element: 'DynamicColumnRow',
          uniqueName: 'WorkHistory',
          columns: [],
        },
        preview: { state: { data: [] } },
      },
      element: {
        id: 'dcr-1',
        element: 'DynamicColumnRow',
        uniqueName: 'WorkHistory',
        columns: [],
      },
      fileOptions: [],
      formDataSource: [],
      activeForm: null,
      onUploadFile: noop,
      editElementProp: noop,
      onContentChange: noop,
      updateElement: noop,
    })

    const uniqueNameConfig = configs.find(
      (config) => config.props && config.props.id === 'dcrUniqueName' && config.condition()
    )

    expect(uniqueNameConfig).toBeTruthy()
    expect(uniqueNameConfig.props.label).toBe('Unique name')
    expect(uniqueNameConfig.props.value).toBe('WorkHistory')
    expect(uniqueNameConfig.props.helpText).toContain('#WorkHistory_c1#')
  })
})
