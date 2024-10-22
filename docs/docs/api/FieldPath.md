# `FieldPath`

Encapsulates a path to a field in a form and the schema at that path.

```ts
import { FieldPath } from '@jcoreio/zod-forms'
```

```ts
class FieldPath<T extends z.ZodTypeAny = z.ZodTypeAny>
```

### `path: (string | number)[]`

The array representation of this path

### `pathstring: string`

The string representation of this path

### `schema: T`

The Zod schema at this path

### `get(path): FieldPath`

Gets a subpath under this `FieldPath`. `path` may either be a [pathstring](../concepts.md#pathstrings) or a [path array](../concepts.md#path-arrays).

The full method signature (not shown here) is fully typed and extracts the type of the subschema at
the given path, and should produce a TS error if the path is invalid or doesn't exist in [`schema`](#schema-t).
