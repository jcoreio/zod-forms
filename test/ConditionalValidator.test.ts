import { describe, it } from 'mocha'
import { expect } from 'chai'
import z from 'zod'
import { conditionalValidate } from '../src'
import { invert } from 'zod-invertible'

describe(`ConditionalValidator`, function () {
  it(`sync .conditionalRefine`, function () {
    const schema = conditionalValidate(
      z.object({
        foo: z.string(),
        min: z.number(),
        max: z.number(),
      })
    ).conditionalRefine(
      (s) => s.pick({ min: true, max: true }),
      ({ min, max }) => min <= max,
      [
        { path: ['min'], message: 'must be <= max' },
        { path: ['max'], message: 'must be >= min' },
      ]
    )
    expect(schema.parse({ foo: '1', min: 1, max: 2 })).to.deep.equal({
      foo: '1',
      min: 1,
      max: 2,
    })
    expect(schema.safeParse({ min: 2, max: 1 })).to.deep.equal({
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          path: ['min'],
          message: 'must be <= max',
        },
        {
          code: z.ZodIssueCode.custom,
          path: ['max'],
          message: 'must be >= min',
        },
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'string',
          received: 'undefined',
          path: ['foo'],
          message: 'Required',
        },
      ]),
    })
    expect(schema.safeParse({ min: 2 })).to.deep.equal({
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'string',
          received: 'undefined',
          path: ['foo'],
          message: 'Required',
        },
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'number',
          received: 'undefined',
          path: ['max'],
          message: 'Required',
        },
      ]),
    })
    const inverse = invert(schema)
    expect(inverse.parse({ foo: '1', min: 1, max: 2 })).to.deep.equal({
      foo: '1',
      min: 1,
      max: 2,
    })
  })
  it(`string message`, function () {
    const baseSchema = z.object({
      foo: z.string(),
      min: z.number(),
      max: z.number(),
    })
    const schema = conditionalValidate(baseSchema).conditionalRefine(
      baseSchema.pick({ min: true, max: true }),
      ({ min, max }) => min <= max,
      'must be <= max'
    )
    schema.parse({ foo: '1', min: 1, max: 2 })
    expect(schema.safeParse({ min: 2, max: 1 })).to.deep.equal({
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          message: 'must be <= max',
          path: [],
        },
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'string',
          received: 'undefined',
          path: ['foo'],
          message: 'Required',
        },
      ]),
    })
    expect(schema.safeParse({ min: 2 })).to.deep.equal({
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'string',
          received: 'undefined',
          path: ['foo'],
          message: 'Required',
        },
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'number',
          received: 'undefined',
          path: ['max'],
          message: 'Required',
        },
      ]),
    })
  })
  it(`.conditionalRefineAsync`, async function () {
    const schema = conditionalValidate(
      z.object({
        foo: z.string(),
        min: z.string().transform(async (v) => Number(v)),
        max: z.number(),
      })
    ).conditionalRefineAsync(
      (s) => s.pick({ min: true, max: true }),
      async ({ min, max }) => min <= max,
      () => [
        { path: ['min'], message: 'must be <= max' },
        { path: ['max'], message: 'must be >= min' },
      ]
    )
    expect(
      await schema.parseAsync({ foo: '1', min: '1', max: 2 })
    ).to.deep.equal({ foo: '1', min: 1, max: 2 })
    expect(await schema.safeParseAsync({ min: '2', max: 1 })).to.deep.equal({
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          path: ['min'],
          message: 'must be <= max',
        },
        {
          code: z.ZodIssueCode.custom,
          path: ['max'],
          message: 'must be >= min',
        },
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'string',
          received: 'undefined',
          path: ['foo'],
          message: 'Required',
        },
      ]),
    })
    expect(await schema.safeParseAsync({ min: '2' })).to.deep.equal({
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'string',
          received: 'undefined',
          path: ['foo'],
          message: 'Required',
        },
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'number',
          received: 'undefined',
          path: ['max'],
          message: 'Required',
        },
      ]),
    })
  })
})
