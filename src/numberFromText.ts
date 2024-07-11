import z from 'zod'
import { invertible, ZodInvertible } from 'zod-invertible'

const generalRefinements = [
  'optional',
  'nullable',
  'default',
] satisfies (keyof z.ZodTypeAny)[]

const numberRefinements = [
  'gte',
  'min',
  'gt',
  'lte',
  'max',
  'lt',
  'int',
  'positive',
  'negative',
  'nonpositive',
  'nonnegative',
  'multipleOf',
  'step',
  'finite',
  'safe',
] satisfies (keyof z.ZodNumber)[]

type NumberFromText<S extends z.ZodTypeAny> = ZodInvertible<
  z.ZodOptional<z.ZodNullable<z.ZodString>>,
  S
> &
  (S extends z.ZodNumber
    ? {
        [M in (typeof numberRefinements)[number]]: (
          ...args: Parameters<z.ZodNumber[M]>
        ) => NumberFromText<ReturnType<z.ZodNumber[M]>>
      }
    : // eslint-disable-next-line @typescript-eslint/ban-types
      {})

const makeNumberFromText = <S extends z.ZodTypeAny>(
  schema: S
): NumberFromText<S> =>
  Object.assign(
    invertible(
      z.string().nullish(),
      (s, ctx): any => {
        if (!s?.trim()) {
          const parsed = schema.safeParse(s)
          return parsed.success
            ? parsed.data
            : schema.safeParse(undefined).success
            ? undefined
            : schema.safeParse(null).success
            ? null
            : undefined
        }
        const num = Number(s)
        if (isNaN(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'invalid number',
          })
        }
        return num
      },
      schema,
      (n) => (n == null ? n : String(n))
    ),
    Object.fromEntries(
      [...numberRefinements, ...generalRefinements].map((method) => [
        method,
        (...args: any[]) =>
          makeNumberFromText((schema as any)[method](...args)),
      ])
    )
  ) as any

export const numberFromText = makeNumberFromText(z.number())
