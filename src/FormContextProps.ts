import { z } from 'zod'
import { initialize } from './actions/initialize'
import { setRawValue } from './actions/setRawValue'
import { setValue } from './actions/setValue'
import { UseField } from './createUseField'
import { UseHtmlField } from './createUseHtmlField'

export type FormContextProps<T extends z.ZodTypeAny> = {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
  initialize: typeof initialize<T>
  setRawValue: typeof setRawValue
  setValue: typeof setValue
  useField: UseField<T>
  useHtmlField: UseHtmlField<T>
}
