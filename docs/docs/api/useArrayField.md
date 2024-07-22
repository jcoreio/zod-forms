# `useArrayField`

React custom hook for subscribing to the value and validation state of an array form field and getting methods
to programmatically manipulate it.

```ts
import { useArrayField } from '@jcoreio/zod-forms'
```

```ts
export function useArrayField(path): UseArrayFieldProps`
```

`path` may be a [`FieldPath`](FieldPath.md). If you cast to [`TypedUseArrayField`](types.md#typedusearrayfield)
or use the [`useArrayField` returned from `createZodForm`](createZodForm.md#returns-zodformt),
`path` may be a [pathstring](../concepts.md#pathstrings) or [path array](../concepts.md#path-arrays).

The full method signature extracts the type of the subschema at the given path, and should produce a TS error
if the path is invalid, not array valued, or doesn't exist in the schema.

## Returns [`UseArrayFieldProps`](types.md#usearrayfieldprops)

An object containing the following properties. Causes a rerender when any of these properties changes.

- `elements` - an array of [`FieldPath`](FieldPath.md)s for each element of the array
- `error` - the validation error message, if any
- `dirty` - whether the `value` is not equal to `initialValue`
- `pristine` - opposite of `dirty`
- `valid` - whether the `rawValue` is valid
- `invalid` - oppposite of `valid`
- `touched` - whether the field has been blurred or the form submitted
- `visited` - whether the field has been focused
- `setMeta` - method to set the [`FieldMeta`](types.md#fieldmeta) for this field
- `setRawValue` - method to set the raw value for this field
- `setValue` - method to set the value for this field
- `insert` - method to insert a value into the array
- `insertRaw` - method to insert a raw value into the array
- `move` - method to move a value from one index to another
- `pop` - method to remove the last value from the array
- `push` - method to add a value to the end of the array
- `pushRaw` - method to add a raw value to the end of the array
- `remove` - method to remove a value at an index
- `removeAll` - method to remove all values
- `splice` - method to remove and/or insert values, like `Array.splice`
- `spliceRaw` - method to remove and/or insert raw values, like `Array.splice`
- `swap` - method to swap values at two indices
- `unshift` - method to add a value to the beginning of the array
- `unshiftRaw` - method to add a raw value to the beginning of the
