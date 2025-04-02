import z from 'zod'
import { DeepPartial } from '../util/DeepPartial'

export type InitializeAction<T extends z.ZodTypeAny> = ReturnType<
  typeof initialize<T>
>

export function initialize<T extends z.ZodTypeAny>(props: {
  values?: DeepPartial<z.input<T>>
  parsedValues?: z.output<T>
  keepSubmitSucceeded?: boolean
}) {
  return {
    type: 'initialize',
    ...props,
  } as const
}
