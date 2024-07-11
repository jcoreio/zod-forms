import z from 'zod'
import { invertible, ZodInvertible } from 'zod-invertible'

const generalRefinements = [
  'optional',
  'nullable',
  'default',
] satisfies (keyof z.ZodTypeAny)[]

const stringRefinements = [
  'email',
  'url',
  'emoji',
  'uuid',
  'nanoid',
  'cuid',
  'cuid2',
  'ulid',
  'base64',
  'ip',
  'datetime',
  'date',
  'time',
  'duration',
  'regex',
  'includes',
  'startsWith',
  'endsWith',
  'min',
  'max',
  'length',
  'nonempty',
  'trim',
  'toUpperCase',
  'toLowerCase',
] satisfies (keyof z.ZodString)[]

type Text<S extends z.ZodTypeAny> = ZodInvertible<
  z.ZodOptional<z.ZodNullable<z.ZodString>>,
  S
> &
  (S extends z.ZodString
    ? {
        [M in (typeof stringRefinements)[number]]: (
          ...args: Parameters<z.ZodString[M]>
        ) => Text<ReturnType<z.ZodString[M]>>
      }
    : // eslint-disable-next-line @typescript-eslint/ban-types
      {})

const makeText = <S extends z.ZodTypeAny>(schema: S): Text<S> =>
  Object.assign(
    invertible(
      z.string().nullish(),
      (s): any => {
        if (!s?.trim()) {
          return schema.safeParse(undefined).success
            ? undefined
            : schema.safeParse(null).success
            ? null
            : s
        }
        return s
      },
      schema,
      (n) => (n == null ? n : String(n))
    ),
    Object.fromEntries(
      [...stringRefinements, ...generalRefinements].map((method) => [
        method,
        (...args: any[]) => makeText((schema as any)[method](...args)),
      ])
    )
  ) as any

export const text = makeText(z.string())
