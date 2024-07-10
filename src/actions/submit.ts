export type SubmitAction = ReturnType<typeof submit>

export function submit() {
  return {
    type: 'submit',
  } as const
}
