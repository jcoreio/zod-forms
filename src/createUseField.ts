import z from 'zod'
import { FieldPath } from './FieldPath'
import { FieldMeta, FormState } from './FormState'
import { get } from './util/get'
import React from 'react'
import { setValue as _setValue } from './actions/setValue'
import { setRawValue as _setRawValue } from './actions/setRawValue'
import { setMeta as _setMeta } from './actions/setMeta'
import { FormAction } from './FormAction'
import { Dispatch } from 'redux'

export const createUseField = <T extends z.ZodTypeAny>({
  useFormSelector,
  useFormDispatch,
  useValidationErrorMap,
}: {
  useFormSelector: <V>(selector: (state: FormState<T>) => V) => V
  useFormDispatch: () => Dispatch<FormAction<T>>
  useValidationErrorMap: () => { [K in string]?: string }
}) =>
  function useField<Field extends FieldPath<T, any>>(field: Field) {
    type Schema = Field['schema']

    const dispatch = useFormDispatch()

    const rawValue: z.input<Schema> | undefined = useFormSelector((state) =>
      get(state.rawValues, field.path)
    ) as any
    let value: z.output<Schema> | undefined = useFormSelector((state) =>
      get(state.values, field.path)
    ) as any
    if (value == undefined) {
      const parsed = field.schema.safeParse(rawValue)
      if (parsed.success) value = parsed.data
    }
    const initialValue: z.output<Schema> | undefined = useFormSelector(
      (state) => get(state.initialValues, field.path)
    ) as any
    const rawInitialValue: z.input<Schema> | undefined = useFormSelector(
      (state) => get(state.rawInitialValues, field.path)
    ) as any

    const error = useValidationErrorMap()[field.pathstring]
    const meta = useFormSelector((state) => state.fieldMeta[field.pathstring])

    const setValue = React.useCallback(
      (value: z.output<Schema>) =>
        dispatch(_setValue<T, Field>({ field, value })),
      [field.pathstring]
    )
    const setRawValue = React.useCallback(
      (rawValue: z.input<Schema>) =>
        dispatch(_setRawValue<T, Field>({ field, rawValue })),
      [field.pathstring]
    )
    const setMeta = React.useCallback(
      (meta: Partial<FieldMeta>) =>
        dispatch(_setMeta<T, Field>({ field, meta })),
      [field.pathstring]
    )

    return {
      value,
      rawValue,
      initialValue,
      rawInitialValue,
      setValue,
      setRawValue,
      setMeta,
      error,
      dirty: !Object.is(value, initialValue),
      pristine: Object.is(value, initialValue),
      valid: !error,
      invalid: Boolean(error),
      ...meta,
    }
  }
