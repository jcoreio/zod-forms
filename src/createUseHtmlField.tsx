import z from 'zod'
import { BasePath, FieldPath, SchemaAt } from './FieldPath'
import { createUseField, UseFieldProps } from './createUseField'
import React, { HTMLInputTypeAttribute } from 'react'

type HtmlFieldInputProps = {
  name: string
  type: HTMLInputTypeAttribute
  value: string
  checked?: boolean
  onChange: React.ChangeEventHandler
  onFocus: React.FocusEventHandler
  onBlur: React.FocusEventHandler
}

type ValidUseHtmlFieldProps<Field extends FieldPath> = {
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
}

export interface UseHtmlField<T extends z.ZodTypeAny> {
  <Field extends FieldPath>(
    options: UseHtmlFieldOptions<Field, Field['schema']>
  ): UseHtmlFieldProps<Field>
  <Path extends BasePath>(
    options: UseHtmlFieldOptions<Path, SchemaAt<T, Path>>
  ): UseHtmlFieldProps<FieldPath<SchemaAt<T, Path>>>
}

export const createUseHtmlField = <T extends z.ZodTypeAny>({
  root,
  useField,
}: {
  root: FieldPath<T>
  useField: ReturnType<typeof createUseField<T>>
}): UseHtmlField<T> => {
  function useHtmlFieldBase<Field extends FieldPath>({
    field,
    type,
    normalizeOnBlur,
  }: {
    field: Field
    type: HTMLInputTypeAttribute
    normalizeOnBlur?: boolean
  }): UseHtmlFieldProps<Field> {
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

    const onChange = React.useCallback(
      (e: React.ChangeEvent) => {
        if (e.currentTarget instanceof HTMLInputElement) {
          setRawValue(
            type === 'checkbox'
              ? e.currentTarget.checked
              : e.currentTarget.value
          )
        }
      },
      [setRawValue, type]
    )

    const onFocus = React.useCallback(() => {
      setMeta({ visited: true })
    }, [])

    const onBlur = React.useCallback(
      (e: React.FocusEvent) => {
        if (e.currentTarget instanceof HTMLInputElement) {
          const newValue =
            type === 'checkbox'
              ? e.currentTarget.checked
              : e.currentTarget.value
          if (normalizeOnBlur)
            setValue(field.schema.parse(newValue), { normalize: true })
          else setRawValue(newValue)
        }
        setMeta({ visited: true, touched: true })
      },
      [setRawValue, type]
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
  function useHtmlField<Field extends FieldPath>(
    options: UseHtmlFieldOptions<Field, Field['schema']>
  ): UseHtmlFieldProps<Field>
  function useHtmlField<Path extends BasePath>(
    options: UseHtmlFieldOptions<Path, SchemaAt<T, Path>>
  ): UseHtmlFieldProps<FieldPath<SchemaAt<T, Path>>>
  function useHtmlField({
    field,
    ...rest
  }: UseHtmlFieldOptions<
    FieldPath | BasePath,
    z.ZodTypeAny
  >): UseHtmlFieldProps<any> {
    return useHtmlFieldBase({
      field: Array.isArray(field) ? root.get(...(field as any)) : field,
      ...rest,
    })
  }
  return useHtmlField
}
