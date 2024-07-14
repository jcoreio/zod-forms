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
      const rawValues =
        action.rawValues ??
        (action.values ? inverseSchema.parse(action.values) : undefined)
      const values =
        action.values ??
        (action.rawValues ? schema.parse(action.rawValues) : undefined)
      return {
        ...state,
        validationError: undefined,
        initialized: true,
        submitting: false,
        submitFailed: false,
        submitSucceeded: keepSubmitSucceeded ? state.submitSucceeded : false,
        rawValues,
        values,
        rawInitialValues: rawValues,
        initialValues: values,
      }
    } catch (error) {
      return {
        ...state,
        validationError: error,
        initialized: true,
        submitting: false,
        submitFailed: false,
        submitSucceeded: keepSubmitSucceeded ? state.submitSucceeded : false,
        rawValues: action.rawValues,
        values: action.values,
        rawInitialValues: action.rawValues,
        initialValues: action.values,
      }
    }
  }
