# `useField`

React custom hook for subscribing to the value and validation state of a form field and getting methods
to programmatically set the value.

To connect `<input>` elements to form state, [`useHtmlField`](useHtmlField.md) is probably more useful;
`useField` is better for custom field components that aren't based upon `<input>`s.

For array fields, use [`useArrayField`](useArrayField.md).

```ts
import { useField } from '@jcoreio/zod-forms'
```

```ts
export function useField(path): UseFieldProps`
```

`path` may be a [`FieldPath`](FieldPath.md). If you cast to [`TypedUseField`](types.md#typedusefield),
or use the [`useField` returned by `createZodForm`](createZodForm.md#returns-zodformt), `path` may be
a [pathstring](../concepts.md#pathstrings) or [path array](../concepts.md#path-arrays).

The full method signature (not shown here) extracts the type of the subschema at the given path,
and should produce a TS error if the path is invalid or doesn't exist in the schema.

## Returns [`UseFieldProps`](types.md#usefieldprops)

An object containing the following properties. Causes a rerender when any of these properties changes.

- `parsedValue` - the parsed value of the field, or `undefined` if invalid
- `value` - the value of the field
- `initialParsedValue` - the parsed initial value of the field, or `undefined` if invalid/uninitialized
- `initialValue` - the initial value of the field
- `error` - the validation error message, if any
- `dirty` - whether the `value` is not equal to `initialValue`
- `pristine` - opposite of `dirty`
- `valid` - whether the `value` is valid
- `invalid` - oppposite of `valid`
- `touched` - whether the field has been blurred or the form submitted
- `visited` - whether the field has been focused
- `customMeta` - custom meta information you've stored for this field
- `setMeta` - method to set the [`FieldMeta`](types.md#fieldmeta) for this field
- `setValue` - method to set the value for this field
- `setParsedValue` - method to set the parsed value for this field
