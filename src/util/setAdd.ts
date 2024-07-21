export function setAdd<T>(set: Set<T>, elem: T) {
  if (set.has(elem)) return set
  set = new Set(set)
  set.add(elem)
  return set
}