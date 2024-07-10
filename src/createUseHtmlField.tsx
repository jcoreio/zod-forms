import z from 'zod'
import { BasePath, FieldPath } from './FieldPath'
import { createUseField } from './createUseField'
import React, { HTMLInputTypeAttribute } from 'react'

export const createUseHtmlField = <T extends z.ZodTypeAny>({
  useField,
}: {
  useField: ReturnType<typeof createUseField<T>>
}) =>
  function useHtmlField<Path extends BasePath>({
    field,
    type,
    normalizeOnBlur,
  }: {
    field: FieldPath<T, Path>
    type: HTMLInputTypeAttribute
    normalizeOnBlur?: boolean
  }) {
    const props = useField(field)
    const {
      value,
      rawValue,
      initialValue,
      rawInitialValue,
      setValue,
      setRawValue,
      setMeta,
      error,
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
          if (normalizeOnBlur) setValue(field.schema.parse(newValue))
          else setRawValue(newValue)
        }
        setMeta({ visited: true, touched: true })
      },
      [setRawValue, type]
    )

    return React.useMemo(
      () => ({
        input: {
          type,
          value: rawValue || '',
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
          error,
        },
      }),
      [props, onChange]
    )
  }
