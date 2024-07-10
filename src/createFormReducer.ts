import { Reducer } from 'redux'
import z from 'zod'
import { FormAction } from './FormAction'
import { FormState } from './FormState'
import { initFormState } from './initFormState'
import { set } from './util/set'
import { invert } from 'zod-invertible'

export function createFormReducer<T extends z.ZodTypeAny>({
  schema,
  inverseSchema,
}: {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
}): Reducer<FormState<T>, FormAction<T>> {
  return (
    state: FormState<T> = initFormState(),
    action: FormAction<T>
  ): FormState<T> => {
    switch (action.type) {
      case 'setMounted':
        return { ...state, mounted: action.mounted }
      case 'setValue': {
        const newValues = set(state.values, action.field.path, action.value)
        try {
          const newRawValues = inverseSchema.parse(newValues)
          schema.parse(newRawValues)
          return {
            ...state,
            validationError: undefined,
            rawValues: newRawValues,
            values: newValues,
          }
        } catch (error) {
          const newRawParsed = invert(action.field.schema).safeParse(
            action.value
          )
          const rawValues = newRawParsed.success
            ? set(state.rawValues, action.field.path, newRawParsed.data)
            : state.rawValues
          const newParsed = schema.safeParse(rawValues)
          const result = {
            ...state,
            validationError: !newRawParsed.success
              ? newRawParsed.error
              : newParsed.success
              ? undefined
              : newParsed.error,
            rawValues,
            values: newParsed.success ? newParsed.data : state.values,
          }
          return result
        }
      }
      case 'setRawValue': {
        const newRawValues = set(
          state.rawValues,
          action.field.path,
          action.rawValue
        )
        if (newRawValues === state.rawValues) return state
        try {
          const newValues = schema.parse(newRawValues)
          return {
            ...state,
            validationError: undefined,
            rawValues: newRawValues,
            values: newValues,
          }
        } catch (error) {
          return {
            ...state,
            validationError: error,
            rawValues: newRawValues,
            values: undefined,
          }
        }
      }
      case 'setMeta': {
        const { field, meta } = action
        const oldMeta = state.fieldMeta[field.pathstring]
        if (
          Object.entries(meta).every(([key, value]) =>
            Object.is(value, (oldMeta as any)?.[key])
          )
        ) {
          return state
        }
        return {
          ...state,
          fieldMeta: {
            ...state.fieldMeta,
            [field.pathstring]: { ...oldMeta, ...meta },
          },
        }
      }
      case 'initialize': {
        const { keepSubmitSucceeded } = action
        try {
          const rawValues =
            action.rawValues ??
            (action.values ? inverseSchema.parse(action.values) : undefined)
          const values =
            action.values ??
            (action.rawValues ? schema.parse(action.rawValues) : undefined)
          return {
            ...state,
            validationError: undefined,
            initialized: true,
            submitting: false,
            submitFailed: false,
            submitSucceeded: keepSubmitSucceeded
              ? state.submitSucceeded
              : false,
            rawValues,
            values,
            rawInitialValues: rawValues,
            initialValues: values,
          }
        } catch (error) {
          return {
            ...state,
            validationError: error,
            initialized: true,
            submitting: false,
            submitFailed: false,
            submitSucceeded: keepSubmitSucceeded
              ? state.submitSucceeded
              : false,
            rawValues: action.rawValues,
            values: action.values,
            rawInitialValues: action.rawValues,
            initialValues: action.values,
          }
        }
      }
    }
    return state
  }
}
