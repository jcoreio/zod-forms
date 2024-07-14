import z from 'zod'
import React, { HTMLInputTypeAttribute } from 'react'
import {
  createZodForm,
  FieldPath,
  useHtmlField,
  useFormStatus,
  FieldPathForRawValue,
  useField,
  useFormContext,
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
  Typography,
  List,
  ListItem,
  IconButton,
} from '@mui/material'
import { Add, Remove } from '@mui/icons-material'
import { SchemaAt } from '../src/util/SchemaAt'

const schema = z
  .object({
    trimString: z.string().trim(),
    urlString: z.string().trim().url().nullable(),
    min: z.number().finite(),
    max: z.number().finite(),
    optionalNumber: z.number().optional(),
    numberInput: z.number().optional(),
    requireMinLteMax: z.boolean().optional(),
    nested: z
      .object({ foo: z.array(z.number().optional()).optional() })
      .optional(),
    bigint: z.bigint().optional(),
    array: z
      .array(z.object({ value: z.number(), displayText: z.string() }))
      .optional(),
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

  const {
    array: { pushRaw },
  } = useFormContext<typeof schema>()

  return (
    <form onSubmit={onSubmit}>
      <Paper sx={{ maxWidth: 600, p: 2, margin: '32px auto' }}>
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
          <FormTextField
            field={form.get('optionalNumber')}
            type="tel"
            label="Optional Number"
          />
          <FormTextField field={form.get('bigint')} type="tel" label="BigInt" />
        </Box>
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
          <FormTextField
            field={form.get('nested.foo[0]')}
            type="tel"
            label="nested.foo[0]"
          />
          <FormTextField field={form.get('bigint')} type="tel" label="BigInt" />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Array</Typography>
          <IconButton onClick={() => pushRaw(form.get('array'), {} as any)}>
            <Add />
          </IconButton>
        </Box>
        <ArrayField field={form.get('array')} />
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
  field: FieldPathForRawValue<string | number | bigint | null | undefined>
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

function ArrayField({
  field,
}: {
  field: FieldPath<SchemaAt<typeof schema, ['array']>>
}) {
  const { rawValue } = useField(field)
  const {
    array: { remove },
  } = useFormContext<typeof schema>()
  return (
    <List>
      {rawValue?.map((v, index) => (
        <ListItem key={index} sx={{ pl: 0, pr: 0, alignItems: 'flex-start' }}>
          <FormTextField
            field={field.get([index, 'value'])}
            type="text"
            placeholder="Value"
          />
          <FormTextField
            field={field.get([index, 'displayText'])}
            type="text"
            placeholder="Display Text"
          />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton sx={{ mt: 1 }} onClick={() => remove(field, index)}>
            <Remove />
          </IconButton>
        </ListItem>
      ))}
    </List>
  )
}
