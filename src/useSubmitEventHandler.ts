import React from 'react'
import { useFormContext } from './useFormContext'

export function useSubmitEventHandler(): React.FormEventHandler {
  const { submit } = useFormContext()
  return React.useCallback((e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    submit()
  }, [])
}
