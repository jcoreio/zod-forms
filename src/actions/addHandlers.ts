import z from 'zod'
import {
  SubmitFailedHandler,
  SubmitHandler,
  SubmitSuccededHandler,
} from '../FormState'

export type Handlers<T extends z.ZodTypeAny> = {
  onSubmit?: SubmitHandler<T>
  onSubmitSucceeded?: SubmitSuccededHandler
  onSubmitFailed?: SubmitFailedHandler
}

export type AddHandlersAction<T extends z.ZodTypeAny> = ReturnType<
  typeof addHandlers<T>
>

export function addHandlers<T extends z.ZodTypeAny>(handlers: Handlers<T>) {
  return {
    type: 'addHandlers',
    ...handlers,
  } as const
}
