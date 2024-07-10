import z from 'zod'
import React, { HTMLInputTypeAttribute } from 'react'
import { invertible } from 'zod-invertible'
import { createZodForm } from '../src/createZodForm'
import { Paper, TextField } from '@mui/material'
import { FieldPath } from '../src/FieldPath'
import { useFormContext } from '../src/useFormContext'

const NumberSchema = invertible(
  z.string(),
  (s: string, ctx: z.RefinementCtx): number => {
    if (!s?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'is required',
      })
      return NaN
    }
    const num = Number(s)
    if (!Number.isFinite(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invalid number',
      })
    }
    return num
  },
  z.number().finite(),
  (n) => String(n)
)

const schema = z
  .strictObject({
    min: NumberSchema,
    max: NumberSchema,
    bool: z.boolean().optional(),
  })
  .superRefine((obj, ctx) => {
    if (obj.min != null && obj.max != null && obj.min > obj.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [...ctx.path, 'min'],
        message: 'must be <= max',
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [...ctx.path, 'max'],
        message: 'must be >= min',
      })
    }
  })

const form = createZodForm({
  schema,
})

export default function App() {
  const { FormProvider } = form
  return (
    <FormProvider>
      <App2 />
    </FormProvider>
  )
}

function App2() {
  const { initialize } = form.useFormContext()
  React.useEffect(() => {
    initialize({ values: { min: 5, max: 10 } })
  }, [])
  return (
    <Paper sx={{ width: 600, p: 2 }}>
      <FormTextField
        field={form.get('min')}
        type="text"
        label="Min"
        normalizeOnBlur
      />
      <FormTextField
        field={form.get('max')}
        type="text"
        label="Max"
        normalizeOnBlur
      />
    </Paper>
  )
}

function FormTextField({
  field,
  type,
  normalizeOnBlur,
  ...props
}: Omit<React.ComponentProps<typeof TextField>, 'type'> & {
  type: HTMLInputTypeAttribute
  normalizeOnBlur?: boolean
  field: FieldPath<z.ZodType<any, any, string | null | undefined>>
}) {
  const { useHtmlField } = useFormContext()
  const fieldProps = useHtmlField({ field, type, normalizeOnBlur })
  return (
    <TextField
      {...fieldProps.input}
      error={fieldProps.meta.error != null}
      helperText={fieldProps.meta.error}
      {...props}
    />
  )
}
