import { BasePath } from '../FieldPath'

export type parsePathstring<Path extends string, IsTail = false> =
  [Path] extends [''] ? []
  : [Path] extends [`[${infer Rest}`] ?
    Rest extends `${infer N extends number}]${infer Tail}` ?
      [N, ...parsePathstring<Tail, true>]
    : ExtractInitialStringLiteral<Rest> extends (
      infer StringLiteral extends string
    ) ?
      [
        ProcessStringLiteral<StringLiteral>,
        ...(Rest extends `${StringLiteral}]${infer Tail}` ?
          parsePathstring<Tail, true>
        : never),
      ]
    : never
  : [IsTail] extends [true] ?
    [Path] extends [`.${infer Rest}`] ?
      parsePathstring<Rest>
    : never
  : [Path] extends [`${infer Head}[${infer Tail}`] ?
    [Path] extends [`${infer Head2}.${infer Tail2}`] ?
      Head2 extends (
        `${Head}[${string}` // make sure we pick up to . or [, whichever comes first
      ) ?
        [Head, ...parsePathstring<`[${Tail}`, true>]
      : [Head2, ...parsePathstring<`.${Tail2}`, true>]
    : [Head, ...parsePathstring<`[${Tail}`, true>]
  : [Path] extends [`${infer Head}.${infer Tail}`] ?
    [Head, ...parsePathstring<`.${Tail}`, true>]
  : [Path]

/**
 * If T starts with a quoted string literal, returns that string literal.
 * Otherwise returns never
 */
type ExtractInitialStringLiteral<T extends string> =
  [T] extends [`"${infer Rest}`] ? `"${RestOfStringLiteral<Rest, '"'>}`
  : [T] extends [`'${infer Rest}`] ? `'${RestOfStringLiteral<Rest, "'">}`
  : never

type RestOfStringLiteral<
  /**
   * A substring right after an opening quote
   */
  T extends string,
  /**
   * The opening quote type
   */
  Q extends '"' | "'",
> =
  [T] extends (
    [`${infer A}${Q}${infer B}`] // find the next quote
  ) ?
    A extends (
      `${infer C}\\${infer D}` // the quote may be escaped, so find the first backslash
    ) ?
      D extends (
        '' // nothing after the backslash, so it escapes the quote Q
      ) ?
        `${A}${Q}${RestOfStringLiteral<B, Q>}` // keep scanning until the closing quote
      : D extends `${infer E extends keyof EscapeChars}${infer F}` ?
        `${C}\\${E}${RestOfStringLiteral<`${F}${Q}${B}`, Q>}` // keep scanning until the closing quote
      : never
    : `${A}${Q}` // no backslash, Q is a closing quote and we're done!
  : never

type EscapeChars = typeof EscapeChars
const EscapeChars = {
  "'": "'",
  '"': '"',
  '\\': '\\',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
  v: '\v',
} as const

type ProcessEscapes<T extends string> =
  T extends `${infer A}\\${infer B}` ?
    B extends `${infer C extends keyof EscapeChars}${infer D}` ?
      `${A}${EscapeChars[C]}${ProcessEscapes<D>}`
    : never
  : T

type ProcessStringLiteral<T extends string> =
  T extends `"${infer Content}"` ? ProcessEscapes<Content>
  : T extends `'${infer Content}'` ? ProcessEscapes<Content>
  : never

const pathstringRx =
  /((?:^|\.)([^.[\]]+))|\[((\d+)|("(?:[^\\"]|\\['"\\bfnrtv])+"|'(?:[^\\']|\\['"\\bfnrtv])+'))\]/g

export function parsePathstring(pathstring: string): BasePath {
  const path: BasePath = []
  let lastIndex = 0
  for (const match of pathstring.matchAll(pathstringRx)) {
    if (
      match.index !== lastIndex ||
      (match.index === 0 && match[0][0] === '.')
    ) {
      throw new Error(`invalid pathstring: ${pathstring} (at ${match.index})`)
    }
    lastIndex = match.index + match[0].length
    if (match[2]) path.push(match[2])
    else if (match[4]) path.push(parseInt(match[4]))
    else if (match[5]) {
      path.push(
        match[5]
          .substring(1, match[5].length - 1)
          .replace(
            /\\['"\\bfnrtv]/g,
            (m) => EscapeChars[m[1] as keyof EscapeChars]
          )
      )
    }
  }
  if (lastIndex !== pathstring.length) {
    throw new Error(`invalid pathstring: ${pathstring} (at ${lastIndex})`)
  }
  return path
}
