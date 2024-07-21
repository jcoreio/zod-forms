import z from 'zod'
import { FormState } from '../FormState'
import { ArrayPushAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { setValue } from '../actions/setValue'
import { get } from '../util/get'

export function arrayPushReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayPushAction
) {
  const { field, value } = action
  const array = get(state.rawValues, field.path)
  return reducer(
    state,
    setValue(field.get([Array.isArray(array) ? array.length : 0]), value)
  )
}
