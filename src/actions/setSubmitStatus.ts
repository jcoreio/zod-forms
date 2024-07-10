import z from 'zod'
import { FormState } from '../FormState'

export type SetSubmitStatusAction<T extends z.ZodTypeAny> = ReturnType<
  typeof setSubmitStatus<T>
>

export function setSubmitStatus<T extends z.ZodTypeAny>(
  options: Partial<
    Pick<
      FormState<T>,
      | 'submitting'
      | 'submitError'
      | 'submitPromise'
      | 'submitSucceeded'
      | 'submitFailed'
    >
  >
) {
  return {
    type: 'setSubmitStatus',
    ...options,
  } as const
}
