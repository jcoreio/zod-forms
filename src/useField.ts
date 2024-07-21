import z from 'zod'
import { BasePath, FieldPath } from './FieldPath'
import { FieldMeta } from './FormState'
import { get } from './util/get'
import React from 'react'
import { setValue } from './actions/setValue'
import { setRawValue } from './actions/setRawValue'
import { setMeta } from './actions/setMeta'
import {
  useFormSelector as untypedUseFormSelector,
  TypedUseFormSelector,
} from './useFormSelector'
import { useFormContext } from './useFormContext'
import { createSelector, createStructuredSelector } from 'reselect'
import { shallowEqual } from 'react-redux'
import isEqual from 'fast-deep-equal'
import { PathInSchema, PathstringInSchema } from './util/PathInSchema'
import { parsePathstring } from './util/parsePathstring'
import { SchemaAt } from './util/SchemaAt'
import { maybeParse } from './util/maybeParse'
import { bindActionsToField } from './util/bindActionsToField'

export type UseFieldProps<Field extends FieldPath> = FieldMeta &
  ReturnType<
    typeof bindActionsToField<{
      setValue: typeof setValue
      setRawValue: typeof setRawValue
      setMeta: typeof setMeta
    }>
  > & {
    value: z.output<Field['schema']> | undefined
    rawValue: unknown
    initialValue: z.output<Field['schema']> | undefined
    rawInitialValue: unknown
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

  const {
    setValue,
    setRawValue,
    setMeta,
    selectFormValues,
    selectFieldErrorMap,
  } = useFormContext<T>()

  const useFormSelector = untypedUseFormSelector as TypedUseFormSelector<T>

  const valuesSelector = React.useMemo(
    () =>
      createSelector(
        [selectFormValues],
        createSelector(
          [
            createStructuredSelector({
              value: ({ values }) =>
                get(values, field.path) as z.output<Schema> | undefined,
              rawValue: ({ rawValues }) =>
                get(rawValues, field.path) as unknown,
              initialValue: ({ initialValues }) =>
                get(initialValues, field.path) as z.output<Schema> | undefined,
              rawInitialValue: ({ rawInitialValues }) =>
                get(rawInitialValues, field.path) as unknown,
            }),
          ],
          ({
            rawValue,
            value = maybeParse(field.schema, rawValue),
            rawInitialValue,
            initialValue = maybeParse(field.schema, rawInitialValue),
          }) => {
            const dirty = !isEqual(value, initialValue)
            const pristine = !dirty
            return {
              value,
              rawValue,
              initialValue,
              rawInitialValue,
              dirty,
              pristine,
            }
          }
        )
      ),
    [field.pathstring]
  )

  const values = useFormSelector(valuesSelector, shallowEqual)

  const error = useFormSelector(
    (state) => selectFieldErrorMap(state)[field.pathstring]
  )
  const meta = useFormSelector((state) => state.fieldMeta[field.pathstring])
  const submitFailed = useFormSelector((state) => state.submitFailed)

  const boundActions = React.useMemo(
    () => bindActionsToField({ setValue, setRawValue, setMeta }, field),
    [field.pathstring]
  )

  return React.useMemo(
    () => ({
      ...boundActions,
      ...values,
      visited: meta?.visited || false,
      touched: meta?.touched || submitFailed,
      error,
      valid: !error,
      invalid: Boolean(error),
    }),
    [field.pathstring, values, meta, error, submitFailed]
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
