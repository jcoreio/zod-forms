import z from 'zod'
import { FormState } from '../FormState'
import { SetMetaAction } from '../actions/setMeta'
import { FieldPath } from '../FieldPath'

export function setMetaReducer<T extends z.ZodTypeAny>(
  state: FormState<T>,
  action: SetMetaAction<FieldPath>
) {
  const { field, meta } = action
  const oldMeta = state.fieldMeta[field.pathstring]
  if (
    Object.entries(meta).every(([key, value]) =>
      Object.is(value, (oldMeta as any)?.[key])
    )
  ) {
    return state
  }
  return {
    ...state,
    fieldMeta: {
      ...state.fieldMeta,
      [field.pathstring]: { ...oldMeta, ...meta },
    },
  }
}
