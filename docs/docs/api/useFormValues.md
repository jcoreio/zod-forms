# `useFormValues`

React custom hook for subscribing to the entire form values.

```ts
import { useFormValues } from '@jcoreio/zod-forms'
```

## Returns

An object containing the following properties. Causes a rerender when any field value changes.

- `values` - the parsed field values, or `undefined` if any is invalid
- `rawValues` - the raw field values
- `initialValues` - the initial field values, or `undefined` if uninitialized or any is invalid
- `rawInitialValues` - the raw initial field values
