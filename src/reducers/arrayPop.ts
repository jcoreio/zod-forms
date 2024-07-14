import z from 'zod'
import { FormState } from '../FormState'
import { ArrayPopAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayPopReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayPopAction
) {
  return updateRawArray(reducer, state, action.field, (array) =>
    array?.slice(0, array.length - 1)
  )
}
