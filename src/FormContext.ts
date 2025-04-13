import React from 'react'
import z from 'zod'
import { FieldPath } from './FieldPath'
import { initialize } from './actions/initialize'
import { setValue } from './actions/setValue'
import { setParsedValue } from './actions/setParsedValue'
import { submit } from './actions/submit'
import { setSubmitStatus } from './actions/setSubmitStatus'
import { SelectFormValues } from './createSelectFormValues'
import { SelectFieldErrorMap } from './createSelectFieldErrorMap'
import {
  createSelectFormStatus,
  SelectFormStatus,
} from './createSelectFormStatus'
import { setMeta } from './actions/setMeta'
import { addHandlers } from './actions/addHandlers'
import { removeHandlers } from './actions/removeHandlers'
import { arrayActions } from './actions/arrayActions'
import { DeepPartial } from './util/DeepPartial'

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
  setValue: typeof setValue
  setParsedValue: typeof setParsedValue
  submit: typeof submit
  setSubmitStatus: typeof setSubmitStatus<T>
  arrayActions: arrayActions
  selectFormStatus: SelectFormStatus
  selectFieldErrorMap: SelectFieldErrorMap
  selectFormValues: SelectFormValues<T>
  getParsedValues: () => z.output<T> | undefined
  getValues: () => DeepPartial<z.input<T>> | undefined
  getInitialParsedValues: () => z.output<T> | undefined
  getInitialValues: () => DeepPartial<z.input<T>> | undefined
  getStatus: () => ReturnType<ReturnType<typeof createSelectFormStatus>>
}
