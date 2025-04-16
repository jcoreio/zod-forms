import z from 'zod'
import React from 'react'
import { FormContext, FormContextProps } from './FormContext'

export function useFormContext<
  T extends z.ZodTypeAny = z.ZodBranded<
    z.ZodNever,
    'you must pass a schema type'
  >,
>(): FormContextProps<T> {
  const props: FormContextProps<T> | null = React.useContext(FormContext) as any
  if (!props) {
    throw new Error(`must be used inside a <FormProvider>`)
  }
  return props
}
