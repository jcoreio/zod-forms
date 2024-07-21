# `useSubmit`

React custom hook for registering a submit handler function to be called with the form values
when a valid form is submitted, and/or getting the `onSubmit` handler to pass to a `<form>` element.

Unlike other form libraries, multiple submit handlers can be registered in the same form, and they will be called one by one in registration order. The main purpose of this is to simplify wizard forms with animated transitions between steps, where the `<form>` element and submit button live outside the transitioning elements.

```ts
import { useSubmit } from '@jcoreio/zod-forms'
```

```ts
export function useSubmit<T extends z.ZodTypeAny>(handlers?: {
  onSubmit?: SubmitHandler<T>
  onSubmitSucceeded?: SubmitSuccededHandler
  onSubmitFailed?: SubmitFailedHandler
}): React.FormEventHandler
```

## Options

- `onSubmit` - the function to submit the values to the backend. May be `async`.
- `onSubmitSucceeded` - a callback to call when submit succeeds
- `onSubmitFailed` - a callback to call when submit fails

## Returns `React.FormEventHandler`

The form event handler to pass as the `onSubmit` property to a `<form>` element.
