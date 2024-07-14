import z from 'zod'
import { FormState } from '../FormState'
import { ArraySpliceAction, arraySpliceRaw } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { getInverseArrayElementSchema } from './util/getInverseArrayElementSchema'

export function arraySpliceReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArraySpliceAction
) {
  const { field, index, deleteCount, values } = action
  const inverseSchema = getInverseArrayElementSchema(field.schema)
  const rawValues = values.map((v) => inverseSchema.parse(v))
  return reducer(state, arraySpliceRaw(field, index, deleteCount, rawValues))
}
