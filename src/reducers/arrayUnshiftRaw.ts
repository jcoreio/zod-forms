import z from 'zod'
import { FormState } from '../FormState'
import { ArrayUnshiftRawAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayUnshiftRawReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayUnshiftRawAction
) {
  const { field, rawValue } = action
  return updateRawArray(reducer, state, field, (array) => [
    rawValue,
    ...(array ?? []),
  ])
}
