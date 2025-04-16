import z from 'zod'
import { DeepPartial } from './util/DeepPartial'

export type FieldMeta = {
  touched: boolean
  visited: boolean
}

export type SubmitHandler<T extends z.ZodTypeAny> = (
  parsedValues: z.output<T>,
  options: {
    initialValues?: DeepPartial<z.input<T>>
    initialParsedValues?: z.output<T>
  }
) => void | Promise<void>

export type SubmitSuccededHandler = () => void | Promise<void>

export type SubmitFailedHandler = (error: unknown) => void | Promise<void>

export type FormState<T extends z.ZodTypeAny> = {
  mounted: boolean
  initialized: boolean
  fieldMeta: { [K in string]?: FieldMeta }
  values?: DeepPartial<z.input<T>>
  parsedValues?: z.output<T>
  submittedParsedValues?: z.output<T>
  submittedValues?: z.input<T>
  initialValues?: DeepPartial<z.input<T>>
  initialParsedValues?: z.output<T>
  validationError?: any
  submitPromise?: Promise<void>
  onSubmit: Set<SubmitHandler<T>>
  onSubmitSucceeded: Set<SubmitSuccededHandler>
  onSubmitFailed: Set<SubmitFailedHandler>
  submitting: boolean
  submitSucceeded: boolean
  submitFailed: boolean
  submitError?: unknown
}
