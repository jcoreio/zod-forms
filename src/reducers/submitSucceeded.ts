import z from 'zod'
import { FormState } from '../FormState'

export function submitSucceededReducer<T extends z.ZodTypeAny>(
  state: FormState<T>
) {
  return {
    ...state,
    submitting: false,
    submitSucceeded: true,
    submitFailed: false,
    submitError: undefined,
    submitPromise: undefined,
    initialParsedValues: state.submittedParsedValues,
    initialValues: state.submittedValues,
  }
}
