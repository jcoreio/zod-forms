import z from 'zod'
import { FieldPath } from '../FieldPath'

export type SetValueAction<Field extends FieldPath> = ReturnType<
  typeof setValue<Field>
>

export function setValue<Field extends FieldPath>(
  field: Field,
  value: z.output<Field['schema']>,
  options?: {
    normalize?: boolean
  }
) {
  return {
    type: 'setValue',
    field,
    value,
    ...options,
  } as const
}
