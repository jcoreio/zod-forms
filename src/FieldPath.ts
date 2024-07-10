import z from 'zod'
import { pathstring } from './util/pathstring'

export class FieldPath<Root extends z.ZodTypeAny, Path extends BasePath> {
  readonly root: Root
  readonly parent: ParentPath<Path> extends []
    ? undefined
    : FieldPath<Root, ParentPath<Path>>
  readonly path: Path
  readonly pathstring: string
  readonly schema: SchemaAt<Root, Path>

  private constructor({
    parent,
    root,
    path,
    schema,
  }: {
    parent: ParentPath<Path> extends []
      ? undefined
      : FieldPath<Root, ParentPath<Path>>
    root: Root
    path: Path
    schema: SchemaAt<Root, Path>
  }) {
    if (!root) {
      throw new Error(`root is required if parent is undefined`)
    }
    if (path.length && !parent) {
      throw new Error(`parent is required if path is not empty`)
    }
    this.root = root
    this.parent = parent as any
    this.path = path
    this.schema = schema
    this.pathstring = pathstring(path)
  }

  static root<T extends z.ZodTypeAny>(schema: T): FieldPath<T, []> {
    return new FieldPath({ root: schema, parent: undefined, path: [], schema })
  }

  get<K extends SubpathKey<SchemaAt<Root, Path>>>(
    key: K
  ): FieldPath<Root, [...Path, K]> {
    const { root, path } = this
    const schema = subschema(this.schema, key)
    if (!schema) throw new Error(`invalid subschema key: ${key}`)
    return new FieldPath({
      root,
      parent: this as any,
      path: [...path, key] as any,
      schema: schema as any,
    })
  }
}

export type BasePath = (string | number | symbol)[]

type ParentPath<P extends BasePath> = 0 extends 1 & P
  ? any
  : P extends [] | [any]
  ? []
  : P extends [infer Head, ...infer Tail extends BasePath]
  ? [Head, ...ParentPath<Tail>]
  : []

export type SchemaAt<
  T extends z.ZodTypeAny,
  Path extends BasePath
> = 0 extends 1 & Path
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
    : T extends z.ZodRecord<infer Key, infer Value>
    ? Head extends z.output<Key>
      ? SchemaAt<Value, Tail>
      : never
    : T extends z.ZodMap<infer Key, infer Value>
    ? Head extends z.output<Key>
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
    : T extends z.ZodPipeline<any, infer Out>
    ? SchemaAt<Out, Tail>
    : T extends z.ZodEffects<infer U, any>
    ? SchemaAt<U, Tail>
    : T extends z.ZodReadonly<infer U>
    ? SchemaAt<U, Tail>
    : never
  : T

type SubpathKey<T extends z.ZodTypeAny> = T extends z.ZodObject<
  infer Shape,
  infer UnknownKeys
>
  ? UnknownKeys extends 'passthrough'
    ? string
    : keyof Shape
  : T extends z.ZodRecord<infer Key, any>
  ? z.output<Key>
  : T extends z.ZodMap<infer Key, any>
  ? z.output<Key>
  : T extends z.ZodArray<any>
  ? number
  : T extends z.ZodTuple<infer Elements, infer Rest>
  ? Rest extends z.ZodTypeAny
    ? number
    : keyof Elements
  : T extends z.ZodLazy<infer U>
  ? SubpathKey<U>
  : T extends z.ZodUnion<infer Options>
  ? SubpathKey<Options[number]>
  : T extends z.ZodDiscriminatedUnion<any, infer Options>
  ? SubpathKey<Options[number]>
  : T extends z.ZodOptional<infer U>
  ? SubpathKey<U>
  : T extends z.ZodNullable<infer U>
  ? SubpathKey<U>
  : T extends z.ZodDefault<infer U>
  ? SubpathKey<U>
  : T extends z.ZodCatch<infer U>
  ? SubpathKey<U>
  : T extends z.ZodBranded<infer U, any>
  ? SubpathKey<U>
  : never

function subschema(
  schema: z.ZodTypeAny,
  key: string
): z.ZodTypeAny | undefined {
  switch (schema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodAny:
    case 'ZodArray':
      if (typeof key === 'number') return (schema as z.ZodArray<any>).element
      break
    case 'ZodObject': {
      const {
        shape,
        _def: { unknownKeys, catchall },
      } = schema as z.AnyZodObject
      if (key in shape) return shape[key]
      if (unknownKeys === 'passthrough') return catchall
      break
    }
    case 'ZodUnion': {
      const options = (
        schema as z.ZodUnion<[z.ZodTypeAny, ...z.ZodTypeAny[]]>
      ).options
        .map((opt) => subschema(opt, key))
        .filter((opt): opt is z.ZodTypeAny => opt != null)
      return options.length > 1
        ? z.union(options as any)
        : options.length === 1
        ? options[0]
        : undefined
    }
    case 'ZodDiscriminatedUnion': {
      const discUnion = schema as z.ZodDiscriminatedUnion<
        any,
        [z.AnyZodObject, ...z.AnyZodObject[]]
      >
      const options = discUnion.options
        .map((opt) => subschema(opt, key))
        .filter((opt): opt is z.ZodTypeAny => opt != null)
      return options.length > 1
        ? z.discriminatedUnion(discUnion.discriminator, options as any)
        : options.length === 1
        ? options[0]
        : undefined
      break
    }
    case 'ZodIntersection':
      break
    case 'ZodTuple': {
      const {
        items,
        _def: { rest },
      } = schema as z.ZodTuple<any, any>
      if (typeof key === 'number' && key > 0 && key < items.length) {
        return items[key]
      }
      if (rest) return rest
      break
    }
    case 'ZodRecord': {
      const { keySchema, valueSchema } = schema as z.ZodRecord<
        z.ZodTypeAny,
        z.ZodTypeAny
      >
      if (keySchema.safeParse(key).success) return valueSchema
      break
    }
    case 'ZodMap': {
      const { keySchema, valueSchema } = schema as z.ZodMap<
        z.ZodTypeAny,
        z.ZodTypeAny
      >
      if (keySchema.safeParse(key).success) return valueSchema
      break
    }
    case 'ZodLazy':
      return subschema((schema as z.ZodLazy<z.ZodTypeAny>).schema, key)
    case 'ZodEffects':
      break
    case 'ZodOptional':
      return subschema((schema as z.ZodOptional<z.ZodTypeAny>).unwrap(), key)
    case 'ZodNullable':
      return subschema((schema as z.ZodNullable<z.ZodTypeAny>).unwrap(), key)
    case 'ZodDefault':
      return subschema(
        (schema as z.ZodDefault<z.ZodTypeAny>).removeDefault(),
        key
      )
    case 'ZodCatch':
      return subschema((schema as z.ZodCatch<z.ZodTypeAny>).removeCatch(), key)
    case 'ZodBranded':
      return subschema(
        (schema as z.ZodBranded<z.ZodTypeAny, any>)._def.type,
        key
      )
    case 'ZodPipeline':
      return subschema(
        (schema as z.ZodPipeline<z.ZodTypeAny, z.ZodTypeAny>)._def.out,
        key
      )
  }
  return undefined
}
