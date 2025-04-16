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
import { DeepPartial } from './util/DeepPartial'

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

export type UseHtmlFieldProps<Field extends FieldPath> =
  z.input<Field['schema']> extends (
    string | number | bigint | boolean | null | undefined
  ) ?
    {
      input: HtmlFieldInputProps
      meta: UseFieldProps<Field>
    }
  : {
      ERROR: 'field schema input must be a nullish string, number, boolean or bigint'
    }

export type UseHtmlFieldOptions<
  Field,
  Schema extends z.ZodTypeAny = Field extends FieldPath<infer S> ? S
  : z.ZodTypeAny,
> = {
  field: Field
  type: z.input<Schema> extends boolean | null | undefined ? 'checkbox'
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
    parsedValue,
    value,
    initialParsedValue,
    initialValue,
    setParsedValue,
    setValue,
    setMeta,
    ...meta
  } = props

  const { schema } = field

  // tempValue is used for storing blank text when we've coerced the
  // value to null or undefined, or storing numeric text when we've
  // coerced the value to a number or bigint.
  // This way we can set a value that will parse better in the form
  // state without interfering with the text the user is typing.
  const [tempValue, setTempValue] = React.useState(
    value as string | null | undefined
  )

  const tryNumber = React.useMemo(() => acceptsNumber(schema), [schema])
  const tryBigint = React.useMemo(() => acceptsBigint(schema), [schema])

  const onChange = React.useCallback(
    (e: React.ChangeEvent) => {
      const value = getValue(e)
      const normalized = normalizeValue(value, {
        schema,
        tryNumber,
        tryBigint,
      })
      if (typeof value === 'string' && typeof normalized !== 'string') {
        setTempValue(value)
      }
      setValue(normalized)
    },
    [getValue, setValue, schema]
  )

  const onFocus = React.useCallback(() => {
    setMeta({ visited: true })
  }, [])

  const onBlur = React.useCallback(
    (e: React.FocusEvent) => {
      let value = normalizeValue(getValue(e), {
        schema,
        tryNumber,
        tryBigint,
      })
      if (normalizeOnBlur) {
        const parsed = field.schema.safeParse(value)
        const formatted =
          parsed.success ?
            invert(field.schema).safeParse(parsed.data)
          : undefined
        if (formatted?.success) value = formatted.data
        setValue(value)
      }
      setTempValue(undefined)
      setMeta({ visited: true, touched: true })
    },
    [getValue, setValue, schema]
  )

  return React.useMemo(
    (): ValidUseHtmlFieldProps<Field> => ({
      input: {
        name: field.pathstring,
        type,
        value:
          typeof value === 'boolean' ? String(value)
          : typeof value === 'string' ? value || tempValue || ''
          : tempValue || (value == null ? '' : String(value) || ''),
        ...(type === 'checkbox' && { checked: Boolean(value) }),
        onChange,
        onFocus,
        onBlur,
      },
      meta: {
        ...meta,
        parsedValue,
        value,
        initialParsedValue,
        initialValue,
        setParsedValue,
        setValue,
        setMeta,
      },
    }),
    [props, tempValue, onChange]
  ) as any
}

function getValue(e: ChangeEvent) {
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

function safeBigInt(value: string): bigint | undefined {
  try {
    return BigInt(value)
  } catch {
    return undefined
  }
}

function normalizeValue<T extends z.ZodTypeAny>(
  value: string | boolean,
  {
    schema,
    tryNumber,
    tryBigint,
  }: { schema: T; tryNumber: boolean; tryBigint: boolean }
): DeepPartial<z.input<T>> | undefined {
  if (typeof value === 'boolean') return value as any
  if (typeof value === 'string' && !/\S/.test(value)) {
    return normalizeBlank(schema)
  }
  if (typeof value === 'string' && !schema.safeParse(value).success) {
    if (tryNumber) {
      const num = Number(value)
      if (!isNaN(num)) return num as any
    }
    if (tryBigint) {
      const bigint = safeBigInt(value)
      if (bigint != null) return bigint as any
    }
  }
  return value as any
}

export function useHtmlField<Field extends FieldPath>(
  options: UseHtmlFieldOptions<Field, Field['schema']>
): UseHtmlFieldProps<Field>
export function useHtmlField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseHtmlField<T> to pass a path array'
  >,
  Path extends PathInSchema<T> = any,
>(
  options: UseHtmlFieldOptions<Path, SchemaAt<T, Path>>
): UseHtmlFieldProps<FieldPath<SchemaAt<T, Path>>>
export function useHtmlField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseHtmlField<T> to pass a pathstring'
  >,
  Path extends PathstringInSchema<T> = any,
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
