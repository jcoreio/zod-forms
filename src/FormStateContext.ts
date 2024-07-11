import z from 'zod'
import React from 'react'
import { ReactReduxContextValue } from 'react-redux'
import { FormState } from './FormState'
import { FormAction } from './FormAction'

export const FormStateContext = React.createContext<ReactReduxContextValue<
  FormState<z.ZodTypeAny>,
  FormAction<z.ZodTypeAny>
> | null>(null)

export type FormStateContext<T extends z.ZodTypeAny> =
  React.Context<ReactReduxContextValue<FormState<T>, FormAction<T>> | null>
