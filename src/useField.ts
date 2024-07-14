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
import { arrayActions } from './actions/arrayActions'
import { acceptsArray } from './util/acceptsArray'

type BaseUseFieldProps<Field extends FieldPath> = FieldMeta &
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

export type InternalUseFieldProps<Field extends FieldPath> =
  BaseUseFieldProps<Field> & {
    [K in keyof typeof arrayActions]?: (typeof arrayActions)[K] extends (
      field: FieldPath,
      ...rest: infer Rest
    ) => infer Return
      ? (...rest: Rest) => Return
      : never
  }

export type UseFieldProps<Field extends FieldPath> = BaseUseFieldProps<Field> &
  (NonNullable<z.input<Field['schema']>> extends any[]
    ? ReturnType<typeof bindActionsToField<typeof arrayActions>>
    : unknown)

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

  const { selectFormValues, selectFieldErrorMap, arrayActions } =
    useFormContext<T>()
  const status = useFormStatus()

  const boundArrayActions = React.useMemo(
    () =>
      acceptsArray(field.schema)
        ? bindActionsToField(arrayActions, field)
        : undefined,
    [field.pathstring]
  )

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
    (): InternalUseFieldProps<Field> => ({
      setValue,
      setRawValue,
      setMeta,
      error,
      ...boundArrayActions,
      ...values,
      ...status,
      ...meta,
      valid: !error,
      invalid: Boolean(error),
    }),
    [field.pathstring, values, status, meta, error, boundArrayActions]
  ) as any
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

function bindActionsToField<
  Actions extends { [K in string]: (field: FieldPath, ...rest: any[]) => any }
>(
  actions: Actions,
  field: FieldPath
): {
  [K in keyof Actions]: Actions[K] extends (
    field: FieldPath,
    ...rest: infer Rest
  ) => infer Return
    ? (...rest: Rest) => Return
    : never
} {
  return Object.fromEntries(
    Object.entries(actions).map(([key, action]: any) => [
      key,
      (...args: any[]) => action(field, ...args),
    ])
  ) as any
}
