export function setDelete<T>(set: Set<T>, elem: T) {
  if (!set.has(elem)) return set
  set = new Set(set)
  set.delete(elem)
  return set
}
