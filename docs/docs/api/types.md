# Typescript Types

## `FieldMeta`

```ts
export type FieldMeta = {
  touched: boolean
  visited: boolean
}
```

## `FieldPathForValue<Value>`

Type for a [`FieldPath`](FieldPath.md) where the value type must extend `Value`.
This is useful for typing a property in a custom component; for example,
in a component that renders a checkbox, you could use

```ts
type Props = {
  field: FieldPathForValue<boolean | null | undefined>
}
```

## `FieldPathForParsedValue<ParsedValue, Value = any>`

Type for a [`FieldPath`](FieldPath.md) where value type must extend `Value` and the
parsed value type must extend `ParsedValue`.

## `FormContextProps`

```ts
export type FormContextProps<T extends z.ZodTypeAny> = {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
  root: FieldPath<T>
  initialize: (options: {
    values?: DeepPartial<z.input<T>>
    parsedValues?: z.output<T>
    keepSubmitSucceeded?: boolean
  }) => void
  addHandlers: (handlers: {
    onSubmit?: SubmitHandler<T>
    onSubmitSucceeded?: SubmitSuccededHandler
    onSubmitFailed?: SubmitFailedHandler
  }) => void
  removeHandlers: (handlers: {
    onSubmit?: SubmitHandler<T>
    onSubmitSucceeded?: SubmitSuccededHandler
    onSubmitFailed?: SubmitFailedHandler
  }) => void
  setMeta: <Field extends FieldPath>(
    field: Field,
    meta: Partial<FieldMeta>
  ) => void
  setValue: <Field extends FieldPath>(
    field: Field,
    value: DeepPartial<z.input<Field['schema']>>
  ) => void
  setParsedValue: <Field extends FieldPath>(
    field: Field,
    value: z.output<Field['schema']>,
    options?: {
      normalize?: boolean
    }
  ) => void
  submit: () => void
  setSubmitStatus: (options: {
    submitting?: boolean
    submitError?: Error
    submitSucceeded?: boolean
    submitFailed?: boolean
    submittedParsedValues?: z.output<T>
    submittedValues?: z.input<T>
  }) => void
  arrayActions: {
    insert: <Field extends ArrayFieldPath>(
      field: Field,
      index: number,
      value: ValueFor<Field>
    ) => void
    insertParsed: <Field extends ArrayFieldPath>(
      field: Field,
      index: number,
      parsedValue: ParsedValueFor<Field>
    ) => void
    move: (field: ArrayFieldPath, from: number, to: number) => void
    pop: (field: ArrayFieldPath) => void
    push: <Field extends ArrayFieldPath>(
      field: Field,
      value: ValueFor<Field>
    ) => void
    pushParsed: <Field extends ArrayFieldPath>(
      field: Field,
      parsedValue: ParsedValueFor<Field>
    ) => void
    remove: <Field extends ArrayFieldPath>(field: Field, index: number) => void
    removeAll: (field: ArrayFieldPath) => void
    shift: (field: ArrayFieldPath) => void
    splice: <Field extends ArrayFieldPath>(
      field: Field,
      index: number,
      deleteCount: number,
      ...values: ValueFor<Field>[]
    ) => void
    spliceParsed: <Field extends ArrayFieldPath>(
      field: Field,
      index: number,
      deleteCount: number,
      ...parsedValues: ParsedValueFor<Field>[]
    ) => void
    swap: (field: ArrayFieldPath, indexA: number, indexB: number) => void
    unshift: <Field extends ArrayFieldPath>(
      field: Field,
      value: ValueFor<Field>
    ) => void
    unshiftParsed: <Field extends ArrayFieldPath>(
      field: Field,
      parsedValue: ParsedValueFor<Field>
    ) => void
  }
  getValues: () => DeepPartial<z.input<T>> | undefined
  getParsedValues: () => DeepPartial<z.output<T>> | undefined
  getInitialValues: () => DeepPartial<z.input<T>> | undefined
  getInitialParsedValues: () => DeepPartial<z.output<T>> | undefined
}
```

## `FormStatus`

```ts
export type FormStatus = {
  initialized: boolean
  submitting: boolean
  submitSucceeded: boolean
  submitFailed: boolean
  submitError: boolean
  valididationError: Error | undefined
  valid: boolean
  invalid: boolean
  pristine: boolean
  dirty: boolean
}
```

## `HtmlFieldInputProps`

```ts
export type HtmlFieldInputProps = {
  name: string
  type: HTMLInputTypeAttribute
  value: string
  checked?: boolean
  onChange: React.ChangeEventHandler
  onFocus: React.FocusEventHandler
  onBlur: React.FocusEventHandler
}
```

## `SubmitFailedHandler`

```ts
export type SubmitFailedHandler = (error: Error) => void
```

## `SubmitHandler`

```ts
export type SubmitHandler<T extends z.ZodTypeAny> = (
  parsedValues: z.output<T>,
  options: {
    initialValues?: DeepPartial<z.input<T>>
    initialParsedValues?: DeepPartial<z.output<T>>
  }
) => void | Promise<void>
```

## `SubmitSuccededHandler`

```ts
export type SubmitSuccededHandler = () => void
```

## `TypedUseArrayField`

```ts
export interface TypedUseArrayField<T extends z.ZodTypeAny> {
  <Field extends FieldPathForValue<any[] | null | undefined>>(
    field: Field
  ): UseArrayFieldProps<Field>
  <Path extends PathInSchema<T>>(path: Path): UseArrayFieldProps<
    FieldPath<SchemaAt<T, Path>>
  >
  <Pathstring extends PathstringInSchema<T>>(
    path: Pathstring
  ): UseArrayFieldProps<FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>>
}
```

## `TypedUseField`

```ts
export interface TypedUseField<T extends z.ZodTypeAny> {
  <Field extends FieldPath>(field: Field): UseFieldProps<Field>
  <Path extends PathInSchema<T>>(path: Path): UseFieldProps<
    FieldPath<SchemaAt<T, Path>>
  >
  <Pathstring extends PathstringInSchema<T>>(path: Pathstring): UseFieldProps<
    FieldPath<SchemaAt<T, parsePathstring<Pathstring>>>
  >
}
```

## `TypedUseHtmlField`

```ts
export interface TypedUseHtmlField<T extends z.ZodTypeAny> {
  <Field extends FieldPath>(
    options: UseHtmlFieldOptions<Field, Field['schema']>
  ): UseHtmlFieldProps<Field>
  <Path extends PathInSchema<T>>(
    options: UseHtmlFieldOptions<Path, SchemaAt<T, Path>>
  ): UseHtmlFieldProps<FieldPath<SchemaAt<T, Path>>>
  <Path extends PathstringInSchema<T>>(
    options: UseHtmlFieldOptions<Path, SchemaAt<T, parsePathstring<Path>>>
  ): UseHtmlFieldProps<FieldPath<SchemaAt<T, parsePathstring<Path>>>>
}
```

## `UseArrayFieldProps`

```ts
export type UseArrayFieldProps<Field extends FieldPath> = NonNullable<
  z.input<Field['schema']>
> extends any[]
  ? FieldMeta & {
      setMeta: (meta: Partial<FieldMeta>) => void
      setParsedValue: (parsedValue: z.output<Field['schema']>) => void
      setValue: (
        value: DeepPartial<z.input<Field['schema']>>,
        options?: {
          normalize?: boolean
        }
      ) => void
      elements: FieldPath<SchemaAt<Field['schema'], [number]>>[]
      error?: string
      dirty: boolean
      pristine: boolean
      valid: boolean
      invalid: boolean
    }
  : { ERROR: 'not an array field' }
```

## `UseFieldProps`

```ts
export type UseFieldProps<Field extends FieldPath> = FieldMeta & {
  setMeta: (meta: Partial<FieldMeta>) => void
  setParsedValue: (parsedValue: z.output<Field['schema']>) => void
  setValue: (
    value: DeepPartial<z.input<Field['schema']>>,
    options?: {
      normalize?: boolean
    }
  ) => void
  value: DeepPartial<z.input<Field['schema']>> | undefined
  parsedValue: DeepPartial<z.output<Field['schema']>> | undefined
  initialValue: DeepPartial<z.input<Field['schema']>> | undefined
  initialParsedValue: DeepPartial<z.output<Field['schema']>> | undefined
  error?: string
  dirty: boolean
  pristine: boolean
  valid: boolean
  invalid: boolean
}
```

## `UseHtmlFieldOptions`

```ts
export type UseHtmlFieldOptions<
  Field,
  Schema extends z.ZodTypeAny = Field extends FieldPath<infer S>
    ? S
    : z.ZodTypeAny
> = {
  field: Field
  type: z.input<Schema> extends boolean | null | undefined
    ? 'checkbox'
    : Exclude<HTMLInputTypeAttribute, 'checkbox'>
  normalizeOnBlur?: boolean
}
```

## `UseHtmlFieldProps`

```ts
export type UseHtmlFieldProps<Field extends FieldPath> = z.input<
  Field['schema']
> extends string | number | bigint | boolean | null | undefined
  ? {
      input: HtmlFieldInputProps
      meta: UseFieldProps<Field>
    }
  : {
      ERROR: 'field schema input must be a nullish string, number, boolean or bigint'
    }
```

## `ValidUseHtmlFieldProps`

```ts
export type ValidUseHtmlFieldProps<Field extends FieldPath> = {
  input: HtmlFieldInputProps
  meta: UseFieldProps<Field>
}
```

## `ZodForm`

```ts
export type ZodForm<T> = {
  root: FieldPath<T>
  get: FieldPath<T>['get']
  FormProvider: React.ComponentType<{ children: JSX.Element }>
  useFormStatus: () => FormStatus
  useFormValues: () => {
    values: DeepPartial<z.input<T>> | undefined
    parsedValues: DeepPartial<z.output<T>> | undefined
    initialValues: DeepPartial<z.input<T>> | undefined
    initialParsedValues: DeepPartial<z.output<T>> | undefined
  }
  useInitialize: (
    options: {
      values?: DeepPartial<z.input<T>>
      parsedValues?: z.output<T>
      keepSubmitSucceeded?: boolean
    },
    deps: DependencyList = [options.values, options.parsedValues]
  ) => void
  useSubmit: (handlers: {
    onSubmit?: SubmitHandler<T>
    onSubmitSucceeded?: SubmitSuccededHandler
    onSubmitFailed?: SubmitFailedHandler
  }) => React.FormEventHandler
  useArrayField: TypedUseArrayField<T>
  useField: TypedUseField<T>
  useHtmlField: TypedUseHtmlField<T>
}
```
