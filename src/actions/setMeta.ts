import { FieldPath } from '../FieldPath'
import { FieldMeta } from '../FormState'

export type SetMetaAction<Field extends FieldPath> = ReturnType<
  typeof setMeta<Field>
>

export function setMeta<Field extends FieldPath>(
  field: Field,
  meta: Partial<FieldMeta>
) {
  return {
    type: 'setMeta',
    field,
    meta,
  } as const
}
