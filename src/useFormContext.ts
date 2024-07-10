import z from 'zod'
import React from 'react'
import { FormContextProps } from './FormContextProps'
import { FormContext } from './FormContext'

export function useFormContext<T extends z.ZodTypeAny>(): FormContextProps<T> {
  const props: FormContextProps<T> = React.useContext(FormContext) as any
  if (!props) {
    throw new Error(`must be used inside a <FormProvider>`)
  }
  return props
}
