import z from 'zod'

export function maybeParse<T extends z.ZodTypeAny>(
  schema: T,
  value: unknown
): z.output<T> | undefined {
  const parsed = schema.safeParse(value)
  return parsed.success ? parsed.data : undefined
}
