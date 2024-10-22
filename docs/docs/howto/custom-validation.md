# Custom/Conditional Validation

In your form schema, use [`.refine`](https://zod.dev/?id=refine) and [`.superRefine`](https://zod.dev/?id=superrefine)
for field validation.

## Validating a Single Field

[`.refine`](https://zod.dev/?id=refine) is convenient for single-field validation:

```ts
const schema = z.object({
  serverUrl: z
    .string()
    .url()
    .optional()
    .refine((url) => {
      try {
        return url == null || new URL(url).protocol === 'mqtts'
      } catch {
        return false
      }
    }, 'must be a valid mqtts url'),
})
```

![error message example](../../static/img/single-field-validation.png)

## Comparing Fields

To validate one field against another, use [`conditionalValidate`](../api/conditionalValidate.md).
It is similar to `.superRefine`, but ensures that the refinements are checked even if unrelated fields
failed to parse.

```ts
import { conditionalValidate } from '@jcoreio/zod-forms'

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
```

![error message example](../../static/img/min-max-validation.png)

## Conditional Validation

To do conditional validation, use [`conditionalValidate`](../api/conditionalValidate.md).
It is similar to `.superRefine`, but ensures that the refinements are checked even if unrelated fields
failed to parse.

```ts
import { conditionalValidate } from '@jcoreio/zod-forms'

const schema = conditionalValidate(
  z.object({
    dataType: z.enum(['string', 'number']),
    displayPrecision: z.number().finite().optional(),
  })
).conditionalRefine(
  (s) => s.pick({ dataType: true, displayPrecision: true }),
  ({ dataType, displayPrecision }) =>
    dataType !== 'number' || displayPrecision != null,
  { path: ['displayPrecision'], message: 'Required when dataType is number' }
)
```

![error message example](../../static/img/conditional-validation.png)
![inactive validation example](../../static/img/conditional-validation-inactive.png)
