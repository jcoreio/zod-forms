import z from 'zod'
import React from 'react'
import { useFormContext } from './useFormContext'
import { InitializeAction } from './actions/initialize'

export function useInitialize<T extends z.ZodTypeAny>(
  options: Omit<InitializeAction<T>, 'type'>
) {
  const { initialize } = useFormContext<T>()
  React.useEffect(() => {
    initialize(options)
  }, [options.values, options.rawValues])
}
