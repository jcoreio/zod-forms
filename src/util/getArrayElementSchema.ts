import z from 'zod'

export function getArrayElementSchema(
  schema: z.ZodTypeAny
): z.ZodTypeAny | undefined {
  switch (schema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodArray: {
      const { element } = schema as z.ZodArray<z.ZodTypeAny>
      return element
    }
    case z.ZodFirstPartyTypeKind.ZodUnion: {
      const { options } = schema as z.ZodUnion<z.ZodUnionOptions>
      const elements = options
        .map(getArrayElementSchema)
        .filter((s): s is z.ZodTypeAny => s != null)
      return elements.length > 1 ? z.union(elements as any) : elements[0]
    }
    case z.ZodFirstPartyTypeKind.ZodLazy: {
      const { schema: innerSchema } = schema as z.ZodLazy<z.ZodTypeAny>
      return getArrayElementSchema(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodEffects: {
      const {
        _def: { schema: innerSchema },
      } = schema as z.ZodEffects<z.ZodTypeAny>
      return getArrayElementSchema(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodOptional: {
      const innerSchema = (schema as z.ZodOptional<z.ZodTypeAny>).unwrap()
      return getArrayElementSchema(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodNullable: {
      const innerSchema = (schema as z.ZodNullable<z.ZodTypeAny>).unwrap()
      return getArrayElementSchema(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodDefault: {
      const {
        _def: { innerType },
      } = schema as z.ZodDefault<z.ZodTypeAny>
      return getArrayElementSchema(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodCatch: {
      const {
        _def: { innerType },
      } = schema as z.ZodCatch<z.ZodTypeAny>
      return getArrayElementSchema(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodPromise: {
      const {
        _def: { type: innerType },
      } = schema as z.ZodPromise<z.ZodTypeAny>
      return getArrayElementSchema(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodBranded: {
      const {
        _def: { type: innerType },
      } = schema as z.ZodBranded<z.ZodTypeAny, string | number | symbol>
      return getArrayElementSchema(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodPipeline: {
      const {
        _def: { in: input },
      } = schema as z.ZodPipeline<z.ZodTypeAny, z.ZodTypeAny>
      return getArrayElementSchema(input)
    }
    case z.ZodFirstPartyTypeKind.ZodReadonly: {
      const {
        _def: { innerType },
      } = schema as z.ZodReadonly<z.ZodTypeAny>
      return getArrayElementSchema(innerType)
    }
  }
  return undefined
}
