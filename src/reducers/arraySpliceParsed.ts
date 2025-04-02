import z from 'zod'
import { FormState } from '../FormState'
import { ArraySpliceParsedAction, arraySplice } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { getInverseArrayElementSchema } from './util/getInverseArrayElementSchema'

export function arraySpliceParsedReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArraySpliceParsedAction
) {
  const { field, index, deleteCount, parsedValues } = action
  const inverseSchema = getInverseArrayElementSchema(field.schema)
  const values = parsedValues.map((v) => inverseSchema.parse(v))
  return reducer(state, arraySplice(field, index, deleteCount, values))
}
