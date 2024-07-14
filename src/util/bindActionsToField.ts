import { FieldPath } from '../FieldPath'

export function bindActionsToField<
  Actions extends { [K in string]: (field: FieldPath, ...rest: any[]) => any }
>(
  actions: Actions,
  field: FieldPath
): {
  [K in keyof Actions]: Actions[K] extends (
    field: FieldPath,
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
