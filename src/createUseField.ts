import z from 'zod'
import { BasePath, FieldPath, SchemaAt } from './FieldPath'
import { FieldMeta, FormState } from './FormState'
import { get } from './util/get'
import React from 'react'
import { setValue as _setValue, SetValueAction } from './actions/setValue'
import {
  setRawValue as _setRawValue,
  SetRawValueAction,
} from './actions/setRawValue'
import { setMeta as _setMeta, SetMetaAction } from './actions/setMeta'
import { FormAction } from './FormAction'
import { Dispatch } from 'redux'

export type UseFieldProps<Field extends FieldPath> = FieldMeta & {
  value: z.output<Field['schema']> | undefined
  rawValue: z.input<Field['schema']> | undefined
  initialValue: z.output<Field['schema']> | undefined
  rawInitialValue: z.input<Field['schema']> | undefined
  setValue: (value: z.output<Field['schema']>) => SetValueAction<Field>
  setRawValue: (value: z.input<Field['schema']>) => SetRawValueAction<Field>
  setMeta: (meta: Partial<FieldMeta>) => SetMetaAction<Field>
  error?: string
  dirty: boolean
  pristine: boolean
  valid: boolean
  invalid: boolean
}

export interface UseField<T extends z.ZodTypeAny> {
  <Field extends FieldPath>(field: Field): UseFieldProps<Field>
  <Path extends BasePath>(...path: Path): UseFieldProps<
    FieldPath<SchemaAt<T, Path>>
  >
}

export const createUseField = <T extends z.ZodTypeAny>({
  root,
  useFormSelector,
  useFormDispatch,
  useValidationErrorMap,
}: {
  root: FieldPath<T>
  useFormSelector: <V>(selector: (state: FormState<T>) => V) => V
  useFormDispatch: () => Dispatch<FormAction<T>>
  useValidationErrorMap: () => { [K in string]?: string }
}): UseField<T> => {
  function useFieldBase<Field extends FieldPath>(
    field: Field
  ): UseFieldProps<Field> {
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
      (value: z.output<Schema>) => dispatch(_setValue<Field>({ field, value })),
      [field.pathstring]
    )
    const setRawValue = React.useCallback(
      (rawValue: z.input<Schema>) =>
        dispatch(_setRawValue<Field>({ field, rawValue })),
      [field.pathstring]
    )
    const setMeta = React.useCallback(
      (meta: Partial<FieldMeta>) => dispatch(_setMeta<Field>({ field, meta })),
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
  function useField<Field extends FieldPath>(field: Field): UseFieldProps<Field>
  function useField<Path extends BasePath>(
    ...field: Path
  ): UseFieldProps<FieldPath<SchemaAt<T, Path>>>
  function useField(...field: [FieldPath] | BasePath): UseFieldProps<any> {
    return useFieldBase(
      field[0] instanceof FieldPath ? field[0] : root.get(...(field as any))
    )
  }
  return useField
}
