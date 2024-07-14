import z from 'zod'
import { Reducer } from 'react'
import { FieldPath, FieldPathForRawValue } from '../../FieldPath'
import { FormState } from '../../FormState'
import { FormAction } from '../../FormAction'
import { get } from '../../util/get'
import { setRawValue } from '../../actions/setRawValue'

export function updateRawArray<
  T extends z.ZodTypeAny,
  Field extends FieldPathForRawValue<any[]>
>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  field: FieldPath,
  updater: (
    array: z.input<Field['schema']> | undefined
  ) => z.input<Field['schema']> | undefined
) {
  const oldValue = get(state.rawValues, field.path)
  const newValue = updater(oldValue as any)
  return newValue === oldValue
    ? state
    : reducer(state, setRawValue(field, newValue))
}
