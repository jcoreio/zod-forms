import z from 'zod'
import { BasePath, FieldPath, FieldPathForRawValue } from './FieldPath'
import React from 'react'
import { useFormContext } from './useFormContext'
import { PathInSchema, PathstringInSchema } from './util/PathInSchema'
import { parsePathstring } from './util/parsePathstring'
import { SchemaAt } from './util/SchemaAt'
import { bindActionsToField } from './util/bindActionsToField'
import { arrayActions } from './actions/arrayActions'
import { createSelector, createStructuredSelector } from 'reselect'
import { get } from './util/get'
import isEqual from 'fast-deep-equal'
import {
  TypedUseFormSelector,
  useFormSelector as untypedUseFormSelector,
} from './useFormSelector'
import { shallowEqual } from 'react-redux'
import { setValue } from './actions/setValue'
import { setRawValue } from './actions/setRawValue'
import { setMeta } from './actions/setMeta'
import { FieldMeta } from './FormState'

export type UseArrayFieldProps<Field extends FieldPath> = NonNullable<
  z.input<Field['schema']>
> extends any[]
  ? FieldMeta &
      ReturnType<
        typeof bindActionsToField<
          typeof arrayActions & {
            setValue: typeof setValue
            setRawValue: typeof setRawValue
            setMeta: typeof setMeta
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
  <Field extends FieldPathForRawValue<any[] | null | undefined>>(
    field: Field
  ): UseArrayFieldProps<Field>
  <Path extends PathInSchema<T>>(path: Path): UseArrayFieldProps<
    FieldPath<SchemaAt<T, Path>>
  >
  <Pathstring extends PathstringInSchema<T>>(
    path: Pathstring
  ): UseArrayFieldProps<FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>>
}

function useArrayFieldBase<Field extends FieldPath>(
  field: Field
): UseArrayFieldProps<Field> {
  type Schema = Field['schema']

  const {
    arrayActions,
    setValue,
    setRawValue,
    setMeta,
    selectFormValues,
    selectFieldErrorMap,
  } = useFormContext()

  const useFormSelector = untypedUseFormSelector as TypedUseFormSelector<Schema>

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
            }),
          ],
          ({ rawValue, value, initialValue }) => {
            const dirty = !isEqual(value, initialValue)
            const pristine = !dirty
            return {
              dirty,
              pristine,
              length: Array.isArray(rawValue) ? rawValue.length : 0,
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

  const boundActions = React.useMemo(
    () =>
      bindActionsToField(
        { ...arrayActions, setValue, setRawValue, setMeta },
        field
      ),
    [field.pathstring]
  )
  const elements = React.useMemo(
    () => [...new Array(length).keys()].map((index) => field.subfield(index)),
    [length]
  )

  return React.useMemo(
    () => ({
      ...meta,
      ...boundActions,
      elements,
      dirty,
      pristine,
      valid: !error,
      invalid: Boolean(error),
    }),
    [dirty, boundActions, elements, meta, error]
  ) as any
}

export function useArrayField<Field extends FieldPath>(
  field: Field
): UseArrayFieldProps<Field>
export function useArrayField<
  T extends z.ZodTypeAny,
  Path extends PathInSchema<T>
>(field: Path): UseArrayFieldProps<FieldPath<SchemaAt<T, Path>>>
export function useArrayField<
  T extends z.ZodTypeAny,
  Pathstring extends PathstringInSchema<T>
>(
  field: Pathstring
): UseArrayFieldProps<FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>>
export function useArrayField<T extends z.ZodTypeAny>(
  field: FieldPath | BasePath | string
): UseArrayFieldProps<any> {
  const { root } = useFormContext<T>()
  return useArrayFieldBase(
    field instanceof FieldPath ? field : root.get(field as any)
  )
}
