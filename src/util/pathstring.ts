type PathElem = string | number
type BasePath = PathElem[]

export type pathstring<Path> =
  Path extends [infer Head extends PathElem, ...infer Tail extends PathElem[]] ?
    `${Head extends number ? `[${Head}]` : Head}${pathstringTail<Tail>}`
  : ''

type pathstringTail<Path extends BasePath> =
  Path extends [infer Head extends PathElem, ...infer Tail extends PathElem[]] ?
    `${Head extends number ? `[${Head}]` : `.${Head}`}${pathstringTail<Tail>}`
  : ''

export function pathstring<Path extends BasePath>(
  path: Path
): pathstring<Path> {
  return path
    .map((elem, index) =>
      typeof elem === 'string' && isValidIdentifier(elem) ?
        `${index > 0 ? '.' : ''}${elem}`
      : `[${JSON.stringify(elem)}]`
    )
    .join('') as any
}

function isValidIdentifier(s: string): boolean {
  return /^[_$a-z][_$a-z0-9]*$/i.test(s)
}
