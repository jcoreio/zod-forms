import z from 'zod'
import { FormState } from '../FormState'
import { InitializeAction } from '../actions/initialize'

export const createInitializeReducer = <T extends z.ZodTypeAny>({
  schema,
  inverseSchema,
}: {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
}) =>
  function initializeReducer(state: FormState<T>, action: InitializeAction<T>) {
    const { keepSubmitSucceeded } = action
    try {
      const values =
        action.values ??
        (action.parsedValues ?
          inverseSchema.parse(action.parsedValues)
        : undefined)
      const parsedValues =
        action.parsedValues ??
        (action.values ? schema.parse(action.values) : undefined)
      return {
        ...state,
        validationError: undefined,
        initialized: true,
        submitting: false,
        submitFailed: false,
        submitSucceeded: keepSubmitSucceeded ? state.submitSucceeded : false,
        values,
        parsedValues,
        initialValues: values,
        initialParsedValues: parsedValues,
      }
    } catch (error) {
      return {
        ...state,
        validationError: error,
        initialized: true,
        submitting: false,
        submitFailed: false,
        submitSucceeded: keepSubmitSucceeded ? state.submitSucceeded : false,
        values: action.values,
        parsedValues: action.parsedValues,
        initialValues: action.values,
        initialParsedValues: action.parsedValues,
      }
    }
  }
