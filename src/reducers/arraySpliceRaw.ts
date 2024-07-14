import z from 'zod'
import { FormState } from '../FormState'
import { ArraySpliceRawAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arraySpliceRawReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArraySpliceRawAction
) {
  const { field, index, deleteCount, rawValues } = action
  return updateRawArray(reducer, state, field, (array) =>
    splice(array ?? [], index, deleteCount, rawValues)
  )
}

function splice<T>(
  array: T[],
  index: number,
  deleteCount: number,
  values: T[]
) {
  if (index < 0 || index > array.length) throw new Error(`index out of range`)
  if (!deleteCount && !values.length) return array
  const result = [...array]
  result.splice(index, deleteCount, ...values)
  return result
}
