import z from 'zod'
import memoizeOne from 'memoize-one'
import { FormState } from './FormState'
import { pathstring } from './util/pathstring'

export function createUseValidationErrorMap<T extends z.ZodTypeAny>({
  useFormSelector,
}: {
  useFormSelector: <V>(selector: (state: FormState<T>) => V) => V
}) {
  const selectValidationErrorMap = memoizeOne(
    (
      validationError: FormState<T>['validationError']
    ): { [K in string]?: string } => {
      if (!isZodError(validationError)) return {}
      return Object.fromEntries(
        validationError.issues.map(({ path, message }) => [
          pathstring(path),
          message,
        ])
      )
    }
  )

  return function useValidationErrorMap() {
    return useFormSelector((state) =>
      selectValidationErrorMap(state.validationError)
    )
  }
}

function isZodError(error: any): error is z.ZodError {
  return error && error.name === 'ZodError'
}
