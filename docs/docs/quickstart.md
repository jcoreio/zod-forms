---
sidebar_position: 0
---

# Quickstart

## Installation

```bash
pnpm i @jcoreio/zod-forms
```

or if you're using `npm`:

```bash
npm i --save @jcoreio/zod-forms
```

## Create a form schema

In this example, we'll have a `url` field that must be a valid URL.
Using `.trim()` ensures that the submitted value will be trimmed.
The displayed value will also be trimmed whenever the field is blurred.

```ts
import z from 'zod'
// `text` is like z.string(), but coerces whitespace-only values to null or undefined
import { text } from '@jcoreio/zod-form'

const schema = z.object({
  url: text.trim().url(),
})
```

## Create a form

```ts
import { createZodForm } from '@jcoreio/zod-form'

const {
  FormProvider,
  // all of the following hooks can also be imported from '@jcoreio/zod-form',
  // but the ones returned from `createZodForm` are already bound to the schema type
  useInitialize,
  useSubmit,
  useFormStatus,
  useHtmlField,
} = createZodForm({ schema })
```

## Create a field component

```ts
function FormInput({
  field,
  type,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  field: FieldPath<z.ZodType<any, any, string | null | undefined>>
  type: HTMLInputTypeAttribute
}) {
  // This hook gets the state in a convenient form for an `<input>` element.
  const { input, meta } = useHtmlField({ field, type })

  const inputRef = React.createRef<HTMLInputElement>()
  const error = meta.touched || meta.submitFailed ? meta.error : undefined
  React.useEffect(() => {
    inputRef.current?.setCustomValidity(error || '')
  }, [error])

  return (
    <input
      {...props}
      // the `input` props from `useHtmlField` are designed to be spread here
      {...input}
      ref={inputRef}
    />
  )
}
```

## Create the form component

```tsx
function MyForm() {
  return (
    // <FormProvider> wraps <MyFormContent> in a React Context through which the
    // hooks and fields access form state
    <FormProvider>
      <MyFormContent />
    </FormProvider>
  )
}

function MyFormContent() {
  // This hook initializes the form with the given values.
  // The second argument is a dependency array -- the form will be reinitialized
  // if any of the dependencies change, similar to React.useEffect.
  useInitialize({ values: { url: 'http://localhost' } }, [])

  // This hook sets your submit handler code, and returns an onSubmit handler to
  // pass to a <form>
  const onSubmit = useSubmit({
    onSubmit: async ({ url }) => {
      alert(`Submitted! url value: ${url}`)
    },
  })

  const { submitting, pristine } = useFormStatus()

  return (
    <form onSubmit={onSubmit}>
      <FormInput
        // this is how we connect <FormInput> to the `url` field
        field={myForm.get('url')}
        type="text"
        placeholder="URL"
      />
      <button disabled={pristine || submitting} type="submit">
        submit
      </button>
    </form>
  )
}
```
