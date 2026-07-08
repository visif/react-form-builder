import { describe, expect, it } from 'vitest'

import { convertAnswerData, getVariableValueHelper } from './formHelpers'

describe('formHelpers', () => {
  it('converts answer arrays into an object map', () => {
    expect(
      convertAnswerData([
        { name: 'name_field', value: 'Ada' },
        { name: 'age_field', value: 36 },
      ])
    ).toEqual({
      name_field: 'Ada',
      age_field: 36,
    })
  })

  it('maps tags_ answer arrays to their values', () => {
    expect(
      convertAnswerData([
        {
          name: 'tags_skills',
          value: [{ value: 'react' }, { value: 'vite' }],
        },
      ])
    ).toEqual({
      tags_skills: ['react', 'vite'],
    })
  })

  it('returns object answer data as-is', () => {
    expect(convertAnswerData({ name_field: 'Ada' })).toEqual({ name_field: 'Ada' })
    expect(convertAnswerData(null)).toEqual({})
  })

  it('extracts formula variables from matching formularKey fields', () => {
    const variables = getVariableValueHelper(
      { qty_field: 3, price_field: 10 },
      [
        { field_name: 'qty_field', formularKey: 'QTY' },
        { field_name: 'price_field', formularKey: 'PRICE' },
        { field_name: 'ignored', formularKey: undefined },
      ]
    )

    expect(variables).toEqual({
      QTY: 3,
      PRICE: 10,
    })
  })

  it('unwraps object and checkbox-style formula values', () => {
    expect(
      getVariableValueHelper(
        { amount_field: { value: 12 } },
        [{ field_name: 'amount_field', formularKey: 'AMOUNT' }]
      )
    ).toEqual({ AMOUNT: 12 })

    expect(
      getVariableValueHelper(
        {
          bool_field: [{ key: 'yes', value: true }],
        },
        [
          {
            field_name: 'bool_field',
            formularKey: 'FLAG',
            options: [{ key: 'yes', value: 1, text: 'Yes' }],
          },
        ]
      )
    ).toEqual({ FLAG: 1 })
  })
})
