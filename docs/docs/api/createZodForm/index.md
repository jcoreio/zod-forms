# `createZodForm`

Creates a form for a Zod schema

```ts
import { createZodForm } from '@jcoreio/zod-form'
```

```ts
createZodForm<T extends ZodTypeAny>(options: { schema: T }): ZodForm<T>
```

## Requirements

If you want to use `.transform`s in `schema`, you must declare them via
[`zod-invertible`](https://github.com/jcoreio/zod-invertible) so that it's possible
to format final values into raw values; otherwise `createZodForm` will throw an error.

## Returns [`ZodForm<T>`](../types/ZodForm.md)

An object with the following properties:

- [`root`](root) - the root [`FieldPath`](../FieldPath.md)
- [`get`](get) - shortcut for [`root`](./root.md)[`.get(...)`](../FieldPath.md#getpath)
- [`FormProvider`](FormProvider) - React component to provide form context to its descendants
- [`useFormContext`](../useFormContext.md) bound to schema type `T`
- [`useFormStatus`](../useFormStatus.md) bound to schema type `T`
- [`useFormValues`](../useFormValues.md) bound to schema type `T`
- [`useInitialize`](../useInitialize.md) bound to schema type `T`
- [`useSubmit`](../useSubmit.md) bound to schema type `T`
- [`useArrayField`](../useArrayField.md) bound to schema type `T`
- [`useField`](../useField.md) bound to schema type `T`
- [`useHtmlField`](../useHtmlField.md) bound to schema type `T`
