import z from 'zod'
import React, { DependencyList } from 'react'
import { useFormContext } from './useFormContext'
import { InitializeAction } from './actions/initialize'

export function useInitialize<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'you must pass a schema type'
  >,
>(
  options: Omit<InitializeAction<T>, 'type'>,
  deps: DependencyList = [options.parsedValues, options.values]
) {
  const { initialize } = useFormContext<T>()
  React.useEffect(() => {
    initialize(options)
  }, deps)
}
