import z from 'zod'
import { FormState } from '../FormState'
import { ArrayUnshiftParsedAction, arrayUnshift } from '../actions/arrayActions'
import { Reducer } from 'redux'
import { FormAction } from '../FormAction'
import { getInverseArrayElementSchema } from './util/getInverseArrayElementSchema'

export function arrayUnshiftParsedReducer<T extends z.ZodTypeAny>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  action: ArrayUnshiftParsedAction
) {
  const { field, parsedValue } = action
  const inverseSchema = getInverseArrayElementSchema(field.schema)
  return reducer(state, arrayUnshift(field, inverseSchema.parse(parsedValue)))
}
