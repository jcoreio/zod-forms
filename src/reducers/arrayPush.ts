import z from 'zod'
import { FormState } from '../FormState'
import { ArrayPushAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayPushReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayPushAction
) {
  const { field, value } = action
  return updateRawArray(reducer, state, field, (array) => [
    ...(array ?? []),
    value,
  ])
}
