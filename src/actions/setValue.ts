import z from 'zod'
import { FieldPath } from '../FieldPath'

export type SetValueAction<
  T extends z.ZodTypeAny,
  Field extends FieldPath<T, any>
> = ReturnType<typeof setValue<T, Field>>

export function setValue<
  T extends z.ZodTypeAny,
  Field extends FieldPath<T, any>
>(props: { field: Field; value: z.output<Field['schema']> }) {
  return {
    type: 'setValue',
    ...props,
  } as const
}
