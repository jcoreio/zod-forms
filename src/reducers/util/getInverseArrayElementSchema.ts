import z from 'zod'
import { getArrayElementSchema } from '../../util/getArrayElementSchema'
import { invert } from 'zod-invertible'

export function getInverseArrayElementSchema(schema: z.ZodTypeAny) {
  const elemSchema = getArrayElementSchema(schema)
  if (!elemSchema) throw new Error('field is not an array')
  return invert(elemSchema)
}
