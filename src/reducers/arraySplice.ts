import z from 'zod'
import { FormState } from '../FormState'
import { ArraySpliceAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arraySpliceReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArraySpliceAction
) {
  const { field, index, deleteCount, values } = action
  return updateRawArray(reducer, state, field, (array) =>
    splice(array ?? [], index, deleteCount, values)
  )
}

function splice<T>(
  array: T[],
  index: number,
  deleteCount: number,
  parsedValues: T[]
) {
  if (index < 0 || index > array.length) throw new Error(`index out of range`)
  if (!deleteCount && !parsedValues.length) return array
  const result = [...array]
  result.splice(index, deleteCount, ...parsedValues)
  return result
}
