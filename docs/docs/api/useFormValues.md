# `useFormValues`

React custom hook for subscribing to the entire form values.

```ts
import { useFormValues } from '@jcoreio/zod-forms'
```

```ts
export function useFormValues<T extends z.ZodTypeAny>(): {
  values: z.output<T> | undefined
  rawValues: unknown
  initialValues: z.output<T> | undefined
  initialRawValues: unknown
}
```

All types will be `unknown` unless you pass an explicit schema type for `T` or use the [`useFormValues` returned by `createZodForm`](createZodForm.md#returns-zodformt).

## Returns

An object containing the following properties. Causes a rerender when any field value changes.

- `values` - the parsed field values, or `undefined` if any is invalid
- `rawValues` - the raw field values
- `initialValues` - the initial field values, or `undefined` if uninitialized or any is invalid
- `rawInitialValues` - the raw initial field values
