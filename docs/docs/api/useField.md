# `useField`

React custom hook for subscribing to the value and validation state of a form field and getting methods
to programmatically set the value.

To connect `<input>` elements to form state, [`useHtmlField`](useHtmlField.md) is probably more useful;
`useField` is better for custom field components that aren't based upon `<input>`s.

```ts
import { useField } from '@jcoreio/zod-forms'
```
