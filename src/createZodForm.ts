import React from 'react'
import z from 'zod'
import { invert } from 'zod-invertible'
import { FieldPath } from './FieldPath'
import {
  createDispatchHook,
  createSelectorHook,
  ReactReduxContextValue,
} from 'react-redux'
import { FormAction } from './FormAction'
import { FormState } from './FormState'
import { createFormProvider } from './createFormProvider'
import { createUseValidationErrorMap } from './createUseValidationErrorMap'
import { createUseField } from './createUseField'
import { createUseHtmlField } from './createUseHtmlField'
import { useFormContext } from './useFormContext'

export type ZodForm<T extends z.ZodTypeAny> = ReturnType<
  typeof createZodForm<T>
>

export function createZodForm<T extends z.ZodTypeAny>({
  schema,
}: {
  schema: T
}) {
  const inverseSchema = invert(schema)

  const FormReactReduxContext = React.createContext<ReactReduxContextValue<
    FormState<T>,
    FormAction<T>
  > | null>(null)

  const useFormSelector = createSelectorHook(FormReactReduxContext)
  const useFormDispatch = createDispatchHook(FormReactReduxContext)

  const useValidationErrorMap = createUseValidationErrorMap({ useFormSelector })

  const root = FieldPath.root(schema)

  const useField = createUseField({
    root,
    useFormSelector,
    useFormDispatch,
    useValidationErrorMap,
  })
  const useHtmlField = createUseHtmlField({ root, useField })

  const FormProvider = createFormProvider({
    schema,
    inverseSchema,
    FormReactReduxContext,
    useField,
    useHtmlField,
  })

  const get: (typeof root)['get'] = (key: any) => root.get(key)

  return {
    FormProvider,
    useFormContext: useFormContext<T>,
    root,
    get,
    useField,
    useHtmlField,
  }
}
