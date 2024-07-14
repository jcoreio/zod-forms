import z from 'zod'
import { FormState } from '../FormState'
import { ArraySwapAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arraySwapReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArraySwapAction
) {
  const { field, indexA, indexB } = action
  return updateRawArray(reducer, state, field, (array) =>
    array ? swap(array, indexA, indexB) : array
  )
}

export function swap<T>(array: T[], indexA: number, indexB: number) {
  if (indexA < 0 || indexA >= array.length)
    throw new Error(`indexA out of range`)
  if (indexB < 0 || indexB >= array.length)
    throw new Error(`indexB out of range`)

  const result = [...array]
  result[indexA] = array[indexB]
  result[indexB] = array[indexA]
  return result
}
