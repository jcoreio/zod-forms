export type SubmitSucceededAction = ReturnType<typeof submitSucceeded>

export function submitSucceeded() {
  return {
    type: 'submitSucceeded',
  } as const
}
