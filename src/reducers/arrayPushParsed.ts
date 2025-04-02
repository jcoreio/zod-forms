import z from 'zod'
import { FormState } from '../FormState'
import { ArrayPushParsedAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { setParsedValue } from '../actions/setParsedValue'
import { get } from '../util/get'

export function arrayPushParsedReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayPushParsedAction
) {
  const { field, parsedValue } = action
  const array = get(state.values, field.path)
  return reducer(
    state,
    setParsedValue(
      field.get([Array.isArray(array) ? array.length : 0]),
      parsedValue
    )
  )
}
