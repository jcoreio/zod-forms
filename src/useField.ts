import z from 'zod'
import { BasePath, FieldPath } from './FieldPath'
import { FieldMeta } from './FormState'
import { get } from './util/get'
import React from 'react'
import { setValue as _setValue, SetValueAction } from './actions/setValue'
import {
  setRawValue as _setRawValue,
  SetRawValueAction,
} from './actions/setRawValue'
import { setMeta as _setMeta, SetMetaAction } from './actions/setMeta'
import { useFormDispatch } from './useFormDispatch'
import {
  useFormSelector as untypedUseFormSelector,
  TypedUseFormSelector,
} from './useFormSelector'
import { useFormContext } from './useFormContext'
import { useFormStatus } from './useFormStatus'
import { createSelector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { FormStatus } from './createSelectFormStatus'
import isEqual from 'fast-deep-equal'
import { PathInSchema, PathstringInSchema } from './util/PathInSchema'
import { parsePathstring } from './util/parsePathstring'
import { SchemaAt } from './util/SchemaAt'

export type UseFieldProps<Field extends FieldPath> = FieldMeta &
  FormStatus & {
    value: z.output<Field['schema']> | undefined
    rawValue: z.input<Field['schema']> | undefined
    initialValue: z.output<Field['schema']> | undefined
    rawInitialValue: z.input<Field['schema']> | undefined
    setValue: (
      value: z.output<Field['schema']>,
      options?: Omit<SetValueAction<Field>, 'type' | 'field' | 'value'>
    ) => SetValueAction<Field>
    setRawValue: (value: z.input<Field['schema']>) => SetRawValueAction<Field>
    setMeta: (meta: Partial<FieldMeta>) => SetMetaAction<Field>
    error?: string
    dirty: boolean
    pristine: boolean
    valid: boolean
    invalid: boolean
  }

export interface TypedUseField<T extends z.ZodTypeAny> {
  <Field extends FieldPath>(field: Field): UseFieldProps<Field>
  <Path extends PathInSchema<T>>(path: Path): UseFieldProps<
    FieldPath<SchemaAt<T, Path>>
  >
  <Pathstring extends PathstringInSchema<T>>(path: Pathstring): UseFieldProps<
    FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>
  >
}

function useFieldBase<T extends z.ZodTypeAny, Field extends FieldPath>(
  field: Field
): UseFieldProps<Field> {
  type Schema = Field['schema']

  const { selectFormValues, selectFieldErrorMap } = useFormContext<T>()
  const status = useFormStatus()

  const dispatch = useFormDispatch<T>()
  const useFormSelector = untypedUseFormSelector as TypedUseFormSelector<T>

  const valuesSelector = React.useMemo(
    () =>
      createSelector(
        [selectFormValues],
        ({ values, rawValues, initialValues, rawInitialValues }) => {
          const value = get(values, field.path) as z.output<Schema> | undefined
          const initialValue = get(initialValues, field.path) as
            | z.output<Schema>
            | undefined
          const dirty = !isEqual(value, initialValue)
          const pristine = !dirty
          return {
            value,
            rawValue: get(rawValues, field.path) as z.input<Schema> | undefined,
            initialValue,
            rawInitialValue: get(rawInitialValues, field.path) as
              | z.input<Schema>
              | undefined,
            dirty,
            pristine,
          }
        }
      ),
    [field.pathstring]
  )

  const values = useFormSelector(valuesSelector, shallowEqual)

  const error = useFormSelector(
    (state) => selectFieldErrorMap(state)[field.pathstring]
  )
  const meta = useFormSelector((state) => state.fieldMeta[field.pathstring])

  const setValue = React.useCallback(
    (
      value: z.output<Schema>,
      options?: Omit<SetValueAction<Field>, 'type' | 'field' | 'value'>
    ) => dispatch(_setValue<Field>(field, value, options)),
    [field.pathstring]
  )
  const setRawValue = React.useCallback(
    (rawValue: z.input<Schema>) =>
      dispatch(_setRawValue<Field>(field, rawValue)),
    [field.pathstring]
  )
  const setMeta = React.useCallback(
    (meta: Partial<FieldMeta>) => dispatch(_setMeta<Field>(field, meta)),
    [field.pathstring]
  )

  return React.useMemo(
    () => ({
      setValue,
      setRawValue,
      setMeta,
      error,
      ...values,
      ...status,
      valid: !error,
      invalid: Boolean(error),
      ...meta,
    }),
    [field.pathstring, values, status, meta, error]
  )
}

export function useField<Field extends FieldPath>(
  field: Field
): UseFieldProps<Field>
export function useField<T extends z.ZodTypeAny, Path extends PathInSchema<T>>(
  field: Path
): UseFieldProps<FieldPath<SchemaAt<T, Path>>>
export function useField<
  T extends z.ZodTypeAny,
  Pathstring extends PathstringInSchema<T>
>(
  field: Pathstring
): UseFieldProps<FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>>
export function useField<T extends z.ZodTypeAny>(
  field: FieldPath | BasePath | string
): UseFieldProps<any> {
  const { root } = useFormContext<T>()
  return useFieldBase(
    field instanceof FieldPath ? field : root.get(field as any)
  )
}
