type BasePath = (string | number | symbol)[]

export function pathstring(path: BasePath): string {
  return path
    .map((elem, index) =>
      typeof elem === 'string' && isValidIdentifier(elem)
        ? `${index > 0 ? '.' : ''}${elem}`
        : `[${JSON.stringify(elem)}]`
    )
    .join('')
}

function isValidIdentifier(s: string): boolean {
  return /^[_$a-z][_$a-z0-9]$/i.test(s)
}
