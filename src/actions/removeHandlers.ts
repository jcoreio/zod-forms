import z from 'zod'
import { Handlers } from './addHandlers'

export type RemoveHandlersAction<T extends z.ZodTypeAny> = ReturnType<
  typeof removeHandlers<T>
>

export function removeHandlers<T extends z.ZodTypeAny>(handlers: Handlers<T>) {
  return {
    type: 'removeHandlers',
    ...handlers,
  } as const
}
