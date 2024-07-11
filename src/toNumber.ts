import z from 'zod'
import { invertible } from 'zod-invertible'

export const toNumber = invertible(
  z.string().nullish(),
  (s, ctx): any => {
    if (!s?.trim()) return s == null ? s : undefined
    const num = Number(s)
    if (isNaN(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invalid number',
      })
    }
    return num
  },
  z.number().nullish(),
  (n) => (n == null ? n : String(n))
)
