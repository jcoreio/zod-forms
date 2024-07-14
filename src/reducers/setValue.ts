import z from 'zod'
import { FormState } from '../FormState'
import { SetValueAction } from '../actions/setValue'
import { set } from '../util/set'
import { FieldPath } from '../FieldPath'
import { invert } from 'zod-invertible'

export const createSetValueReducer = <T extends z.ZodTypeAny>({
  schema,
  inverseSchema,
}: {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
}) =>
  function setValueReducer<Field extends FieldPath>(
    state: FormState<T>,
    action: SetValueAction<Field>
  ) {
    const newValues = set(state.values, action.field.path, action.value)
    try {
      const newRawValues = inverseSchema.parse(newValues)
      schema.parse(newRawValues)
      return {
        ...state,
        submitError: undefined,
        validationError: undefined,
        rawValues: newRawValues,
        values: newValues,
      }
    } catch (error) {
      const newRawParsed = invert(action.field.schema).safeParse(action.value)
      const rawValues = newRawParsed.success
        ? set(state.rawValues, action.field.path, newRawParsed.data)
        : state.rawValues
      const newParsed = schema.safeParse(rawValues)
      const result = {
        ...state,
        submitError: undefined,
        validationError: !newRawParsed.success
          ? newRawParsed.error
          : newParsed.success
          ? undefined
          : newParsed.error,
        rawValues,
        values: newParsed.success ? newParsed.data : state.values,
      }
      return result
    }
  }
