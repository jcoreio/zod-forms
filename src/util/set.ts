export function set(
  from: unknown,
  path: (string | number | symbol)[],
  value: unknown,
  index = 0
): unknown {
  if (index === path.length) return value
  if (from instanceof Map) {
    const oldValue = from.get(path[index])
    const newValue = set(oldValue, path, value, index + 1)
    if (Object.is(oldValue, newValue)) return from
    const result = new Map(from)
    result.set(path[index], newValue)
    return result
  }
  if (from instanceof Object) {
    const oldValue = (from as any)[path[index]]
    const newValue = set(oldValue, path, value, index + 1)
    if (Object.is(oldValue, newValue)) return from
    const result: any =
      Array.isArray(from) ?
        [...from]
      : Object.assign(Object.create(Object.getPrototypeOf(from)), from)
    result[path[index]] = newValue
    return result
  }
  return set(typeof path[index] === 'number' ? [] : {}, path, value, index)
}
