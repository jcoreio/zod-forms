import z from 'zod'
import { FormState } from '../FormState'
import { ArrayShiftAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayShiftReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayShiftAction
) {
  const { field } = action
  return updateRawArray(reducer, state, field, (array) => array?.slice(1))
}
