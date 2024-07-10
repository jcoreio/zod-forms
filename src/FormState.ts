import z from 'zod'

export type FieldMeta = {
  touched: boolean
  visited: boolean
}

export type FormState<T extends z.ZodTypeAny> = {
  mounted: boolean
  initialized: boolean
  fieldMeta: Record<string, FieldMeta>
  rawValues?: z.input<T>
  values?: z.output<T>
  rawInitialValues?: z.input<T>
  initialValues?: z.input<T>
  validationError?: any
  submitting: boolean
  submitSucceeded: boolean
  submitFailed: boolean
  submitError?: Error
}
