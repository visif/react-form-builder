/**
 * useFormulaVariables Hook
 *
 * Handles formula variable management and cascading updates:
 * - Subscribes to variable changes
 * - Handles cascading formula recalculations
 * - Updates dependent formula fields automatically
 */
import { useCallback, useEffect } from 'react'
import { Parser } from 'hot-formula-parser'
import { useFormContext } from '../../../contexts/FormContext'

export const useFormulaVariables = (props, setAnswerData) => {
  const formContext = useFormContext()

  // Variable change handler with cascading formula updates
  const handleVariableChange = useCallback(
    (params) => {
      const allVariables = formContext.getAllVariables()
      const newVariables = {
        ...allVariables,
        [params.propKey]: params.value,
      }

      setAnswerData((prevAnswerData) => {
        const newAnswerData = { ...prevAnswerData }

        // Get all formula fields for cascading updates
        const allFormulaFields = props.data.filter(
          (item) => item.element === 'FormulaInput' && item.formula
        )

        // Keep track of which variables have been updated to detect cascading changes
        const updatedVariables = new Set([params.propKey])
        let hasChanges = true

        // Continue recalculating until no more changes occur (cascading updates)
        while (hasChanges) {
          hasChanges = false

          // Find formula fields that depend on any recently updated variables
          const affectedFields = allFormulaFields.filter((formulaField) => {
            return Array.from(updatedVariables).some((varKey) =>
              formulaField.formula.includes(varKey)
            )
          })

          // Clear the updated variables set for this iteration
          updatedVariables.clear()

          affectedFields.forEach((formulaField) => {
            try {
              // Use same formula parsing logic as FormulaInput component
              const parser = new Parser()

              // Set all current variables in parser
              Object.entries(newVariables).forEach(([key, value]) => {
                const parsedValue = parseFloat(value)
                if (!Number.isNaN(parsedValue)) {
                  parser.setVariable(key, parsedValue)
                }
              })

              // Calculate new formula result
              const parseResult = parser.parse(formulaField.formula)
              const newValue = parseResult?.result || 0

              // Update the answer data for this formula field
              newAnswerData[formulaField.field_name] = {
                formula: formulaField.formula,
                value: newValue,
                variables: newVariables,
              }

              // If this formula field has a formularKey, update variables with its new value
              if (formulaField.formularKey) {
                const oldValue = newVariables[formulaField.formularKey]
                const valueChanged = Math.abs((oldValue || 0) - newValue) > 0.0001

                if (valueChanged) {
                  newVariables[formulaField.formularKey] = newValue
                  updatedVariables.add(formulaField.formularKey)
                  hasChanges = true
                }
              }
            } catch (error) {
              console.warn(`Error calculating formula for ${formulaField.field_name}:`, error)
            }
          })
        }

        // Update context with all new variables
        formContext.setAllVariables(newVariables)

        return newAnswerData
      })
    },
    [props.data, formContext, setAnswerData]
  )

  // Subscribe to variable changes via context
  useEffect(() => {
    const unsubscribe = formContext.addVariableListener(handleVariableChange)
    return unsubscribe
  }, [formContext, handleVariableChange])

  return {
    handleVariableChange,
  }
}
