export function isPromise<U>(value: any): value is Promise<U> {
  return (
    value != null &&
    typeof value === 'object' &&
    typeof value.then === 'function'
  )
}
