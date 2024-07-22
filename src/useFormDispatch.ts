import { createDispatchHook } from 'react-redux'
import { FormStateContext } from './FormStateContext'
import z from 'zod'
import { FormAction } from './FormAction'
import { Dispatch } from 'redux'

export const useFormDispatch = createDispatchHook(
  FormStateContext
) as typeof useFormDispatchType

declare function useFormDispatchType<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'you must pass a schema type'
  >
>(): Dispatch<FormAction<T>>
