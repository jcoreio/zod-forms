import z from 'zod'
import { FormState } from '../FormState'

export type Handlers<T extends z.ZodTypeAny> = Pick<
  FormState<T>,
  'onSubmit' | 'onSubmitSucceeded' | 'onSubmitFailed'
>

export type SetHandlersAction<T extends z.ZodTypeAny> = ReturnType<
  typeof setHandlers<T>
>

export function setHandlers<T extends z.ZodTypeAny>(handlers: Handlers<T>) {
  return {
    type: 'setHandlers',
    ...handlers,
  } as const
}
