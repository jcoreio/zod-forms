import React from 'react'
import z from 'zod'
import { FieldPath } from './FieldPath'
import { initialize } from './actions/initialize'
import { setHandlers } from './actions/setHandlers'
import { setRawValue } from './actions/setRawValue'
import { setValue } from './actions/setValue'
import { submit } from './actions/submit'
import { setSubmitStatus } from './actions/setSubmitStatus'
import { SelectFormValues } from './createSelectFormValues'
import { SelectFieldErrorMap } from './createSelectFieldErrorMap'
import { SelectFormStatus } from './createSelectFormStatus'

export const FormContext =
  React.createContext<FormContextProps<z.ZodTypeAny> | null>(null)

export type FormContextProps<T extends z.ZodTypeAny> = {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
  root: FieldPath<T>
  initialize: typeof initialize<T>
  setHandlers: typeof setHandlers<T>
  setRawValue: typeof setRawValue
  setValue: typeof setValue
  submit: typeof submit
  setSubmitStatus: typeof setSubmitStatus<T>
  selectFormStatus: SelectFormStatus
  selectFieldErrorMap: SelectFieldErrorMap
  selectFormValues: SelectFormValues<T>
}
