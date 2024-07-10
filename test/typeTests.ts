import z, { RefinementCtx } from 'zod'
import { createZodForm } from '../src/createZodForm'
import { invertible } from 'zod-invertible'

const NumberSchema = invertible(
  z.string(),
  (s: string, ctx: RefinementCtx) => {
    const num = Number(s)
    if (!Number.isFinite(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invalid number',
      })
    }
    return num
  },
  z.number().finite(),
  (n) => String(n)
)

const testSchema = z.object({
  foo: z.array(z.object({ bar: NumberSchema, baz: z.number() })).optional(),
  tup: z.tuple([z.number(), z.object({ blah: z.string() })]),
})

const form = createZodForm({ schema: testSchema })

form.useField(form.root.get('foo').get(0).get('bar')).setValue(2)
form.useField(form.root.get('foo').get(0).get('bar')).setRawValue('5')
