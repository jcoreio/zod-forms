import z from 'zod'
import { FormState } from '../FormState'
import { SetSubmitStatusAction } from '../actions/setSubmitStatus'

export function setSubmitStatusReducer<T extends z.ZodTypeAny>(
  state: FormState<T>,
  action: SetSubmitStatusAction<T>
) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type,
    ...status
  } = action
  return { ...state, ...status }
}
