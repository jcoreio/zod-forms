export function get(
  from: unknown,
  path: (string | number | symbol)[]
): unknown {
  return path.reduce(
    (from: any, next) =>
      from instanceof Object && next in from ? from[next] : undefined,
    from
  )
}
