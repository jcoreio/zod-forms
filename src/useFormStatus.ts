import z from 'zod'
import {
  useFormSelector as untypedUseFormSelector,
  TypedUseFormSelector,
} from './useFormSelector'
import { useFormContext } from './useFormContext'

const useFormSelector =
  untypedUseFormSelector as TypedUseFormSelector<z.ZodTypeAny>

export function useFormStatus() {
  const { selectFormStatus } = useFormContext()
  return useFormSelector(selectFormStatus)
}
