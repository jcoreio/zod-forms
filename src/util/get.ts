export function get(
  from: unknown,
  path: (string | number | symbol)[]
): unknown {
  return path.reduce(
    (from: any, next) => (next in from ? from[next] : undefined),
    from
  )
}
