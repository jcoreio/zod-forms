# `useHtmlField`

React custom hook for connecting an `<input>` element to form state.

```ts
import { useHtmlField } from '@jcoreio/zod-forms'
```

```ts
export function useHtmlField({ field, type, normalizeOnBlur }): UseHtmlFieldProps`
```

The full [`TypedUseHtmlField<T>`](types.md#typedusehtmlfield) method signature extracts the type of the subschema at
the given path, and should produce a TS error if the path is invalid, doesn't exist in the schema, or its subschema doesn't accept
`string | number | bigint | boolean | null | undefined`.

## Options

- `field` - a [`FieldPath`](FieldPath.md), [pathstring](../concepts.md#pathstrings) or [path array](../concepts.md#path-arrays).
- `type` - the `type` attribute for the `<input>` element
- `normalizeOnBlur` (optional, defaults to `true`) - whether to normalize the displayed value on blur

## Returns [`UseHtmlFieldProps`](types.md#usehtmlfieldprops)

An object containing the following properties. Causes a rerender when any of these properties changes.

- `input` - [`HtmlFieldInputProps`](types.md#htmlfieldinputprops) to pass to an `<input>` element:
  - `name` - the name of the field (the [pathstring](../concepts.md#pathstrings) of the field path)
  - `type` - the `type` from the options
  - `value` - the value to display
  - `checked` - include if `type` is `"checkbox"`
  - `onChange` - the change event handler
  - `onFocus` - the focus event handler
  - `onBlur` - the blur event handler
- `meta` - the [`UseFieldProps`](types.md#usefieldprops) for the field
