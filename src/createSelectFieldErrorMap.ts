import z from 'zod'
import { pathstring } from './util/pathstring'
import { createSelector } from 'reselect'
import { FormState } from './FormState'

export type SelectFieldErrorMap = ReturnType<typeof createSelectFieldErrorMap>

export function createSelectFieldErrorMap() {
  return createSelector(
    [
      (state: FormState<any>) => state.validationError,
      (state: FormState<any>) => state.submitError,
    ],
    (...errors: any[]): { [K in string]?: string } =>
      Object.fromEntries(
        errors.flatMap((e) =>
          isZodError(e)
            ? e.issues.map(({ path, message }) => [pathstring(path), message])
            : []
        )
      )
  )
}

function isZodError(error: any): error is z.ZodError {
  return error && error.name === 'ZodError'
}
