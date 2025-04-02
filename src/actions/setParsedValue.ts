import z from 'zod'
import { FieldPath } from '../FieldPath'

export type SetParsedValueAction<Field extends FieldPath> = ReturnType<
  typeof setParsedValue<Field>
>

export function setParsedValue<Field extends FieldPath>(
  field: Field,
  parsedValue: z.output<Field['schema']>,
  options?: {
    normalize?: boolean
  }
) {
  return {
    type: 'setParsedValue',
    field,
    parsedValue,
    ...options,
  } as const
}
