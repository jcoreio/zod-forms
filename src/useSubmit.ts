import z from 'zod'
import { SetHandlersAction } from './actions/setHandlers'
import React from 'react'
import { useFormContext } from './useFormContext'

export function useSubmit<T extends z.ZodTypeAny>(
  handlers: Omit<SetHandlersAction<T>, 'type'>
) {
  const { setHandlers, submit } = useFormContext<T>()
  React.useEffect(() => {
    setHandlers(handlers)
  }, [handlers.onSubmit, handlers.onSubmitFailed, handlers.onSubmitSucceeded])
  return React.useCallback((e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    submit()
  }, [])
}
