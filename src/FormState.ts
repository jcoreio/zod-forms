import z from 'zod'

export type FieldMeta = {
  touched: boolean
  visited: boolean
}

export type SubmitHandler<T extends z.ZodTypeAny> = (
  values: z.output<T>,
  options: { initialValues: z.output<T> }
) => void | Promise<void>

export type SubmitSuccededHandler = () => void

export type SubmitFailedHandler = (error: Error) => void

export type FormState<T extends z.ZodTypeAny> = {
  mounted: boolean
  initialized: boolean
  fieldMeta: Record<string, FieldMeta>
  rawValues?: unknown
  values?: z.output<T>
  submittedValues?: z.output<T>
  rawSubmittedValues?: z.input<T>
  rawInitialValues?: unknown
  initialValues?: z.output<T>
  validationError?: any
  submitPromise?: Promise<void>
  onSubmit: Set<SubmitHandler<T>>
  onSubmitSucceeded: Set<SubmitSuccededHandler>
  onSubmitFailed: Set<SubmitFailedHandler>
  submitting: boolean
  submitSucceeded: boolean
  submitFailed: boolean
  submitError?: Error
}
