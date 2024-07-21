import z from 'zod'
import { invert } from 'zod-invertible'
import { FieldPath } from './FieldPath'
import { createFormProvider } from './createFormProvider'
import { useField, TypedUseField } from './useField'
import { useHtmlField, TypedUseHtmlField } from './useHtmlField'
import { useFormContext } from './useFormContext'
import { useFormStatus } from './useFormStatus'
import { useFormValues } from './useFormValues'
import { useSubmit } from './useSubmit'
import { useInitialize } from './useInitialize'
import { useSubmitEventHandler } from './useSubmitEventHandler'
import { createSelectFormStatus } from './createSelectFormStatus'
import { createSelectFieldErrorMap } from './createSelectFieldErrorMap'
import { createSelectFormValues } from './createSelectFormValues'

export type ZodForm<T extends z.ZodTypeAny> = ReturnType<
  typeof createZodForm<T>
>

export function createZodForm<T extends z.ZodTypeAny>({
  schema,
}: {
  schema: T
}) {
  const root = FieldPath.root(schema)
  const inverseSchema = invert(schema)

  const selectFormStatus = createSelectFormStatus()
  const selectFieldErrorMap = createSelectFieldErrorMap()
  const selectFormValues = createSelectFormValues<T>()

  const FormProvider = createFormProvider({
    root,
    schema,
    inverseSchema,
    selectFormStatus,
    selectFieldErrorMap,
    selectFormValues,
  })

  const get: (typeof root)['get'] = root.get.bind(root)

  return {
    root,
    get,
    FormProvider,
    useFormContext: useFormContext<T>,
    useFormStatus,
    useFormValues: useFormValues<T>,
    useInitialize: useInitialize<T>,
    useSubmit: useSubmit<T>,
    useSubmitEventHandler,
    useField: useField as TypedUseField<T>,
    useHtmlField: useHtmlField as TypedUseHtmlField<T>,
  }
}
