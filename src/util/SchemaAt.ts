import z from 'zod'

type BasePath = (string | number)[]

export type SchemaAt<T extends z.ZodTypeAny, Path> = 0 extends 1 & Path
  ? z.ZodTypeAny
  : 0 extends 1 & T
  ? z.ZodTypeAny
  : 0 extends 1 & z.input<T>
  ? z.ZodTypeAny
  : Path extends [infer Head, ...infer Tail extends BasePath]
  ? T extends z.ZodLazy<infer U>
    ? SchemaAt<U, Path>
    : T extends z.ZodCatch<infer U>
    ? SchemaAt<U, Path>
    : T extends z.ZodBranded<infer U, any>
    ? SchemaAt<U, Path>
    : T extends z.ZodOptional<infer U>
    ? SchemaAt<U, Path>
    : T extends z.ZodDefault<infer U>
    ? SchemaAt<U, Path>
    : T extends z.ZodNullable<infer U>
    ? SchemaAt<U, Path>
    : T extends z.ZodUnion<infer Options>
    ? SchemaAt<Options[number], Path>
    : T extends z.ZodDiscriminatedUnion<any, infer Options>
    ? SchemaAt<Options[number], Path>
    : T extends z.ZodPipeline<infer In, any>
    ? SchemaAt<In, Path>
    : T extends z.ZodEffects<infer U>
    ? SchemaAt<U, Path>
    : T extends z.ZodReadonly<infer U>
    ? SchemaAt<U, Path>
    : T extends z.ZodRecord<infer Key, infer Value>
    ? Head extends z.input<Key>
      ? SchemaAt<Value, Tail>
      : never
    : T extends z.ZodMap<infer Key, infer Value>
    ? Head extends z.input<Key>
      ? SchemaAt<Value, Tail>
      : never
    : T extends z.ZodObject<
        infer Shape,
        infer UnknownKeys,
        infer Catchall extends z.ZodTypeAny
      >
    ? Head extends keyof Shape
      ? SchemaAt<Shape[Head], Tail>
      : UnknownKeys extends 'passthrough'
      ? SchemaAt<Catchall, Tail>
      : never
    : T extends z.ZodTuple<
        infer Elements extends [z.ZodTypeAny, ...z.ZodTypeAny[]],
        infer Rest
      >
    ? Head extends number & keyof Elements
      ? SchemaAt<Elements[Head], Tail>
      : Rest extends z.ZodTypeAny
      ? Head extends number
        ? SchemaAt<Rest, Tail>
        : never
      : never
    : T extends z.ZodArray<infer Element>
    ? Head extends number
      ? SchemaAt<Element, Tail>
      : never
    : never
  : T
