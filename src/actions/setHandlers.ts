import z from 'zod'
import { FormState } from '../FormState'

export type SetHandlersAction<T extends z.ZodTypeAny> = ReturnType<
  typeof setHandlers<T>
>

export function setHandlers<T extends z.ZodTypeAny>(
  handlers: Pick<
    FormState<T>,
    'onSubmit' | 'onSubmitSucceeded' | 'onSubmitFailed'
  >
) {
  return {
    type: 'setHandlers',
    ...handlers,
  } as const
}
