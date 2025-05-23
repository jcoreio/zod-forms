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
import { invert } from 'zod-invertible'
import { SelectFormValues } from './createSelectFormValues'

export type UseFieldProps<Field extends FieldPath> = FieldMeta &
  ReturnType<
    typeof bindActionsToField<
      Field,
      {
        setParsedValue: typeof setParsedValue<Field>
        setValue: typeof setValue<Field>
        setMeta: typeof setMeta<Field>
      }
    >
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
  <Path extends PathInSchema<T>>(
    path: Path
  ): UseFieldProps<FieldPath<SchemaAt<T, Path>>>
  <Pathstring extends PathstringInSchema<T>>(
    path: Pathstring
  ): UseFieldProps<FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>>
}

export type UseFieldOptions = {
  normalizeOnMount?: boolean
}

function useFieldBase<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  T extends z.ZodTypeAny,
  Field extends FieldPath,
>(
  field: Field,
  { normalizeOnMount = true }: UseFieldOptions = {}
): UseFieldProps<Field> {
  type Schema = Field['schema']

  const {
    setParsedValue,
    setValue,
    setMeta,
    selectFormValues,
    selectFieldErrorMap,
  } = useFormContext<T>()

  type FormValues = ReturnType<SelectFormValues<T>>

  const useFormSelector = untypedUseFormSelector as TypedUseFormSelector<T>

  const valuesSelector = React.useMemo(
    () =>
      createSelector(
        [selectFormValues],
        createSelector(
          [
            createStructuredSelector({
              parsedValue: createSelector(
                (state: FormValues) => state.parsedValues,
                (parsedValues) =>
                  get(parsedValues, field.path) as z.output<Schema> | undefined
              ),
              value: createSelector(
                (state: FormValues) => state.values,
                (values) =>
                  get(values, field.path) as
                    | DeepPartial<z.input<Schema>>
                    | undefined
              ),
              initialParsedValue: createSelector(
                (state: FormValues) => state.initialParsedValues,
                (initialParsedValues) =>
                  get(initialParsedValues, field.path) as
                    | z.output<Schema>
                    | undefined
              ),
              initialValue: createSelector(
                (state: FormValues) => state.initialValues,
                (initialValues) =>
                  get(initialValues, field.path) as
                    | DeepPartial<z.input<Schema>>
                    | undefined
              ),
            }),
          ],
          ({
            value,
            parsedValue = maybeParse<Schema>(field.schema, value),
            initialValue,
            initialParsedValue = maybeParse<Schema>(field.schema, initialValue),
          }) => {
            // console.error(new Error('selector'), { value, parsedValue })
            const dirty = !isEqual(parsedValue, initialParsedValue)
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
  const initialized = useFormSelector((state) => state.initialized)

  const boundActions = React.useMemo(
    () => bindActionsToField({ setParsedValue, setValue, setMeta }, field),
    [field.pathstring]
  )

  const info = React.useRef({ mounted: false, initialized })

  let normalizedValue = parsedValues.value
  if (
    normalizeOnMount &&
    (!info.current.mounted || (!info.current.initialized && initialized))
  ) {
    const parsed = field.schema.safeParse(parsedValues.value)
    const formatted =
      parsed.success ? invert(field.schema).safeParse(parsed.data) : undefined
    if (formatted?.success && formatted.data !== parsedValues.value) {
      normalizedValue = formatted.data
    }
  }
  info.current.mounted = true
  info.current.initialized = initialized

  React.useEffect(() => {
    if (normalizeOnMount && !isEqual(normalizedValue, parsedValues.value)) {
      boundActions.setValue(normalizedValue)
    }
  }, [])

  return React.useMemo(
    () => ({
      ...boundActions,
      ...parsedValues,
      value: normalizedValue,
      visited: meta?.visited || false,
      touched: meta?.touched || submitFailed,
      customMeta: meta?.customMeta,
      error,
      valid: !error,
      invalid: Boolean(error),
    }),
    [field.pathstring, parsedValues, meta, error, submitFailed]
  ) as any
}

export function useField<Field extends FieldPath>(
  field: Field,
  options?: UseFieldOptions
): UseFieldProps<Field>
export function useField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseArray<T> to pass a path array'
  >,
  Path extends PathInSchema<T> = any,
>(
  field: Path,
  options?: UseFieldOptions
): UseFieldProps<FieldPath<SchemaAt<T, Path>>>
export function useField<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'cast to TypedUseArray<T> to pass a pathstring'
  >,
  Pathstring extends PathstringInSchema<T> = any,
>(
  field: Pathstring,

  options?: UseFieldOptions
): UseFieldProps<FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>>
export function useField<T extends z.ZodTypeAny>(
  field: FieldPath | BasePath | string,
  options?: UseFieldOptions
): UseFieldProps<any> | { ERROR: string } {
  const { root } = useFormContext<T>()
  return useFieldBase(
    field instanceof FieldPath ? field : root.get(field as any),
    options
  )
}
