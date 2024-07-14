import z from 'zod'
import { BasePath } from '../FieldPath'
import { pathstring } from './pathstring'

export type PathInSchema<T extends z.ZodTypeAny> = [] | SubPathInSchema<T>

type SubPathInSchema<T extends z.ZodTypeAny> = 0 extends 1 & T
  ? BasePath
  : 0 extends 1 & z.output<T>
  ? BasePath
  : T extends z.ZodLazy<infer U>
  ? SubPathInSchema<U>
  : T extends z.ZodCatch<infer U>
  ? SubPathInSchema<U>
  : T extends z.ZodBranded<infer U, any>
  ? SubPathInSchema<U>
  : T extends z.ZodOptional<infer U>
  ? SubPathInSchema<U>
  : T extends z.ZodDefault<infer U>
  ? SubPathInSchema<U>
  : T extends z.ZodNullable<infer U>
  ? SubPathInSchema<U>
  : T extends z.ZodUnion<infer Options>
  ? SubPathInSchema<Options[number]>
  : T extends z.ZodDiscriminatedUnion<any, infer Options>
  ? SubPathInSchema<Options[number]>
  : T extends z.ZodPipeline<any, infer Out>
  ? SubPathInSchema<Out>
  : T extends z.ZodEffects<infer U>
  ? SubPathInSchema<U>
  : T extends z.ZodReadonly<infer U>
  ? SubPathInSchema<U>
  : T extends z.ZodRecord<infer Key, infer Value>
  ? [Key, ...PathInSchema<Value>]
  : T extends z.ZodMap<infer Key, infer Value>
  ? [Key, ...PathInSchema<Value>]
  : T extends z.ZodObject<
      infer Shape,
      infer UnknownKeys,
      infer Catchall extends z.ZodTypeAny
    >
  ? UnknownKeys extends 'passthrough'
    ?
        | { [K in keyof Shape]: [K, ...PathInSchema<Shape[K]>] }[keyof Shape]
        | [string | number, ...PathInSchema<Catchall>]
    : { [K in keyof Shape]: [K, ...PathInSchema<Shape[K]>] }[keyof Shape]
  : T extends z.ZodTuple<
      infer Elements extends [z.ZodTypeAny, ...z.ZodTypeAny[]],
      infer Rest
    >
  ? Rest extends z.ZodTypeAny
    ?
        | {
            [K in keyof Elements]: [K, ...PathInSchema<Elements[K]>]
          }[keyof Elements]
        | [number, ...PathInSchema<Rest>]
    : {
        [K in keyof Elements]: [K, ...PathInSchema<Elements[K]>]
      }[keyof Elements]
  : T extends z.ZodArray<infer Element>
  ? [number, ...PathInSchema<Element>]
  : []

export type PathstringInSchema<T extends z.ZodTypeAny> = pathstring<
  PathInSchema<T>
>
