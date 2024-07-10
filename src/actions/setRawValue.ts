import z from 'zod'
import { BasePath, SchemaAt } from '../FieldPath'

export type SetRawValueAction<
  T extends z.ZodTypeAny,
  Path extends BasePath
> = ReturnType<typeof setRawValue<T, Path>>

export function setRawValue<
  T extends z.ZodTypeAny,
  Path extends BasePath
>(props: { path: Path; rawValue: z.input<SchemaAt<T, Path>> }) {
  return {
    type: 'setRawValue',
    ...props,
  } as const
}
