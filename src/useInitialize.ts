import z from 'zod'
import React, { DependencyList } from 'react'
import { useFormContext } from './useFormContext'
import { InitializeAction } from './actions/initialize'

export function useInitialize<T extends z.ZodTypeAny>(
  options: Omit<InitializeAction<T>, 'type'>,
  deps: DependencyList = [options.values, options.rawValues]
) {
  const { initialize } = useFormContext<T>()
  React.useEffect(() => {
    initialize(options)
  }, deps)
}
