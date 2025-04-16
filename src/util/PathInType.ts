import { BasePath } from '../FieldPath'
import { pathstring } from './pathstring'

export type PathInType<T> = [] | SubPathInType<T>

type SubPathInType<T> =
  0 extends 1 & T ? BasePath
  : T extends (
    | string
    | number
    | boolean
    | bigint
    | symbol
    | null
    | undefined
    | void
    | ((...args: any[]) => any)
  ) ?
    []
  : T extends readonly any[] ?
    { [K in keyof T & number]-?: [K, ...PathInType<T[K]>] }[keyof T & number]
  : {
      [K in keyof T]-?: K extends symbol ? never : [K, ...PathInType<T[K]>]
    }[keyof T]

export type PathstringInType<T> = pathstring<PathInType<T>>
