# @jcoreio/zod-forms

A more seamless way to build React forms from Zod schemas

[![CircleCI](https://circleci.com/gh/jcoreio/zod-forms.svg?style=svg)](https://circleci.com/gh/jcoreio/zod-forms)
[![Coverage Status](https://codecov.io/gh/jcoreio/zod-forms/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/zod-forms)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/%40jcoreio%2Fzod-forms.svg)](https://badge.fury.io/js/%40jcoreio%2Fzod-forms)

# Features

- 100% typesafe - Fully typechecked paths, input and output types for deeply nested fields
- Supports `z.string().optional()`, `z.string().nullable()`, `z.number()` etc in inputs out of the box
- Interprets blank inputs as `undefined` or `null` by default, depending on what the field schema
  accepts
- Normalizes inputs on blur by default (e.g. with `z.string().blur()` you'll see the trim on blur)
- Supports Zod schemas with different input and output types (as long as you use
  `zod-invertible` to specify how to format from output back to input)
- Allows you to programmatically set either input or output values
- Each step of a wizard form can declare its own submit handler independent from the enclosing
  `<form>` element. This enables animated transitions between steps without a separate
  `<form>`s or submit button for each step.

# Limitations

- Designed specifically for Zod and React only
- Not currently focused on high performance/large form state like `final-form` or `react-hooks-form`
- No async validate outside of submit right now

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

const schema = z.object({
  url: z.string().trim().url(),
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
import { FieldPathForValue } from '@jcoreio/zod-form'

function FormInput({
  field,
  type,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  type: HTMLInputTypeAttribute
  // This ensures that only fields that accept string, null or undefined
  // as input can be passed to <FormInput>
  field: FieldPathForValue<string | null | undefined>
}) {
  // This hook is designed to provide the smoothest integration with simple <input>s.
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
        // this is how we bind <FormInput> to the `url` field
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
