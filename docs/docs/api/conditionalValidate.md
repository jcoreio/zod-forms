# `conditionalValidate`

Helper for doing conditional validation properly.

```ts
import { conditionalValidate } from '@jcoreio/zod-forms'
```

```ts
conditionalValidate<T extends z.ZodTypeAny>(schema: T): ConditionalValidator<T>
```

## Rationale

Naively, you would apply `.refine` or `.superRefine` to an object schema, but the problem is,
these refinements aren't checked if any unreleated fields in the object schema fail to parse. For example:

```ts
const schema = z
  .object({
    foo: z.string(),
    min: z.number(),
    max: z.number(),
  })
  .superRefine(({ min, max }, ctx) => {
    if (min > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['min'],
        message: 'must be <= max',
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['max'],
        message: 'must be >= min',
      })
    }
  })

schema.parse({ min: 2, max: 1 }) // thrown error only notes that `foo` is required
```

`conditionalValidate` solves this problem by allowing you to declare a validation that runs as long as
`min` and `max` are valid by themselves:

```ts
const schema = conditionalValidate(
  z.object({
    foo: z.string(),
    min: z.number().finite(),
    max: z.number().finite(),
  })
).conditionalRefine(
  // Pick the fields the refinement depends on here
  (s) => s.pick({ min: true, max: true }),
  // This refinement will only be checked if min and max are successfully parsed
  ({ min, max }) => min <= max,
  [
    { path: ['min'], message: 'must be <= max' },
    { path: ['max'], message: 'must be >= min' },
  ]
)

schema.parse({ min: 2, max: 1 }) // thrown error includes issues for `foo` being missing and `min`/`max` being wrong
```

## Returns `ConditionalValidator<T>`

A subclass of `ZodEffects` (a [`preprocess` effect](https://zod.dev/?id=preprocess)) with the following additional methods:

### `conditionalRefine`

Applies a conditional refinement

```ts
  conditionalRefine(
    schema: ConditionalRefineSchema<T>,
    check: (value: z.output<T>) => unknown,
    message:
      | string
      | z.CustomErrorParams
      | z.CustomErrorParams[]
      | ((value: Output) => z.CustomErrorParams | z.CustomErrorParams[])
  ): ConditionalValidator<T>
```

#### Arguments

`schema` should be Zod schema requiring a subset of the fields in the base schema (which was passed to `conditionalValidate`) or a function that takes the base schema and returns such a schema.

`message` is similar to `.refine` except that it may be an array of messages/issues.

#### Returns

A schema that will `safeParse` the input with the given `schema` in a [`preprocess` effect](https://zod.dev/?id=preprocess)(https://zod.dev/?id=preprocess), and if successful, it will evaluate `check` on
the parsed value. If `check` returns a falsy value, adds the
specified issue(s) in `message`.

### `conditionalRefineAsync`

Applies a conditional refinement with async parsing and/or check

```ts
  conditionalRefineAsync(
    schema: ConditionalRefineSchema<T>,
    check: (value: z.output<T>) => unknown | Promise<unknown>,
    message:
      | string
      | z.CustomErrorParams
      | z.CustomErrorParams[]
      | ((value: Output) => z.CustomErrorParams | z.CustomErrorParams[])
  ): ConditionalValidator<T>
```

#### Arguments

`schema` should be Zod schema requiring a subset of the fields in the base schema (which was passed to `conditionalValidate`) or a function that takes the base schema and returns such a schema.

`message` is similar to `.refine` except that it may be an array of messages/issues.

#### Returns

A schema will `safeParseAsync` the input with the given `schema` in a [`preprocess` effect](https://zod.dev/?id=preprocess)(https://zod.dev/?id=preprocess), and if successful, it will evaluate `check` on
the parsed value. If `check` returns a falsy value, adds the
specified issue(s) in `message`.

### `conditionalSuperRefine`

Applies a conditional superRefine

```ts
  conditionalSuperRefine(
    schema: ConditionalRefineSchema<T>,
    check: (value: z.output<T>, ctx: z.RefinementCtx) => void
  ) {
    return new ConditionalValidator(this._def.schema, [
      ...this._def.checks,
      { schema: resolveSchema(this._def.schema, schema), check, async: false },
    ])
  }
```

#### Arguments

`schema` should be Zod schema requiring a subset of the fields in the base schema (which was passed to `conditionalValidate`) or a function that takes the base schema and returns such a schema.

#### Returns

A schema will `safeParse` the input with the given `schema` in a [`preprocess` effect](https://zod.dev/?id=preprocess)(https://zod.dev/?id=preprocess), and if successful, it will evaluate `check` on the parsed value.

### `conditionalSuperRefineAsync`

Applies a conditional superRefine with async parsing or check

```ts
  conditionalSuperRefineAsync(
    schema: ConditionalRefineSchema<T>,
    check: (value: z.output<T>, ctx: z.RefinementCtx) => void | Promise<void>
  ) {
    return new ConditionalValidator(this._def.schema, [
      ...this._def.checks,
      { schema: resolveSchema(this._def.schema, schema), check, async: false },
    ])
  }
```

#### Arguments

`schema` should be Zod schema requiring a subset of the fields in the base schema (which was passed to `conditionalValidate`) or a function that takes the base schema and returns such a schema.

#### Returns

The returned schema will `safeParseAsync` the input with the given `schema` in a [`preprocess` effect](https://zod.dev/?id=preprocess)(https://zod.dev/?id=preprocess), and if successful, it will evaluate `check` on
the parsed value.
