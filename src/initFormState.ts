import z from 'zod'
import { FormState } from './FormState'

export function initFormState<T extends z.ZodTypeAny>({
  schema,
  inverseSchema,
}: {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
}): FormState<T> {
  return {
    mounted: true,
    initialized: false,
    fieldMeta: {},
    rawInitialValues: undefined,
    initialValues: undefined,
    submitting: false,
    submitFailed: false,
    submitSucceeded: false,
  }
}
