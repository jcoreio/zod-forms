import React from 'react'
import z from 'zod'
import { invert } from 'zod-invertible'
import { FormContextProps } from './FormContextProps'
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

export type ZodForm<T extends z.ZodTypeAny> = ReturnType<
  typeof createZodForm<T>
>

export function createZodForm<T extends z.ZodTypeAny>({
  schema,
}: {
  schema: T
}) {
  const inverseSchema = invert(schema)

  const FormContext = React.createContext<FormContextProps<T> | null>(null)
  const FormReactReduxContext = React.createContext<ReactReduxContextValue<
    FormState<T>,
    FormAction<T>
  > | null>(null)

  const useFormSelector = createSelectorHook(FormReactReduxContext)
  const useFormDispatch = createDispatchHook(FormReactReduxContext)

  const useValidationErrorMap = createUseValidationErrorMap({ useFormSelector })

  function useFormContext(): FormContextProps<T> {
    const props = React.useContext(FormContext)
    if (!props) {
      throw new Error(`must be used inside a <FormProvider>`)
    }
    return props
  }

  const FormProvider = createFormProvider({
    schema,
    inverseSchema,
    FormContext,
    FormReactReduxContext,
  })

  const root = FieldPath.root(schema)

  const useField = createUseField({
    root,
    useFormSelector,
    useFormDispatch,
    useValidationErrorMap,
  })
  const useHtmlField = createUseHtmlField({ root, useField })

  const get: (typeof root)['get'] = (key: any) => root.get(key)

  return {
    FormProvider,
    useFormContext,
    root,
    get,
    useField,
    useHtmlField,
  }
}
