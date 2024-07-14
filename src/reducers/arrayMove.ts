import z from 'zod'
import { FormState } from '../FormState'
import { ArrayMoveAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayMoveReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayMoveAction
) {
  const { field, from, to } = action
  if (from === to) return state
  return updateRawArray(reducer, state, field, (array) =>
    array ? move(array, from, to) : array
  )
}

export function move<T>(array: T[], from: number, to: number): T[] {
  if (from < 0 || from >= array.length) throw new Error(`from out of range`)
  if (to < 0 || to >= array.length) throw new Error(`to out of range`)
  return from < to
    ? [
        ...array.slice(0, from),
        ...array.slice(from + 1, to),
        array[from],
        ...array.slice(to + 1),
      ]
    : [
        ...array.slice(0, to),
        array[from],
        ...array.slice(to + 1, from),
        ...array.slice(from + 1),
      ]
}
