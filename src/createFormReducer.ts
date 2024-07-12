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
      case 'addHandlers': {
        const { onSubmit, onSubmitSucceeded, onSubmitFailed } = action
        return {
          ...state,
          ...(onSubmit && { onSubmit: setAdd(state.onSubmit, onSubmit) }),
          ...(onSubmitSucceeded && {
            onSubmitSucceeded: setAdd(
              state.onSubmitSucceeded,
              onSubmitSucceeded
            ),
          }),
          ...(onSubmitFailed && {
            onSubmitFailed: setAdd(state.onSubmitFailed, onSubmitFailed),
          }),
        }
      }
      case 'removeHandlers': {
        const { onSubmit, onSubmitSucceeded, onSubmitFailed } = action
        return {
          ...state,
          ...(onSubmit && { onSubmit: setDelete(state.onSubmit, onSubmit) }),
          ...(onSubmitSucceeded && {
            onSubmitSucceeded: setDelete(
              state.onSubmitSucceeded,
              onSubmitSucceeded
            ),
          }),
          ...(onSubmitFailed && {
            onSubmitFailed: setDelete(state.onSubmitFailed, onSubmitFailed),
          }),
        }
      }

      case 'setSubmitStatus': {
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          type,
          ...status
        } = action
        return { ...state, ...status }
      }
      case 'submitSucceeded': {
        return {
          ...state,
          submitting: false,
          submitSucceeded: true,
          submitFailed: false,
          submitError: undefined,
          submitPromise: undefined,
          initialValues: state.submittedValues,
          rawInitialValues: state.rawSubmittedValues,
        }
      }
      case 'setValue': {
        const newValues = set(state.values, action.field.path, action.value)
        try {
          const newRawValues = inverseSchema.parse(newValues)
          schema.parse(newRawValues)
          return {
            ...state,
            submitError: undefined,
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
            submitError: undefined,
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
            submitError: undefined,
            validationError: undefined,
            rawValues: newRawValues,
            values: newValues,
          }
        } catch (error) {
          return {
            ...state,
            submitError: undefined,
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

function setAdd<T>(set: Set<T>, elem: T) {
  if (set.has(elem)) return set
  set = new Set(set)
  set.add(elem)
  return set
}

function setDelete<T>(set: Set<T>, elem: T) {
  if (!set.has(elem)) return set
  set = new Set(set)
  set.delete(elem)
  return set
}
