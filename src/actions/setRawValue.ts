import z from 'zod'
import { FieldPath } from '../FieldPath'

export type SetRawValueAction<
  T extends z.ZodTypeAny,
  Field extends FieldPath<T, any>
> = ReturnType<typeof setRawValue<T, Field>>

export function setRawValue<
  T extends z.ZodTypeAny,
  Field extends FieldPath<T, any>
>(props: { field: Field; rawValue: z.input<Field['schema']> }) {
  return {
    type: 'setRawValue',
    ...props,
  } as const
}
