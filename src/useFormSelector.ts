import { createSelectorHook, TypedUseSelectorHook } from 'react-redux'
import { FormStateContext } from './FormStateContext'
import { FormState } from './FormState'
import z from 'zod'

export const useFormSelector = createSelectorHook(FormStateContext)
export type TypedUseFormSelector<T extends z.ZodTypeAny> = TypedUseSelectorHook<
  FormState<T>
>
