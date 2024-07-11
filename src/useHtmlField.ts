import z from 'zod'
import { BasePath, FieldPath, SchemaAt } from './FieldPath'
import { useField, TypedUseField, UseFieldProps } from './useField'
import React, { HTMLInputTypeAttribute } from 'react'
import { invert } from 'zod-invertible'
import { useFormContext } from './useFormContext'

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
> extends string | boolean | null | undefined
  ? {
      input: HtmlFieldInputProps
      meta: UseFieldProps<Field>
    }
  : { ERROR: 'field schema input must be a nullish boolean or string' }

type UseHtmlFieldOptions<Field, Schema extends z.ZodTypeAny> = {
  field: Field
  type: z.input<Schema> extends boolean | null | undefined
    ? 'checkbox'
    : Exclude<HTMLInputTypeAttribute, 'checkbox'>
  normalizeOnBlur?: boolean
  blankValue?: any
}

export interface TypedUseHtmlField<T extends z.ZodTypeAny> {
  <Field extends FieldPath>(
    options: UseHtmlFieldOptions<Field, Field['schema']>
  ): UseHtmlFieldProps<Field>
  <Path extends BasePath>(
    options: UseHtmlFieldOptions<Path, SchemaAt<T, Path>>
  ): UseHtmlFieldProps<FieldPath<SchemaAt<T, Path>>>
}

const PRESERVE_BLANK = Symbol('PRESERVE_BLANK')

function useHtmlFieldBase<T extends z.ZodTypeAny, Field extends FieldPath>(
  options: UseHtmlFieldOptions<Field, Field['schema']>
): UseHtmlFieldProps<Field> {
  const { field, type, normalizeOnBlur = true } = options
  const props = (useField as TypedUseField<T>)(field)
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

  const blankValue = React.useMemo(() => {
    if (type === 'checkbox') return false
    if ('blankValue' in options) return options.blankValue
    const { schema } = field
    if (schema.safeParse(undefined).success) return undefined
    if (schema.safeParse(null).success) return null
    return PRESERVE_BLANK
  }, [type, field.pathstring, options.blankValue, 'blankValue' in options])

  const getRawValue = React.useCallback(
    (el: HTMLInputElement) =>
      type === 'checkbox'
        ? el.checked
        : blankValue === PRESERVE_BLANK || /\S/.test(el.value)
        ? el.value
        : blankValue,

    [type, blankValue]
  )

  const onChange = React.useCallback(
    (e: React.ChangeEvent) => {
      if (e.currentTarget instanceof HTMLInputElement) {
        setRawValue(getRawValue(e.currentTarget))
      }
    },
    [getRawValue, setRawValue]
  )

  const onFocus = React.useCallback(() => {
    setMeta({ visited: true })
  }, [])

  const onBlur = React.useCallback(
    (e: React.FocusEvent) => {
      if (e.currentTarget instanceof HTMLInputElement) {
        let newValue = getRawValue(e.currentTarget)
        if (normalizeOnBlur) {
          const parsed = field.schema.safeParse(newValue)
          const formatted = parsed.success
            ? invert(field.schema).safeParse(parsed.data)
            : undefined
          if (formatted?.success) newValue = formatted.data
        }
        setRawValue(newValue)
      }
      setMeta({ visited: true, touched: true })
    },
    [getRawValue, setRawValue]
  )

  return React.useMemo(
    (): ValidUseHtmlFieldProps<Field> => ({
      input: {
        name: field.pathstring,
        type,
        value: rawValue || '',
        checked: Boolean(rawValue),
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
    [props, onChange]
  ) as any
}

export function useHtmlField<Field extends FieldPath>(
  options: UseHtmlFieldOptions<Field, Field['schema']>
): UseHtmlFieldProps<Field>
export function useHtmlField<T extends z.ZodTypeAny, Path extends BasePath>(
  options: UseHtmlFieldOptions<Path, SchemaAt<T, Path>>
): UseHtmlFieldProps<FieldPath<SchemaAt<T, Path>>>
export function useHtmlField({
  field,
  ...rest
}: UseHtmlFieldOptions<
  FieldPath | BasePath,
  z.ZodTypeAny
>): UseHtmlFieldProps<any> {
  const { root } = useFormContext()
  return useHtmlFieldBase({
    field: Array.isArray(field) ? root.get(...(field as any)) : field,
    ...rest,
  })
}
