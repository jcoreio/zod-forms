# `root`

The root [`FieldPath`](../FieldPath.md). For example if your schema is an object
containing the property `foo`, `root` points to the object, and `root.get('foo')` gets
a `FieldPath` pointing to the `foo` property.

```ts
const { root } = createZodForm({ schema })
```
