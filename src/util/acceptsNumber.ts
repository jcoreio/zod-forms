import z from 'zod'

export function acceptsNumber(schema: z.ZodTypeAny): boolean {
  switch (schema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return true
    case z.ZodFirstPartyTypeKind.ZodUnion: {
      const { options } = schema as z.ZodUnion<z.ZodUnionOptions>
      return options.some(acceptsNumber)
    }
    case z.ZodFirstPartyTypeKind.ZodIntersection: {
      const {
        _def: { left, right },
      } = schema as z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>
      return acceptsNumber(left) && acceptsNumber(right)
    }
    case z.ZodFirstPartyTypeKind.ZodLazy: {
      const { schema: innerSchema } = schema as z.ZodLazy<z.ZodTypeAny>
      return acceptsNumber(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodLiteral: {
      const { value } = schema as z.ZodLiteral<any>
      return typeof value === 'number'
    }
    case z.ZodFirstPartyTypeKind.ZodEffects: {
      const {
        _def: { schema: innerSchema },
      } = schema as z.ZodEffects<z.ZodTypeAny>
      return acceptsNumber(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodOptional: {
      const innerSchema = (schema as z.ZodOptional<z.ZodTypeAny>).unwrap()
      return acceptsNumber(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodNullable: {
      const innerSchema = (schema as z.ZodNullable<z.ZodTypeAny>).unwrap()
      return acceptsNumber(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodDefault: {
      const {
        _def: { innerType },
      } = schema as z.ZodDefault<z.ZodTypeAny>
      return acceptsNumber(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodCatch: {
      const {
        _def: { innerType },
      } = schema as z.ZodCatch<z.ZodTypeAny>
      return acceptsNumber(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodBranded: {
      const {
        _def: { type: innerType },
      } = schema as z.ZodBranded<z.ZodTypeAny, string | number | symbol>
      return acceptsNumber(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodPipeline: {
      const {
        _def: { in: input },
      } = schema as z.ZodPipeline<z.ZodTypeAny, z.ZodTypeAny>
      return acceptsNumber(input)
    }
    case z.ZodFirstPartyTypeKind.ZodReadonly: {
      const {
        _def: { innerType },
      } = schema as z.ZodReadonly<z.ZodTypeAny>
      return acceptsNumber(innerType)
    }
  }
  return false
}
