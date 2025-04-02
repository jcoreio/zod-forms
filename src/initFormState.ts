import z from 'zod'
import { FormState } from './FormState'

export function initFormState<T extends z.ZodTypeAny>(): FormState<T> {
  return {
    mounted: true,
    initialized: false,
    fieldMeta: {},
    initialValues: undefined,
    initialParsedValues: undefined,
    submitting: false,
    submitFailed: false,
    submitSucceeded: false,
    onSubmit: new Set(),
    onSubmitSucceeded: new Set(),
    onSubmitFailed: new Set(),
  }
}
