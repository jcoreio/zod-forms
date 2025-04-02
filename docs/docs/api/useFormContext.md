# `useFormContext`

React custom hook for getting the enclosing [`FormContextProps`](types#formcontextprops) provided by [`FormProvider`](createZodForm#formprovider).

```ts
import { useFormContext } from '@jcoreio/zod-forms'
```

```ts
export function useFormContext<T extends z.ZodTypeAny>(): FormContextProps<T>
```

You must pass an explicit schema type for `T` unless you use the [`useFormContext` returned by `createZodForm`](createZodForm.md#returns-zodformt).

## Returns [`FormContextProps<T>`](types#formcontextprops)

An object with the following properties:

- `schema` - the Zod schema for the form values
- `inverseSchema` - the inverse Zod schema; `inverseSchema.parse(values)` inverts parsed values to input values
- `root` - the root [`FieldPath`](FieldPath.md)
- `initialize` - method to initialize the form with initial values
- `addHandlers` - method to register submit handlers
- `removeHandlers` - method to unregister submit handlers
- `setMeta` - method to set the [`FieldMeta`](types.md#fieldmeta) of a field
- `setValue` - method to set the value of a field
- `setParsedValue` - method to set the parsed value of a field
- `submit` - method to trigger form submit
- `setSubmitStatus` - method to set the submit status
- `submitting` - whether the form is currently submitting
- `submitError` - the reason submit failed, if any
- `submitSucceeded` - whether submit succeeded
- `submitFailed` - whether submit failed
- `submittedParsedValues` - the parsed values that were submitted
- `submittedValues` - the values at submit time
- `arrayActions` - methods for manipulating array fields
  - `insertParsed` - insert a parsed value into the array
  - `insert` - insert a value into the array
  - `move` - move a value from one index to another
  - `pop` - remove the last value from the array
  - `pushParsed` - add a parsed value to the end of the array
  - `push` - add a value to the end of the array
  - `remove` - remove a value at an index
  - `removeAll` - remove all values
  - `spliceParsed` - remove and/or insert parsed values, like `Array.splice`
  - `splice` - remove and/or insert values, like `Array.splice`
  - `swap` - swap values at two indices
  - `unshiftParsed` - add a parsed value to the beginning of the array
  - `unshift` - add a value to the beginning of the array
- `getParsedValues` - get the current parsed field values
- `getValues` - get the current field values
- `getInitialParsedValues` - get the initial parsed field values
- `getInitialValues` - get the initial field values
