import { z } from 'zod'
import { initialize } from './actions/initialize'
import { setRawValue } from './actions/setRawValue'
import { setValue } from './actions/setValue'
import { UseField } from './createUseField'
import { UseHtmlField } from './createUseHtmlField'
import { setHandlers } from './actions/setHandlers'
import { submit } from './actions/submit'
import { setSubmitStatus } from './actions/setSubmitStatus'

export type FormContextProps<T extends z.ZodTypeAny> = {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
  initialize: typeof initialize<T>
  setHandlers: typeof setHandlers<T>
  setRawValue: typeof setRawValue
  setValue: typeof setValue
  submit: typeof submit
  setSubmitStatus: typeof setSubmitStatus<T>
  useField: UseField<T>
  useHtmlField: UseHtmlField<T>
}
