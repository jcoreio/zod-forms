import z from 'zod'
import { FormState } from '../FormState'
import { SetValueAction } from '../actions/setValue'
import { set } from '../util/set'
import { FieldPath } from '../FieldPath'

export const createSetValueReducer = <T extends z.ZodTypeAny>({
  schema,
}: {
  schema: T
}) =>
  function setValueReducer<Field extends FieldPath>(
    state: FormState<T>,
    action: SetValueAction<Field>
  ) {
    const newValues = set(
      state.values,
      action.field.path,
      action.value
    ) as (typeof state)['values']
    if (newValues === state.values) return state
    try {
      const newParsedValues = schema.parse(newValues)
      return {
        ...state,
        submitError: undefined,
        validationError: undefined,
        values: newValues,
        parsedValues: newParsedValues,
      }
    } catch (error) {
      return {
        ...state,
        submitError: undefined,
        validationError: error,
        values: newValues,
        parsedValues: undefined,
      }
    }
  }
