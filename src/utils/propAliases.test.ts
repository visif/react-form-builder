import { describe, expect, it } from 'vitest'

import {
  normalizeBuilderAliases,
  normalizeGeneratorAliases,
  withBuilderLegacyKeys,
  withGeneratorLegacyKeys,
} from './propAliases'

describe('propAliases', () => {
  it('prefers camelCase over snake_case for generator props', () => {
    expect(
      normalizeGeneratorAliases({
        answerData: { a: 1 },
        answer_data: { a: 2 },
        readOnly: true,
        read_only: false,
      })
    ).toEqual(
      expect.objectContaining({
        answerData: { a: 1 },
        readOnly: true,
      })
    )
  })

  it('falls back to snake_case when camelCase is absent', () => {
    expect(
      normalizeGeneratorAliases({
        form_action: '/submit',
        hide_actions: true,
      })
    ).toEqual(
      expect.objectContaining({
        formAction: '/submit',
        hideActions: true,
      })
    )
  })

  it('flattens aliases onto legacy generator keys', () => {
    const normalized = withGeneratorLegacyKeys({
      answerData: [{ name: 'x', value: 1 }],
      readOnly: true,
      formAction: '/api',
    })

    expect(normalized.answer_data).toEqual([{ name: 'x', value: 1 }])
    expect(normalized.read_only).toBe(true)
    expect(normalized.form_action).toBe('/api')
  })

  it('normalizes builder showDescription alias', () => {
    expect(normalizeBuilderAliases({ showDescription: false })).toEqual({
      showDescription: false,
    })
    expect(withBuilderLegacyKeys({ showDescription: true }).show_description).toBe(true)
  })
})
