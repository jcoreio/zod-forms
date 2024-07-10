import z from 'zod'
import { BasePath, FieldPath, SchemaAt } from './FieldPath'
import React, { HTMLInputTypeAttribute } from 'react'
import { setValue as _setValue } from './actions/setValue'
import { setRawValue as _setRawValue } from './actions/setRawValue'
import { createUseField } from './createUseField'

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

    const onFocus = React.useCallback((e: React.FocusEvent) => {
      // TODO
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
