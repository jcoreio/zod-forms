import z from 'zod'
import { useFormSelector, TypedUseFormSelector } from './useFormSelector'
import { useFormContext } from './useFormContext'

export function useFormValues<T extends z.ZodTypeAny = z.ZodUnknown>() {
  const { selectFormValues } = useFormContext<T>()
  return (useFormSelector as TypedUseFormSelector<T>)(selectFormValues)
}
