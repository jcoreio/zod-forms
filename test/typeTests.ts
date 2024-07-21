import z, { RefinementCtx } from 'zod'
import { createZodForm } from '../src/createZodForm'
import { invertible } from 'zod-invertible'
import { assertEqual } from './util/assertEqual'
import { PathInType } from '../src/util/PathInType'
import { parsePathstring } from '../src/util/parsePathstring'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function pathInTypeTest() {
  assertEqual<
    PathInType<
      [{ foo: number }, { bar: { baz: string } }, ...{ qux: boolean }[]]
    >,
    | []
    | [number]
    | [number, 'foo']
    | [number, 'bar']
    | [number, 'bar', 'baz']
    | [number, 'qux']
  >(true)

  assertEqual<
    PathInType<[{ foo: number }, { bar: string }]>,
    [] | [number] | [number, 'foo'] | [number, 'bar']
  >(true)

  assertEqual<
    PathInType<{ foo: { bar?: { baz: string; qux?: { blah?: string }[] } } }>,
    | []
    | ['foo']
    | ['foo', 'bar']
    | ['foo', 'bar', 'baz']
    | ['foo', 'bar', 'qux']
    | ['foo', 'bar', 'qux', number]
    | ['foo', 'bar', 'qux', number, 'blah']
  >(true)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parsePathstringTest() {
  assertEqual<
    parsePathstring<'foo.bar["baz[a\\""][0].qux[4]'>,
    ['foo', 'bar', 'baz[a"', 0, 'qux', 4]
  >(true)
  assertEqual<
    parsePathstring<'["baz\\n[a\\"bl]ah\\t"].test'>,
    ['baz\n[a"bl]ah\t', 'test']
  >(true)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function typeTests() {
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
}
