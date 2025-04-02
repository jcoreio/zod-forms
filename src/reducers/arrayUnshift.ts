import z from 'zod'
import { FormState } from '../FormState'
import { ArrayUnshiftAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayUnshiftReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayUnshiftAction
) {
  const { field, value } = action
  return updateRawArray(reducer, state, field, (array) => [
    value,
    ...(array ?? []),
  ])
}
