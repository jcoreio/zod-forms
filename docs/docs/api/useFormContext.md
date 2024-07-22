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
- `inverseSchema` - the inverse Zod schema; `inverseSchema.parse(values)` formats to raw values
- `root` - the root [`FieldPath`](FieldPath.md)
- `initialize` - method to initialize the form with initial values
- `addHandlers` - method to register submit handlers
- `removeHandlers` - method to unregister submit handlers
- `setMeta` - method to set the [`FieldMeta`](types.md#fieldmeta) of a field
- `setRawValue` - method to set the raw value of a field
- `setValue` - method to set the value of a field
- `submit` - method to trigger form submit
- `setSubmitStatus` - method to set the submit status
- `submitting` - whether the form is currently submitting
- `submitError` - the reason submit failed, if any
- `submitSucceeded` - whether submit succeeded
- `submitFailed` - whether submit failed
- `submittedValues` - the values that were submitted
- `rawSubmittedValues` - the raw values at submit time
- `arrayActions` - methods for manipulating array fields
  - `insert` - insert a value into the array
  - `insertRaw` - insert a raw value into the array
  - `move` - move a value from one index to another
  - `pop` - remove the last value from the array
  - `push` - add a value to the end of the array
  - `pushRaw` - add a raw value to the end of the array
  - `remove` - remove a value at an index
  - `removeAll` - remove all values
  - `splice` - remove and/or insert values, like `Array.splice`
  - `spliceRaw` - remove and/or insert raw values, like `Array.splice`
  - `swap` - swap values at two indices
  - `unshift` - add a value to the beginning of the array
  - `unshiftRaw` - add a raw value to the beginning of the array
- `getValues` - get the current field values
- `getRawValues` - get the current raw field values
- `getInitialValues` - get the initial field values
- `getRawInitialValues` - get the raw initial field values
