import React from 'react'
import { FormContextProps } from './FormContextProps'
import z from 'zod'

export const FormContext =
  React.createContext<FormContextProps<z.ZodTypeAny> | null>(null)
