import z from 'zod'

export function acceptsBigint(schema: z.ZodTypeAny): boolean {
  switch (schema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodBigInt:
      return true
    case z.ZodFirstPartyTypeKind.ZodUnion: {
      const { options } = schema as z.ZodUnion<z.ZodUnionOptions>
      return options.some(acceptsBigint)
    }
    case z.ZodFirstPartyTypeKind.ZodIntersection: {
      const {
        _def: { left, right },
      } = schema as z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>
      return acceptsBigint(left) && acceptsBigint(right)
    }
    case z.ZodFirstPartyTypeKind.ZodLazy: {
      const { schema: innerSchema } = schema as z.ZodLazy<z.ZodTypeAny>
      return acceptsBigint(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodLiteral: {
      const { value } = schema as z.ZodLiteral<any>
      return typeof value === 'bigint'
    }
    case z.ZodFirstPartyTypeKind.ZodEffects: {
      const {
        _def: { schema: innerSchema },
      } = schema as z.ZodEffects<z.ZodTypeAny>
      return acceptsBigint(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodOptional: {
      const innerSchema = (schema as z.ZodOptional<z.ZodTypeAny>).unwrap()
      return acceptsBigint(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodNullable: {
      const innerSchema = (schema as z.ZodNullable<z.ZodTypeAny>).unwrap()
      return acceptsBigint(innerSchema)
    }
    case z.ZodFirstPartyTypeKind.ZodDefault: {
      const {
        _def: { innerType },
      } = schema as z.ZodDefault<z.ZodTypeAny>
      return acceptsBigint(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodCatch: {
      const {
        _def: { innerType },
      } = schema as z.ZodCatch<z.ZodTypeAny>
      return acceptsBigint(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodBranded: {
      const {
        _def: { type: innerType },
      } = schema as z.ZodBranded<z.ZodTypeAny, string | number | symbol>
      return acceptsBigint(innerType)
    }
    case z.ZodFirstPartyTypeKind.ZodPipeline: {
      const {
        _def: { in: input },
      } = schema as z.ZodPipeline<z.ZodTypeAny, z.ZodTypeAny>
      return acceptsBigint(input)
    }
    case z.ZodFirstPartyTypeKind.ZodReadonly: {
      const {
        _def: { innerType },
      } = schema as z.ZodReadonly<z.ZodTypeAny>
      return acceptsBigint(innerType)
    }
  }
  return false
}
