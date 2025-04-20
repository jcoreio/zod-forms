import z from 'zod'
import { BasePath, FieldPath, FieldPathForValue } from './FieldPath'
import React from 'react'
import { useFormContext } from './useFormContext'
import { PathInSchema, PathstringInSchema } from './util/PathInSchema'
import { parsePathstring } from './util/parsePathstring'
import { SchemaAt } from './util/SchemaAt'
import { bindActionsToField } from './util/bindActionsToField'
import { arrayActions, ArrayFieldPath } from './actions/arrayActions'
import { createSelector, createStructuredSelector } from 'reselect'
import { get } from './util/get'
import isEqual from 'fast-deep-equal'
import {
  TypedUseFormSelector,
  useFormSelector as untypedUseFormSelector,
} from './useFormSelector'
import { shallowEqual } from 'react-redux'
import { setParsedValue } from './actions/setParsedValue'
import { setValue } from './actions/setValue'
import { setMeta } from './actions/setMeta'
import { FieldMeta } from './FormState'
import { DeepPartial } from './util/DeepPartial'
import { maybeParse } from './util/maybeParse'

export type UseArrayFieldProps<Field extends FieldPath> =
  NonNullable<z.input<Field['schema']>> extends any[] ?
    FieldMeta &
      ReturnType<
        typeof bindActionsToField<
          Field,
          arrayActions<Field> & {
            setParsedValue: typeof setParsedValue<Field>
            setValue: typeof setValue<Field>
            setMeta: typeof setMeta<Field>
          }
        >
      > & {
        elements: FieldPath<SchemaAt<Field['schema'], [number]>>[]
        error?: string
        dirty: boolean
        pristine: boolean
        valid: boolean
        invalid: boolean
      }
  : { ERROR: 'not an array field' }

export interface TypedUseArrayField<T extends z.ZodTypeAny> {
  <Field extends FieldPathForValue<any[] | null | undefined>>(
    field: Field
  ): UseArrayFieldProps<Field>
  <Path extends PathInSchema<T>>(
    path: Path
  ): UseArrayFieldProps<FieldPath<SchemaAt<T, Path>>>
  <Pathstring extends PathstringInSchema<T>>(
    path: Pathstring
  ): UseArrayFieldProps<FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>>
}

function useArrayFieldBase<Field extends ArrayFieldPath>(
  field: Field
): UseArrayFieldProps<Field> {
  type T = Field['schema']

  const {
    arrayActions,
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
                get(parsedValues, field.path) as z.output<T> | undefined,
              value: ({ values }) =>
                get(values, field.path) as DeepPartial<z.input<T>> | undefined,
              initialParsedValue: ({ initialParsedValues }) =>
                get(initialParsedValues, field.path) as z.output<T> | undefined,
              initialValue: ({ initialValues }) =>
                get(initialValues, field.path) as
                  | DeepPartial<z.input<T>>
                  | undefined,
            }),
          ],
          ({
            value,
            parsedValue = maybeParse(field.schema, value),
            initialValue,
            initialParsedValue = maybeParse(field.schema, initialValue),
          }) => {
            const dirty = !isEqual(parsedValue, initialParsedValue)
            const pristine = !dirty
            return {
              dirty,
              pristine,
              length: Array.isArray(value) ? value.length : 0,
            }
          }
        )
      ),
    [field.pathstring]
  )

  const { dirty, pristine, length } = useFormSelector(
    valuesSelector,
    shallowEqual
  )

  const error = useFormSelector(
    (state) => selectFieldErrorMap(state)[field.pathstring]
  )
  const meta = useFormSelector((state) => state.fieldMeta[field.pathstring])
  const submitFailed = useFormSelector((state) => state.submitFailed)

  const boundActions = React.useMemo(
    () =>
      bindActionsToField(
        { ...arrayActions, setParsedValue, setValue, setMeta },
        field
      ),
    [field.pathstring]
  )
  const elements = React.useMemo(
    () =>
      [...new Array(length).keys()].map((index) =>
        field.subfield(
          // @ts-expect-error doesn't work on this type parameter
          index
        )
      ),
    [length]
  )

  return React.useMemo(
    () => ({
      ...boundActions,
      visited: meta?.visited || false,
      touched: meta?.touched || submitFailed,
      customMeta: meta?.customMeta,
      error,
      elements,
      dirty,
      pristine,
      valid: !error,
      invalid: Boolean(error),
    }),
    [dirty, boundActions, elements, meta, submitFailed, error]
  ) as any
}

export function useArrayField<Field extends FieldPath>(
  field: Field
): UseArrayFieldProps<Field>
export function useArrayField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseArrayField<T> to pass a path array'
  >,
  Path extends PathInSchema<T> = any,
>(field: Path): UseArrayFieldProps<FieldPath<SchemaAt<T, Path>>>
export function useArrayField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseArrayField<T> to pass a pathstring'
  >,
  Pathstring extends PathstringInSchema<T> = any,
>(
  field: Pathstring
): UseArrayFieldProps<FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>>
export function useArrayField<T extends z.ZodTypeAny>(
  field: FieldPath | BasePath | string
): UseArrayFieldProps<any> | { ERROR: string } {
  const { root } = useFormContext<T>()
  return useArrayFieldBase(
    field instanceof FieldPath ? field : root.get(field as any)
  )
}
