import z from 'zod'
import { FormState } from '../FormState'
import { SetRawValueAction } from '../actions/setRawValue'
import { set } from '../util/set'
import { FieldPath } from '../FieldPath'

export const createSetRawValueReducer = <T extends z.ZodTypeAny>({
  schema,
}: {
  schema: T
}) =>
  function setRawValueReducer<Field extends FieldPath>(
    state: FormState<T>,
    action: SetRawValueAction<Field>
  ) {
    const newRawValues = set(
      state.rawValues,
      action.field.path,
      action.rawValue
    )
    if (newRawValues === state.rawValues) return state
    try {
      const newValues = schema.parse(newRawValues)
      return {
        ...state,
        submitError: undefined,
        validationError: undefined,
        rawValues: newRawValues,
        values: newValues,
      }
    } catch (error) {
      return {
        ...state,
        submitError: undefined,
        validationError: error,
        rawValues: newRawValues,
        values: undefined,
      }
    }
  }
