import z from 'zod'
import { Handlers } from './actions/addHandlers'
import React from 'react'
import { useFormContext } from './useFormContext'
import { useSubmitEventHandler } from './useSubmitEventHandler'

export function useSubmit<T extends z.ZodTypeAny>(handlers: Handlers<T>) {
  const handlersRef = React.useRef<Handlers<T>>(handlers)
  handlersRef.current = handlers
  const { addHandlers, removeHandlers } = useFormContext<T>()
  React.useEffect(() => {
    const handlers: Handlers<T> = {
      onSubmit: (...args) => handlersRef.current.onSubmit?.(...args),
      onSubmitSucceeded: (...args) =>
        handlersRef.current.onSubmitSucceeded?.(...args),
      onSubmitFailed: (...args) =>
        handlersRef.current.onSubmitFailed?.(...args),
    }
    addHandlers(handlers)
    return () => {
      removeHandlers(handlers)
    }
  }, [])
  return useSubmitEventHandler()
}
