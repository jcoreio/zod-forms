import z from 'zod'
import { Reducer } from 'react'
import { FieldPath, FieldPathForValue } from '../../FieldPath'
import { FormState } from '../../FormState'
import { FormAction } from '../../FormAction'
import { get } from '../../util/get'
import { setValue } from '../../actions/setValue'

export function updateRawArray<
  T extends z.ZodTypeAny,
  Field extends FieldPathForValue<any[]>,
>(
  reducer: Reducer<FormState<T>, FormAction<T>>,
  state: FormState<T>,
  field: FieldPath,
  updater: (
    array: z.input<Field['schema']> | undefined
  ) => z.input<Field['schema']> | undefined
) {
  const oldValue = get(state.values, field.path)
  const newValue = updater(oldValue as any)
  return newValue === oldValue ? state : (
      reducer(state, setValue(field, newValue))
    )
}
