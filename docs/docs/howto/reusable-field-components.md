# Reusable Field Components

## Wiring Fields via Props

To use the same React component to render multiple fields in the same form or in different forms in a
typesafe manner, pass `FieldPath`(s) to your component via props.

For example, suppose you want to make a reusable `DateTimeField` component that operates on date and time
fields:

```tsx
import { useField } from '@jcoreio/zod-forms'

const DateTimeField({
  fields: { date, time }
}: {
  fields: {
    date: FieldPathForParsedValue<Date | null | undefined, string | null | undefined>,
    time: FieldPathForParsedValue<Date | null | undefined, string | null | undefined>,
  }
}) {
  const dateProps = useField(fields.date)
  const timeProps = useField(fields.time)

  return (
    <div className="dateTimeField">
      <DateInput {...dateProps} />
      <TimeInput {...timeProps} />
    </div>
  )
}
```

Then when rendering the field:

```tsx
import { createZodForm } from '@jcoreio/zod-forms'
import z from 'zod'
import { invertible } from 'zod-invertible'

const form = createZodForm({
  schema: z.object({
    date: ...,
    time: ...,
  }),
})

function MyFormContext() {
  return (
    <DateTimeField
      fields={{ date: form.get('date'), time: form.get('time') }}
    />
  )
}
```

## Reusable Form Sections

If you want to render fields in one component that are typically grouped together, like address fields,
you can use a single `FieldPath` prop to specify the form section, and get subpaths from it:

```tsx
import { type FieldPathForValue } from '@jcoreio/zod-forms'

function AddressFields({
  section,
}: {
  section: FieldPathForValue<{
    line1: string
    line2: string | null | undefined
    city: string
    state: string
    postalCode: string
  }>
}) {
  return (
    <>
      <FormTextField label="Line 1" type="text" field={section.get('line1')} />
      <FormTextField label="Line 2" type="text" field={section.get('line2')} />
      <FormTextField label="City" type="text" field={section.get('city')} />
      <FormTextField
        label="State"
        type="text"
        field={section.get('state')}
        select
      >
        {stateOptions}
      </FormTextField>
      <FormTextField
        label="postalCode"
        type="text"
        field={section.get('postalCode')}
      />
    </>
  )
}
```

And you would use the component like so:

```tsx
import { createZodForm } from '@jcoreio/zod-forms'
import z from 'zod'
import { invertible } from 'zod-invertible'

const userProfileForm = createZodForm({
  schema: z.object({
    name: z.string(),
    address: z.object({
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
    }),
  }),
})

function UserProfileFormContent() {
  return <>
    <FormTextField label="Name" type="text" field={userProfileForm.get('name')}>
    <AddressFields section={userProfileForm.get('address')} />
  </>
}
```
