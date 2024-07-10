import z from 'zod'
import { BasePath, SchemaAt } from '../FieldPath'

export type SetValueAction<
  T extends z.ZodTypeAny,
  Path extends BasePath
> = ReturnType<typeof setValue<T, Path>>

export function setValue<T extends z.ZodTypeAny, Path extends BasePath>(props: {
  path: Path
  value: z.output<SchemaAt<T, Path>>
}) {
  return {
    type: 'setValue',
    ...props,
  } as const
}
