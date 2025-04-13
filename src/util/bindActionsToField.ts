import { FieldPath } from '../FieldPath'

export function bindActionsToField<
  Field extends FieldPath,
  Actions extends {
    [K in string]: (field: Field, ...rest: any[]) => any
  }
>(
  actions: Actions,
  field: Field
): {
  [K in keyof Actions]: Actions[K] extends (
    field: Field,
    ...rest: infer Rest
  ) => infer Return
    ? (...rest: Rest) => Return
    : never
} {
  return Object.fromEntries(
    Object.entries(actions).map(([key, action]: any) => [
      key,
      (...args: any[]) => action(field, ...args),
    ])
  ) as any
}
