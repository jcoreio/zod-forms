import { z } from 'zod'
import { initialize } from './actions/initialize'
import { setRawValue } from './actions/setRawValue'
import { setValue } from './actions/setValue'

export type FormContextProps<T extends z.ZodTypeAny> = {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
  initialize: typeof initialize<T>
  setRawValue: typeof setRawValue<T, any>
  setValue: typeof setValue<T, any>
}
