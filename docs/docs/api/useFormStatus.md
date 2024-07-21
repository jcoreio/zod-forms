# `useFormStatus`

React custom hook for subscribing to the overall form validation and submission status.

```ts
import { useFormStatus } from '@jcoreio/zod-forms'
```

## Returns [`FormStatus`](types.md#formstatus)

An object with the following properties. Causes a rerender when any of these properties changes.

- `initialized` - whether the form has been initialized
- `submitting` - whether the form is currently submitting
- `submitSucceeded` - whether submit succeeded
- `submitFailed` - whether submit failed
- `submitError` - the reason submit failed, if any
- `valididationError` - the reason validation failed, if any
- `valid` - whether all fields are valid
- `invalid` - opposite of `valid`
- `pristine` - opposite of `dirty`
- `dirty` - whether any field is unequal to its initial value
