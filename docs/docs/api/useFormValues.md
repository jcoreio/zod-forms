# `useFormValues`

React custom hook for subscribing to the entire form values.

```ts
import { useFormValues } from '@jcoreio/zod-forms'
```

```ts
export function useFormValues<T extends z.ZodTypeAny>(): {
  parsedValues: DeepPartial<z.output<T>> | undefined
  values: DeepPartial<z.input<T>> | undefined
  initialParsedValues: z.output<T> | undefined
  initialValues: DeepPartial<z.input<T>> | undefined
}
```

All types will be `unknown` unless you pass an explicit schema type for `T` or use the [`useFormValues` returned by `createZodForm`](createZodForm.md#returns-zodformt).

## Returns

An object containing the following properties. Causes a rerender when any field value changes.

- `validtedValues` - the parsed field values, or `undefined` if any is invalid
- `values` - the field values
- `initialParsedValues` - the initial parsed field values, or `undefined` if uninitialized or any is invalid
- `initialValues` - the initial field values
