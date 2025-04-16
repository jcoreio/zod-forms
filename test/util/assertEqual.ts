type AssertEqual<T, U> =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2 ? true
  : false

export type isAny<T> = 0 extends 1 & T ? true : false
export const assertEqual = <A, B>(val: AssertEqual<A, B>) => val
