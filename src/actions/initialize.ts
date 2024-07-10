import z from 'zod'

export type InitializeAction<T extends z.ZodTypeAny> = ReturnType<
  typeof initialize<T>
>

export function initialize<T extends z.ZodTypeAny>(props: {
  rawValues?: z.input<T>
  values?: z.output<T>
  keepSubmitSucceeded?: boolean
}) {
  return {
    type: 'initialize',
    ...props,
  } as const
}
