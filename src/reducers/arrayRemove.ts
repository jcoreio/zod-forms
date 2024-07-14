import z from 'zod'
import { FormState } from '../FormState'
import { ArrayRemoveAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayRemoveReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayRemoveAction
) {
  const { field, index } = action
  return updateRawArray(reducer, state, field, (array) =>
    array ? remove(array, index) : array
  )
}

function remove<T>(array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) return array
  return [...array.slice(0, index), ...array.slice(index + 1)]
}
