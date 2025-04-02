import z from 'zod'
import { FormState } from '../FormState'
import { arrayInsert, ArrayInsertParsedAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { getInverseArrayElementSchema } from './util/getInverseArrayElementSchema'

export function arrayInsertParsedReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayInsertParsedAction
) {
  const { field, index, parsedValue } = action
  const inverseSchema = getInverseArrayElementSchema(field.schema)
  return reducer(
    state,
    arrayInsert(field, index, inverseSchema.parse(parsedValue))
  )
}
