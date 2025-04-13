import z from 'zod'
import { BasePath, FieldPath } from './FieldPath'
import { FieldMeta } from './FormState'
import { get } from './util/get'
import React from 'react'
import { setParsedValue } from './actions/setParsedValue'
import { setValue } from './actions/setValue'
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
import { DeepPartial } from './util/DeepPartial'

export type UseFieldProps<Field extends FieldPath> = FieldMeta &
  ReturnType<
    typeof bindActionsToField<{
      setParsedValue: typeof setParsedValue
      setValue: typeof setValue
      setMeta: typeof setMeta
    }>
  > & {
    parsedValue?: z.output<Field['schema']>
    value?: DeepPartial<z.input<Field['schema']>>
    initialParsedValue?: z.output<Field['schema']>
    initialValue?: DeepPartial<z.input<Field['schema']>>
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
    setParsedValue,
    setValue,
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
              parsedValue: ({ parsedValues }) =>
                get(parsedValues, field.path) as z.output<Schema> | undefined,
              value: ({ values }) => get(values, field.path) as unknown,
              initialParsedValue: ({ initialParsedValues }) =>
                get(initialParsedValues, field.path) as
                  | z.output<Schema>
                  | undefined,
              initialValue: ({ initialValues }) =>
                get(initialValues, field.path) as unknown,
            }),
          ],
          ({
            value,
            parsedValue = maybeParse(field.schema, value),
            initialValue,
            initialParsedValue = maybeParse(field.schema, initialValue),
          }) => {
            const dirty = !isEqual(value, initialValue)
            const pristine = !dirty
            return {
              parsedValue,
              value,
              initialParsedValue,
              initialValue,
              dirty,
              pristine,
            }
          }
        )
      ),
    [field.pathstring]
  )

  const parsedValues = useFormSelector(valuesSelector, shallowEqual)

  const error = useFormSelector(
    (state) => selectFieldErrorMap(state)[field.pathstring]
  )
  const meta = useFormSelector((state) => state.fieldMeta[field.pathstring])
  const submitFailed = useFormSelector((state) => state.submitFailed)

  const boundActions = React.useMemo(
    () => bindActionsToField({ setParsedValue, setValue, setMeta }, field),
    [field.pathstring]
  )

  return React.useMemo(
    () => ({
      ...boundActions,
      ...parsedValues,
      visited: meta?.visited || false,
      touched: meta?.touched || submitFailed,
      error,
      valid: !error,
      invalid: Boolean(error),
    }),
    [field.pathstring, parsedValues, meta, error, submitFailed]
  ) as any
}

export function useField<Field extends FieldPath>(
  field: Field
): UseFieldProps<Field>
export function useField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseArray<T> to pass a path array'
  >,
  Path extends PathInSchema<T> = any
>(field: Path): UseFieldProps<FieldPath<SchemaAt<T, Path>>>
export function useField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseArray<T> to pass a pathstring'
  >,
  Pathstring extends PathstringInSchema<T> = any
>(
  field: Pathstring
): UseFieldProps<FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>>
export function useField<T extends z.ZodTypeAny>(
  field: FieldPath | BasePath | string
): UseFieldProps<any> | { ERROR: string } {
  const { root } = useFormContext<T>()
  return useFieldBase(
    field instanceof FieldPath ? field : root.get(field as any)
  )
}
