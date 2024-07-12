import React from 'react'
import z from 'zod'
import { FieldPath } from './FieldPath'
import { initialize } from './actions/initialize'
import { setRawValue } from './actions/setRawValue'
import { setValue } from './actions/setValue'
import { submit } from './actions/submit'
import { setSubmitStatus } from './actions/setSubmitStatus'
import { SelectFormValues } from './createSelectFormValues'
import { SelectFieldErrorMap } from './createSelectFieldErrorMap'
import { SelectFormStatus } from './createSelectFormStatus'
import { setMeta } from './actions/setMeta'
import { addHandlers } from './actions/addHandlers'
import { removeHandlers } from './actions/removeHandlers'

export const FormContext =
  React.createContext<FormContextProps<z.ZodTypeAny> | null>(null)

export type FormContextProps<T extends z.ZodTypeAny> = {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
  root: FieldPath<T>
  initialize: typeof initialize<T>
  addHandlers: typeof addHandlers<T>
  removeHandlers: typeof removeHandlers<T>
  setMeta: typeof setMeta
  setRawValue: typeof setRawValue
  setValue: typeof setValue
  submit: typeof submit
  setSubmitStatus: typeof setSubmitStatus<T>
  selectFormStatus: SelectFormStatus
  selectFieldErrorMap: SelectFieldErrorMap
  selectFormValues: SelectFormValues<T>
}
