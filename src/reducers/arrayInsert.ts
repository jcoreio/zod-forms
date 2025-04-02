import z from 'zod'
import { FormState } from '../FormState'
import { ArrayInsertAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayInsertReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayInsertAction
) {
  const { field, index, value } = action
  return updateRawArray(reducer, state, field, (array) =>
    insert(array ?? [], index, value)
  )
}

function insert<T>(array: T[], index: number, parsedValue: T) {
  if (index < 0 || index > array.length) throw new Error(`index out of range`)
  return [...array.slice(0, index), parsedValue, ...array.slice(index)]
}
