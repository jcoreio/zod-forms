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
  submittedValues?: z.output<T>
  rawSubmittedValues?: z.input<T>
  rawInitialValues?: z.input<T>
  initialValues?: z.output<T>
  validationError?: any
  submitPromise?: Promise<void>
  onSubmit?: (
    values: z.output<T>,
    options: { initialValues: z.output<T> }
  ) => void | Promise<void>
  onSubmitSucceeded?: () => void
  onSubmitFailed?: (error: Error) => void
  submitting: boolean
  submitSucceeded: boolean
  submitFailed: boolean
  submitError?: Error
}
