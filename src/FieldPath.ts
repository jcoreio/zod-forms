import z from 'zod'
import { pathstring } from './util/pathstring'
import { SchemaAt } from './util/SchemaAt'
import { PathInSchema, PathstringInSchema } from './util/PathInSchema'
import { parsePathstring } from './util/parsePathstring'

export type FieldPathForValue<Value, RawValue = any> = FieldPath<
  z.ZodType<Value, any, RawValue>
>
export type FieldPathForRawValue<RawValue> = FieldPath<
  z.ZodType<any, any, RawValue>
>

export class FieldPath<T extends z.ZodTypeAny = z.ZodTypeAny> {
  readonly path: BasePath
  readonly pathstring: string
  readonly schema: T

  private subfields: Map<SubpathKey<T>, FieldPath> | undefined

  private constructor({ schema, path }: { schema: T; path: BasePath }) {
    this.path = path
    this.schema = schema
    this.pathstring = pathstring(path)
  }

  static root<T extends z.ZodTypeAny>(schema: T) {
    return new FieldPath({ schema, path: [] })
  }

  get<Path extends PathInSchema<T>>(
    path: Path
  ): SchemaAt<T, Path> extends never ? never : FieldPath<SchemaAt<T, Path>>
  get<Pathstring extends PathstringInSchema<T>>(
    path: Pathstring
  ): FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>
  get(path: any): FieldPath {
    if (typeof path === 'string') path = parsePathstring(path)
    if (!Array.isArray(path)) throw new Error(`invalid path: ${path}`)
    return path.reduce((field, key) => field.subfield(key), this)
  }

  subfield<K extends SubpathKey<T>>(key: K): FieldPath<SchemaAt<T, [K]>> {
    const cached = this.subfields?.get(key)
    if (cached) return cached as any
    const schema = subschema(this.schema, key)
    if (!schema) throw new Error(`invalid subschema key: ${key}`)
    const subfield = new FieldPath({
      path: [...this.path, key] as any,
      schema: schema as any,
    })
    if (this.subfields == null) this.subfields = new Map()
    this.subfields.set(key, subfield)
    return subfield
  }
}

export type BasePath = (string | number)[]

export type SubpathKey<T extends z.ZodTypeAny> = 0 extends 1 & T
  ? any
  : 0 extends 1 & z.input<T>
  ? any
  : T extends z.ZodObject<infer Shape, infer UnknownKeys>
  ? UnknownKeys extends 'passthrough'
    ? string
    : keyof Shape
  : T extends z.ZodRecord<infer Key, any>
  ? z.input<Key>
  : T extends z.ZodMap<infer Key, any>
  ? z.input<Key>
  : T extends z.ZodArray<any>
  ? number
  : T extends z.ZodTuple<any, any>
  ? number
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
  : T extends z.ZodEffects<infer U, any>
  ? SubpathKey<U>
  : T extends z.ZodBranded<infer U, any>
  ? SubpathKey<U>
  : never

export type AllPaths<T extends z.ZodTypeAny> = SubpathKey<T> extends never
  ? []
  : [] | ValuesOf<SubpathKeyMap<T>>

type ValuesOf<O> = O[keyof O]

export type SubpathKeyMap<T extends z.ZodTypeAny> = {
  [K in SubpathKey<T>]: [K, ...AllPaths<SchemaAt<T, [K]>>]
}

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
        ? z.union(options as any)
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
    case 'ZodEffects': {
      const {
        _def: { schema: innerSchema },
      } = schema as z.ZodEffects<z.ZodTypeAny, any>
      return subschema(innerSchema, key)
    }
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
        (schema as z.ZodPipeline<z.ZodTypeAny, z.ZodTypeAny>)._def.in,
        key
      )
  }
  return undefined
}
