import z from 'zod'
import React, { HTMLInputTypeAttribute } from 'react'
import { invertible } from 'zod-invertible'
import {
  createZodForm,
  FieldPath,
  useHtmlField,
  useFormStatus,
} from '../src/index'
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

const blankTo = (blankValue = undefined) =>
  invertible(
    z.any().optional(),
    (s) => (typeof s === 'string' && !s.trim() ? blankValue : s),
    z.any().nullish(),
    (s) => s
  )

const toNumber = invertible(
  z.string().nullish(),
  (s, ctx) => {
    if (!s?.trim()) return s == null ? s : undefined
    const num = Number(s)
    if (isNaN(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invalid number',
      })
    }
    return num
  },
  z.number().nullish(),
  (n) => (n == null ? n : String(n))
)
const schema = z
  .object({
    trimString: z.string().trim(),
    urlString: blankTo(undefined).pipe(z.string().trim().url().optional()),
    min: z
      .string()
      .optional()
      .pipe(blankTo(undefined))
      .pipe(toNumber)
      .pipe(z.number().finite()),
    max: z
      .string()
      .optional()
      .pipe(blankTo(undefined))
      .pipe(toNumber)
      .pipe(z.number().finite()),
    requireMinLteMax: z.boolean().optional(),
    nested: z.object({ foo: z.number().optional() }).optional(),
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

  const { submitting, pristine } = useFormStatus()

  return (
    <form onSubmit={onSubmit}>
      <Paper sx={{ width: 600, p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <FormTextField
            field={form.get('trimString')}
            type="text"
            label="Trimmed string"
          />
          <FormTextField
            field={form.get('urlString')}
            type="text"
            label="URL"
          />
        </Box>
        <FormTextField field={form.get('min')} type="text" label="Min" />
        <FormTextField field={form.get('max')} type="text" label="Max" />
        <Box sx={{ mt: 2 }}>
          <FormSwitchField
            label="Require min <= max"
            field={form.get('requireMinLteMax')}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button disabled={pristine || submitting} type="submit">
            Submit
          </Button>
        </Box>
      </Paper>
    </form>
  )
}

function FormTextField({
  field,
  type,
  ...props
}: Omit<React.ComponentProps<typeof TextField>, 'type'> & {
  type: HTMLInputTypeAttribute
  field: FieldPath<z.ZodType<any, any, string | null | undefined>>
}) {
  const { input, meta } = useHtmlField({ field, type })
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
