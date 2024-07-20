import z from 'zod'

export function maybeParse<T extends z.ZodTypeAny>(
  schema: T,
  rawValue: unknown
): z.output<T> | undefined {
  const parsed = schema.safeParse(rawValue)
  return parsed.success ? parsed.data : undefined
}
