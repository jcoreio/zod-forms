import { FieldPath } from '../FieldPath'
import { FieldMeta } from '../FormState'
import z from 'zod'

export type SetMetaAction<
  T extends z.ZodTypeAny,
  Field extends FieldPath<T, any>
> = ReturnType<typeof setMeta<T, Field>>

export function setMeta<
  T extends z.ZodTypeAny,
  Field extends FieldPath<T, any>
>(props: { field: Field; meta: Partial<FieldMeta> }) {
  return {
    type: 'setMeta',
    ...props,
  } as const
}
