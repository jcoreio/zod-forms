import z from 'zod'
import React, { HTMLInputTypeAttribute } from 'react'
import { invertible } from 'zod-invertible'
import { createZodForm } from '../src/createZodForm'
import {
  Paper,
  TextField,
  Switch,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Box,
  Button,
} from '@mui/material'
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
  .object({
    trimString: z.string().trim(),
    urlString: z.string().trim().url().optional(),
    min: NumberSchema,
    max: NumberSchema,
    requireMinLteMax: z.boolean().optional(),
  })
  .superRefine((obj, ctx) => {
    if (
      obj.requireMinLteMax &&
      obj.min != null &&
      obj.max != null &&
      obj.min > obj.max
    ) {
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
  const initialValues = React.useMemo(
    () => ({ trimString: '', min: 5, max: 10, requireMinLteMax: true }),
    []
  )
  form.useInitialize({ values: initialValues })

  const onSubmit = form.useSubmit({
    onSubmit: async (values) => {
      // eslint-disable-next-line no-console
      console.log('onSubmit', values)
      await new Promise<void>((r) => setTimeout(r, 1000))
    },
    onSubmitSucceeded: () => {
      // eslint-disable-next-line no-console
      console.log('onSubmitSucceeded')
    },
    onSubmitFailed: (error) => {
      // eslint-disable-next-line no-console
      console.error('onSubmitFailed', error)
    },
  })

  return (
    <form onSubmit={onSubmit}>
      <Paper sx={{ width: 600, p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <FormTextField
            field={form.get('trimString')}
            type="text"
            label="Trimmed string"
            normalizeOnBlur
          />
          <FormTextField
            field={form.get('urlString')}
            type="text"
            label="URL"
            normalizeOnBlur
          />
        </Box>
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
        <Box sx={{ mt: 2 }}>
          <FormSwitchField
            label="Require min <= max"
            field={form.get('requireMinLteMax')}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button type="submit">Submit</Button>
        </Box>
      </Paper>
    </form>
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
  const { input, meta } = useHtmlField({ field, type, normalizeOnBlur })
  const error = meta.touched ? meta.error : undefined
  return (
    <TextField {...input} error={error != null} helperText={error} {...props} />
  )
}

function FormSwitchField({
  field,
  label,
  ...props
}: React.ComponentProps<typeof Switch> & {
  field: FieldPath<z.ZodType<any, any, boolean | null | undefined>>
  label?: React.ReactNode
}) {
  const { useHtmlField } = useFormContext()
  const { input, meta } = useHtmlField({ field, type: 'checkbox' })
  const error = meta.touched ? meta.error : undefined
  return (
    <FormControl error={error != null}>
      <FormGroup>
        <FormControlLabel
          label={label}
          control={<Switch {...input} {...props} />}
        />
      </FormGroup>
      {error ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  )
}
