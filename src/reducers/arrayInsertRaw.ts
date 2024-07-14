import z from 'zod'
import { FormState } from '../FormState'
import { ArrayInsertRawAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { updateRawArray } from './util/updateRawArray'

export function arrayInsertRawReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayInsertRawAction
) {
  const { field, index, rawValue } = action
  return updateRawArray(reducer, state, field, (array) =>
    insert(array ?? [], index, rawValue)
  )
}

function insert<T>(array: T[], index: number, value: T) {
  if (index < 0 || index > array.length) throw new Error(`index out of range`)
  return [...array.slice(0, index), value, ...array.slice(index)]
}
