import z from 'zod'
import { FormState } from '../FormState'
import { ArrayUnshiftAction, arrayUnshiftRaw } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { getInverseArrayElementSchema } from './util/getInverseArrayElementSchema'

export function arrayUnshiftReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayUnshiftAction
) {
  const { field, value } = action
  const inverseSchema = getInverseArrayElementSchema(field.schema)
  return reducer(state, arrayUnshiftRaw(field, inverseSchema.parse(value)))
}
