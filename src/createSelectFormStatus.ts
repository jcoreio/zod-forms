import { createSelector, createStructuredSelector } from 'reselect'
import { FormState } from './FormState'
import isEqual from 'fast-deep-equal'
import z from 'zod'

export type SelectFormStatus = ReturnType<typeof createSelectFormStatus>
export type FormStatus = ReturnType<SelectFormStatus>

export function createSelectFormStatus() {
  let lastValidationError: FormState<any>['validationError'] = undefined

  function selectValidationError({ validationError }: FormState<any>) {
    if (
      validationError === lastValidationError ||
      (validationError instanceof z.ZodError &&
        lastValidationError instanceof z.ZodError &&
        isEqual(validationError.issues, lastValidationError.issues))
    ) {
      return lastValidationError
    }
    return (lastValidationError = validationError)
  }

  const selectPristine = createSelector(
    [
      createSelector(
        [
          (state: FormState<any>) => state.parsedValues,
          (state: FormState<any>) => state.initialParsedValues,
        ],
        isEqual
      ),
      createSelector(
        [
          (state: FormState<any>) => state.values,
          (state: FormState<any>) => state.initialValues,
        ],
        isEqual
      ),
      selectValidationError,
    ],
    (parsedPristine, pristine, validationError) =>
      validationError ? pristine : parsedPristine
  )

  return createStructuredSelector({
    initialized: (state: FormState<any>) => state.initialized,
    submitting: (state: FormState<any>) => state.submitting,
    submitSucceeded: (state: FormState<any>) => state.submitSucceeded,
    submitFailed: (state: FormState<any>) => state.submitFailed,
    submitError: (state: FormState<any>) => state.submitError,
    validationError: selectValidationError,
    valid: (state: FormState<any>) => selectValidationError(state) == null,
    invalid: (state: FormState<any>) => selectValidationError(state) != null,
    pristine: selectPristine,
    dirty: (state: FormState<any>) => !selectPristine(state),
  })
}
