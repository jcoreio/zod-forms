import z from 'zod'
import React, { HTMLInputTypeAttribute } from 'react'
import {
  createZodForm,
  FieldPath,
  useHtmlField,
  useFormStatus,
  numberFromText,
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

const schema = z
  .object({
    trimString: z.string().trim(),
    urlString: z.string().trim().url().nullable(),
    min: numberFromText.finite(),
    max: numberFromText.finite(),
    optionalNumber: z.number().optional(),
    numberInput: z.number().optional(),
    requireMinLteMax: z.boolean().optional(),
    nested: z.object({ foo: numberFromText.optional() }).optional(),
    bigint: z.bigint().optional(),
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
    () => ({
      trimString: 'trim',
      urlString: null,
      min: 5,
      max: 10,
      requireMinLteMax: true,
    }),
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
        <FormTextField
          field={form.get('optionalNumber')}
          type="tel"
          label="Optional Number"
        />
        <FormTextField field={form.get('bigint')} type="tel" label="BigInt" />
        <Box sx={{ mt: 2 }}>
          <FormTextField
            field={form.get('numberInput')}
            type="number"
            label='type="number"'
          />
          <FormTextField
            field={form.get('numberInput')}
            type="text"
            label='inputmode="numeric"'
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
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
  field: FieldPath<
    z.ZodType<any, any, string | number | bigint | null | undefined>
  >
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
