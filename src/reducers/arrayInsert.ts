import z from 'zod'
import { FormState } from '../FormState'
import { arrayInsertRaw, ArrayInsertAction } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { getInverseArrayElementSchema } from './util/getInverseArrayElementSchema'

export function arrayInsertReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayInsertAction
) {
  const { field, index, value } = action
  const inverseSchema = getInverseArrayElementSchema(field.schema)
  return reducer(
    state,
    arrayInsertRaw(field, index, inverseSchema.parse(value))
  )
}
