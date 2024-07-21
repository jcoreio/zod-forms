import z from 'zod'
import { BasePath, FieldPath, FieldPathForRawValue } from './FieldPath'
import React from 'react'
import { useFormContext } from './useFormContext'
import { PathInSchema, PathstringInSchema } from './util/PathInSchema'
import { parsePathstring } from './util/parsePathstring'
import { SchemaAt } from './util/SchemaAt'
import { UseFieldProps } from './useField'
import { bindActionsToField } from './util/bindActionsToField'
import { arrayActions } from './actions/arrayActions'
import { useField } from './useField'

export type UseArrayFieldProps<Field extends FieldPath> = NonNullable<
  z.input<Field['schema']>
> extends any[]
  ? UseFieldProps<Field> &
      ReturnType<typeof bindActionsToField<typeof arrayActions>> & {
        elements: FieldPath<SchemaAt<Field['schema'], [number]>>[]
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
  const { arrayActions } = useFormContext()
  const useFieldProps = useField(field)
  const boundArrayActions = React.useMemo(
    () => bindActionsToField(arrayActions, field),
    [field.pathstring]
  )
  const elements = React.useMemo(() => {
    const length =
      useFieldProps.value?.length ??
      (Array.isArray(useFieldProps.rawValue)
        ? useFieldProps.rawValue.length
        : 0)
    return [...new Array(length).keys()].map((index) => field.subfield(index))
  }, [useFieldProps.value, useFieldProps.rawValue])

  return React.useMemo(
    () => ({ ...useFieldProps, ...boundArrayActions, elements }),
    [useFieldProps, boundArrayActions, elements]
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
