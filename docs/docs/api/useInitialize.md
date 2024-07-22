# `useInitialize`

React custom hook for setting initial values on a form.

```ts
import { useInitialize } from '@jcoreio/zod-forms'
```

```ts
export function useInitialize<T extends z.ZodTypeAny>(
  options: {
    rawValues?: z.input<T>
    values?: z.output<T>
    keepSubmitSucceeded?: boolean
  },
  deps: DependencyList = [options.values, options.rawValues]
): void
```

You must pass an explicit schema type for `T` unless you use the [`useInitialize` returned by `createZodForm`](createZodForm.md#returns-zodformt).

Any time `deps` is not shallow equal to its value on the previous render (similar to `useEffect`),
the form is reinitialized.

If `keepSubmitSucceeded` is `true`, the `submitSucceeded` property won't be cleared on reinitialize.
