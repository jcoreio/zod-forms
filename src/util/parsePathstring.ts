import { BasePath } from '../FieldPath'

export type parsePathstring<
  Path extends string,
  IsTail = false
> = Path extends ''
  ? []
  : Path extends `[${infer Rest}`
  ? Rest extends `${infer N extends number}]${infer Tail}`
    ? [N, ...parsePathstring<Tail, true>]
    : ExtractInitialStringLiteral<Rest> extends infer StringLiteral extends string
    ? [
        ProcessStringLiteral<StringLiteral>,
        ...(Rest extends `${StringLiteral}]${infer Tail}`
          ? parsePathstring<Tail, true>
          : never)
      ]
    : never
  : IsTail extends true
  ? Path extends `.${infer Rest}`
    ? parsePathstring<Rest>
    : never
  : Path extends `${infer Head}[${infer Tail}`
  ? Path extends `${infer Head2}.${infer Tail2}`
    ? Head2 extends `${Head}[${string}` // make sure we pick up to . or [, whichever comes first
      ? [Head, ...parsePathstring<`[${Tail}`, true>]
      : [Head2, ...parsePathstring<`.${Tail2}`, true>]
    : [Head, ...parsePathstring<`[${Tail}`, true>]
  : Path extends `${infer Head}.${infer Tail}`
  ? [Head, ...parsePathstring<`.${Tail}`, true>]
  : [Path]

/**
 * If T starts with a quoted string literal, returns that string literal.
 * Otherwise returns never
 */
type ExtractInitialStringLiteral<T extends string> = T extends `"${infer Rest}`
  ? `"${RestOfStringLiteral<Rest, '"'>}`
  : T extends `'${infer Rest}`
  ? `'${RestOfStringLiteral<Rest, "'">}`
  : never

type RestOfStringLiteral<
  /**
   * A substring right after an opening quote
   */
  T extends string,
  /**
   * The opening quote type
   */
  Q extends '"' | "'"
> = T extends `${infer A}${Q}${infer B}` // find the next quote
  ? A extends `${infer C}\\${infer D}` // the quote may be escaped, so find the first backslash
    ? D extends '' // nothing after the backslash, so it escapes the quote Q
      ? `${A}${Q}${RestOfStringLiteral<B, Q>}` // keep scanning until the closing quote
      : D extends `${infer E extends keyof EscapeChars}${infer F}`
      ? `${C}\\${E}${RestOfStringLiteral<`${F}${Q}${B}`, Q>}` // keep scanning until the closing quote
      : never
    : `${A}${Q}` // no backslash, Q is a closing quote and we're done!
  : never

type EscapeChars = {
  '\\': '\\'
  n: '\n'
  t: '\t'
  r: '\r'
  f: '\f'
  '"': '"'
  "'": "'"
}

type ProcessEscapes<T extends string> = T extends `${infer A}\\${infer B}`
  ? B extends `${infer C extends keyof EscapeChars}${infer D}`
    ? `${A}${EscapeChars[C]}${ProcessEscapes<D>}`
    : never
  : T

type ProcessStringLiteral<T extends string> = T extends `"${infer Content}"`
  ? ProcessEscapes<Content>
  : T extends `'${infer Content}'`
  ? ProcessEscapes<Content>
  : never

/**
 * Just duplicate the behavior of the TS types exactly until if/when I can
 * find a way to parse string escapes correctly in TS
 */
export function parsePathstring(pathstring: string): BasePath {
  let match
  if (
    (match =
      /^\["(.*?)"\]([.[].*)?$/.exec(pathstring) ||
      /^\['(.*?)'\]([.[].*)?$/.exec(pathstring))
  ) {
    return [match[1], ...parsePathstringTail(match[2])]
  }
  if (
    (match = /^\[([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)\]([.[].*)?$/.exec(
      pathstring
    ))
  ) {
    return [Number(match[1]), ...parsePathstringTail(match[2])]
  }
  if ((match = /^(.*?)\[(.*)$/.exec(pathstring))) {
    return [
      ...parsePathstring(match[1]),
      ...parsePathstringTail(`[${match[2]}`),
    ]
  }

  if ((match = /^(.*?)\.(.*)$/.exec(pathstring))) {
    return [
      ...parsePathstring(match[1]),
      ...parsePathstringTail(`.${match[2]}`),
    ]
  }
  return [
    /^([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)$/.test(pathstring)
      ? Number(pathstring)
      : pathstring,
  ]
}

function parsePathstringTail(pathstring: string): BasePath {
  if (!pathstring) return []

  let match
  if (
    (match =
      /^\["(.*?)"\]([.[].*)?$/.exec(pathstring) ||
      /^\['(.*?)'\]([.[].*)?$/.exec(pathstring))
  ) {
    return [match[1], ...parsePathstringTail(match[2])]
  }
  if (
    (match = /^\[([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)\]([.[].*)?$/.exec(
      pathstring
    ))
  ) {
    return [Number(match[1]), ...parsePathstringTail(match[2])]
  }
  if ((match = /^\.(.*?)\[(.*)$/.exec(pathstring))) {
    return [
      ...parsePathstring(match[1]),
      ...parsePathstringTail(`[${match[2]}`),
    ]
  }

  if ((match = /^\.(.*?)\.(.*)$/.exec(pathstring))) {
    return [
      ...parsePathstring(match[1]),
      ...parsePathstringTail(`.${match[2]}`),
    ]
  }
  if ((match = /^\.(.*)$/.exec(pathstring))) {
    return [
      /^([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)$/.test(match[1])
        ? Number(match[1])
        : match[1],
    ]
  }
  return [
    /^([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)$/.test(pathstring)
      ? Number(pathstring)
      : pathstring,
  ]
}
