import z from 'zod'
import { FormState } from '../FormState'
import { ArrayPushRawAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayPushRawReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayPushRawAction
) {
  const { field, rawValue } = action
  return updateRawArray(reducer, state, field, (array) => [
    ...(array ?? []),
    rawValue,
  ])
}
