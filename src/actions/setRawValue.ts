import z from 'zod'
import { FieldPath } from '../FieldPath'

export type SetRawValueAction<Field extends FieldPath> = ReturnType<
  typeof setRawValue<Field>
>

export function setRawValue<Field extends FieldPath>(props: {
  field: Field
  rawValue: z.input<Field['schema']>
}) {
  return {
    type: 'setRawValue',
    ...props,
  } as const
}
