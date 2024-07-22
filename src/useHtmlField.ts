import z from 'zod'
import { BasePath, FieldPath } from './FieldPath'
import { useField, UseFieldProps } from './useField'
import React, { ChangeEvent, HTMLInputTypeAttribute } from 'react'
import { invert } from 'zod-invertible'
import { useFormContext } from './useFormContext'
import { acceptsNumber } from './util/acceptsNumber'
import { acceptsBigint } from './util/acceptsBigint'
import { PathInSchema, PathstringInSchema } from './util/PathInSchema'
import { parsePathstring } from './util/parsePathstring'
import { SchemaAt } from './util/SchemaAt'

export type HtmlFieldInputProps = {
  name: string
  type: HTMLInputTypeAttribute
  value: string
  checked?: boolean
  onChange: React.ChangeEventHandler
  onFocus: React.FocusEventHandler
  onBlur: React.FocusEventHandler
}

export type ValidUseHtmlFieldProps<Field extends FieldPath> = {
  input: HtmlFieldInputProps
  meta: UseFieldProps<Field>
}

export type UseHtmlFieldProps<Field extends FieldPath> = z.input<
  Field['schema']
> extends string | number | bigint | boolean | null | undefined
  ? {
      input: HtmlFieldInputProps
      meta: UseFieldProps<Field>
    }
  : {
      ERROR: 'field schema input must be a nullish string, number, boolean or bigint'
    }

type UseHtmlFieldOptions<Field, Schema extends z.ZodTypeAny> = {
  field: Field
  type: z.input<Schema> extends boolean | null | undefined
    ? 'checkbox'
    : Exclude<HTMLInputTypeAttribute, 'checkbox'>
  normalizeOnBlur?: boolean
}

export interface TypedUseHtmlField<T extends z.ZodTypeAny> {
  <Field extends FieldPath>(
    options: UseHtmlFieldOptions<Field, Field['schema']>
  ): UseHtmlFieldProps<Field>
  <Path extends PathInSchema<T>>(
    options: UseHtmlFieldOptions<Path, SchemaAt<T, Path>>
  ): UseHtmlFieldProps<FieldPath<SchemaAt<T, Path>>>
  <Path extends PathstringInSchema<T>>(
    options: UseHtmlFieldOptions<Path, SchemaAt<T, parsePathstring<Path>>>
  ): UseHtmlFieldProps<FieldPath<SchemaAt<T, parsePathstring<Path>>>>
}

function useHtmlFieldBase<Field extends FieldPath>(
  options: UseHtmlFieldOptions<Field, Field['schema']>
): UseHtmlFieldProps<Field> {
  const { field, type, normalizeOnBlur = true } = options
  const props = useField(field)
  const {
    value,
    rawValue,
    initialValue,
    rawInitialValue,
    setValue,
    setRawValue,
    setMeta,
    ...meta
  } = props

  const { schema } = field

  // tempRawValue is used for storing blank text when we've coerced the
  // raw value to null or undefined, or storing numeric text when we've
  // coerced the raw value to a number or bigint.
  // This way we can set a raw value that will parse better in the form
  // state without interfering with the text the user is typing.
  const [tempRawValue, setTempRawValue] = React.useState(
    rawValue as string | null | undefined
  )

  const tryNumber = React.useMemo(() => acceptsNumber(schema), [schema])
  const tryBigint = React.useMemo(() => acceptsBigint(schema), [schema])

  const onChange = React.useCallback(
    (e: React.ChangeEvent) => {
      const rawValue = getRawValue(e)
      const normalized = normalizeRawValue(rawValue, {
        schema,
        tryNumber,
        tryBigint,
      })
      if (typeof rawValue === 'string' && typeof normalized !== 'string') {
        setTempRawValue(rawValue)
      }
      setRawValue(normalized)
    },
    [getRawValue, setRawValue, schema]
  )

  const onFocus = React.useCallback(() => {
    setMeta({ visited: true })
  }, [])

  const onBlur = React.useCallback(
    (e: React.FocusEvent) => {
      let rawValue = normalizeRawValue(getRawValue(e), {
        schema,
        tryNumber,
        tryBigint,
      })
      if (normalizeOnBlur) {
        const parsed = field.schema.safeParse(rawValue)
        const formatted = parsed.success
          ? invert(field.schema).safeParse(parsed.data)
          : undefined
        if (formatted?.success) rawValue = formatted.data
        setRawValue(rawValue)
      }
      setTempRawValue(undefined)
      setMeta({ visited: true, touched: true })
    },
    [getRawValue, setRawValue, schema]
  )

  return React.useMemo(
    (): ValidUseHtmlFieldProps<Field> => ({
      input: {
        name: field.pathstring,
        type,
        value:
          typeof rawValue === 'boolean'
            ? String(rawValue)
            : typeof rawValue === 'string'
            ? rawValue || tempRawValue || ''
            : tempRawValue || (rawValue == null ? '' : String(rawValue) || ''),
        ...(type === 'checkbox' && { checked: Boolean(rawValue) }),
        onChange,
        onFocus,
        onBlur,
      },
      meta: {
        ...meta,
        value,
        rawValue,
        initialValue,
        rawInitialValue,
        setValue,
        setRawValue,
        setMeta,
      },
    }),
    [props, tempRawValue, onChange]
  ) as any
}

function getRawValue(e: ChangeEvent) {
  const { target } = e
  if (target instanceof HTMLInputElement) {
    return target.type === 'checkbox' ? target.checked : target.value
  }
  return (target as any).value
}

function normalizeBlank(schema: z.ZodTypeAny): any {
  if (schema.safeParse(undefined).success) return undefined
  if (schema.safeParse(null).success) return null
  return undefined
}

function safeBigInt(rawValue: string): bigint | undefined {
  try {
    return BigInt(rawValue)
  } catch (error) {
    return undefined
  }
}

function normalizeRawValue(
  rawValue: string | boolean,
  {
    schema,
    tryNumber,
    tryBigint,
  }: { schema: z.ZodTypeAny; tryNumber: boolean; tryBigint: boolean }
): string | boolean | number | bigint | null | undefined {
  if (typeof rawValue === 'boolean') return rawValue
  if (typeof rawValue === 'string' && !/\S/.test(rawValue)) {
    return normalizeBlank(schema)
  }
  if (typeof rawValue === 'string' && !schema.safeParse(rawValue).success) {
    if (tryNumber) {
      const num = Number(rawValue)
      if (!isNaN(num)) return num
    }
    if (tryBigint) {
      const bigint = safeBigInt(rawValue)
      if (bigint != null) return bigint
    }
  }
  return rawValue
}

export function useHtmlField<Field extends FieldPath>(
  options: UseHtmlFieldOptions<Field, Field['schema']>
): UseHtmlFieldProps<Field>
export function useHtmlField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseHtmlField<T> to pass a path array'
  >,
  Path extends PathInSchema<T> = any
>(
  options: UseHtmlFieldOptions<Path, SchemaAt<T, Path>>
): UseHtmlFieldProps<FieldPath<SchemaAt<T, Path>>>
export function useHtmlField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseHtmlField<T> to pass a pathstring'
  >,
  Path extends PathstringInSchema<T> = any
>(
  options: UseHtmlFieldOptions<Path, SchemaAt<T, parsePathstring<Path>>>
): UseHtmlFieldProps<FieldPath<SchemaAt<T, parsePathstring<Path>>>>
export function useHtmlField<T extends z.ZodTypeAny>({
  field,
  ...rest
}: UseHtmlFieldOptions<FieldPath | BasePath, T>): UseHtmlFieldProps<any> {
  const { root } = useFormContext<T>()
  return useHtmlFieldBase({
    field: field instanceof FieldPath ? field : root.get(field as any),
    ...rest,
  })
}
