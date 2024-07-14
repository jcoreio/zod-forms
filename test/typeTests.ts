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
  bool: z.boolean(),
})

const form = createZodForm({ schema: testSchema })

form.useField(['foo', 0, 'bar']).setValue(2)
form.useField('foo[0].bar').setValue(2)
form.useField(['tup', 1, 'blah']).setValue('hello')
form.useField(['tup', 0]).setValue(5)
form
  .useHtmlField({ field: ['foo', 0, 'bar'] as const, type: 'text' })
  .meta.setValue(2)
form.useField(form.get(['foo', 0, 'bar'])).setValue(2)
form.useField(form.get(['foo', 0]).get('bar')).setValue(2)
form.useField(form.get('foo').get('[0]').get('bar')).setValue(2)
form.useField(form.get('foo').get('[0]').get('bar')).setRawValue('5')
form.useField('foo[0].bar').setRawValue('5')
form
  .useHtmlField({ field: ['bool'] as const, type: 'checkbox' })
  .meta.setValue(true)
form
  .useHtmlField({ field: form.get('bool'), type: 'checkbox' })
  .meta.setValue(true)
