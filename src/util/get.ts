export function get(
  from: unknown,
  path: (string | number | symbol)[]
): unknown {
  return path.reduce(
    (from: any, next) =>
      from instanceof Object && Object.prototype.hasOwnProperty.call(from, next) ? from[next] : undefined,
    from
  )
}
