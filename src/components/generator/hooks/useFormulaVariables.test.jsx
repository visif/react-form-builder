import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FormProvider, useFormContext } from '../../../contexts/FormContext'
import { useFormulaVariables } from './useFormulaVariables'

const createWrapper = (initialValues = {}) => {
  const Wrapper = ({ children }) => (
    <FormProvider initialValues={initialValues}>{children}</FormProvider>
  )
  return Wrapper
}

describe('useFormulaVariables', () => {
  it('recalculates dependent FormulaInput values when a variable changes', () => {
    let answerData = {}
    const setAnswerData = (updater) => {
      answerData = typeof updater === 'function' ? updater(answerData) : updater
    }

    const props = {
      data: [
        {
          id: 'formula-1',
          element: 'FormulaInput',
          field_name: 'total_field',
          formula: 'QTY * PRICE',
        },
      ],
    }

    const { result } = renderHook(
      () => {
        const formContext = useFormContext()
        useFormulaVariables(props, setAnswerData)
        return formContext
      },
      {
        wrapper: createWrapper(),
      }
    )

    act(() => {
      result.current.setAllVariables({ QTY: 2, PRICE: 5 })
    })

    act(() => {
      result.current.updateVariable('QTY', 3)
    })

    expect(result.current.getAllVariables().QTY).toBe(3)
    expect(answerData.total_field).toEqual(
      expect.objectContaining({
        formula: 'QTY * PRICE',
        value: 15,
      })
    )
  })
})
