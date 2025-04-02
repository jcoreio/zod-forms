import z from 'zod'
import { createStructuredSelector } from 'reselect'
import { FormState } from './FormState'

export type SelectFormValues<T extends z.ZodTypeAny> = ReturnType<
  typeof createSelectFormValues<T>
>

export function createSelectFormValues<T extends z.ZodTypeAny>() {
  return createStructuredSelector({
    parsedValues: (state: FormState<T>) => state.parsedValues,
    values: (state: FormState<T>) => state.values,
    initialParsedValues: (state: FormState<T>) => state.initialParsedValues,
    initialValues: (state: FormState<T>) => state.initialValues,
  })
}
