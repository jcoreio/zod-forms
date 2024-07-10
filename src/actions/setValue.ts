import z from 'zod'
import { FieldPath } from '../FieldPath'

export type SetValueAction<Field extends FieldPath> = ReturnType<
  typeof setValue<Field>
>

export function setValue<Field extends FieldPath>(props: {
  field: Field
  value: z.output<Field['schema']>
  normalize?: boolean
}) {
  return {
    type: 'setValue',
    ...props,
  } as const
}
