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
            ? e.issues.map((issue) => [
                pathstring(issue.path),
                messageForIssue(issue),
              ])
            : []
        )
      )
  )
}

function isZodError(error: any): error is z.ZodError {
  return error && error.name === 'ZodError'
}

/**
 * Gets less confusing error messages for ordinary users for certain ZodIssues
 */
function messageForIssue(issue: z.ZodIssue): string {
  if (issue.code === 'invalid_type') {
    return issue.received === 'null' || issue.received === 'undefined'
      ? // Without this, the error would say "Expected <type>, received null"
        // or "Invalid number" as below
        'Required'
      : issue.expected === 'number' || issue.expected === 'bigint'
      ? // Without this, invalid text input for z.number() would say "Expected number, received string"
        'Invalid number'
      : issue.message
  }
  return issue.message
}
