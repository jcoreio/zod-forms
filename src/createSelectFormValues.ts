import z from 'zod'
import { createStructuredSelector } from 'reselect'
import { FormState } from './FormState'

export type SelectFormValues<T extends z.ZodTypeAny> = ReturnType<
  typeof createSelectFormValues<T>
>

export function createSelectFormValues<T extends z.ZodTypeAny>() {
  return createStructuredSelector({
    values: (state: FormState<T>) => state.values,
    rawValues: (state: FormState<T>) => state.rawValues,
    initialValues: (state: FormState<T>) => state.initialValues,
    rawInitialValues: (state: FormState<T>) => state.rawInitialValues,
  })
}
