import z from 'zod'
import { FormState } from '../FormState'
import { SetParsedValueAction } from '../actions/setParsedValue'
import { set } from '../util/set'
import { FieldPath } from '../FieldPath'
import { invert } from 'zod-invertible'

export const createSetParsedValueReducer = <T extends z.ZodTypeAny>({
  schema,
  inverseSchema,
}: {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
}) =>
  function setParsedValueReducer<Field extends FieldPath>(
    state: FormState<T>,
    action: SetParsedValueAction<Field>
  ) {
    const newParsedValues = set(
      state.parsedValues,
      action.field.path,
      action.parsedValue
    ) as (typeof state)['parsedValues']
    try {
      const newValues = inverseSchema.parse(newParsedValues)
      schema.parse(newValues)
      return {
        ...state,
        submitError: undefined,
        validationError: undefined,
        values: newValues,
        parsedValues: newParsedValues,
      }
    } catch (error) {
      const newParsed = invert(action.field.schema).safeParse(
        action.parsedValue
      )
      const values = newParsed.success
        ? (set(
            state.values,
            action.field.path,
            newParsed.data
          ) as (typeof state)['values'])
        : state.values
      const newValidatedParsed = schema.safeParse(values)
      const result = {
        ...state,
        submitError: undefined,
        validationError: !newParsed.success
          ? newParsed.error
          : newValidatedParsed.success
          ? undefined
          : newValidatedParsed.error,
        values,
        parsedValues: newValidatedParsed.success
          ? newValidatedParsed.data
          : state.parsedValues,
      }
      return result
    }
  }
