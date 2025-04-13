import z from 'zod'
import { FieldPath } from '../FieldPath'
import { DeepPartial } from '../util/DeepPartial'

export type SetValueAction<Field extends FieldPath> = ReturnType<
  typeof setValue<Field>
>

export function setValue<Field extends FieldPath>(
  field: Field,
  value: DeepPartial<z.input<Field['schema']>> | undefined
) {
  return {
    type: 'setValue',
    field,
    value,
  } as const
}
