import z from 'zod'
import React, { HTMLInputTypeAttribute } from 'react'
import {
  createZodForm,
  FieldPath,
  useHtmlField,
  useFormStatus,
  FieldPathForValue,
  useFormContext,
  useArrayField,
  conditionalValidate,
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
  FormLabel,
  SxProps,
} from '@mui/material'
import { Add, Remove } from '@mui/icons-material'
import { SchemaAt } from '../src/util/SchemaAt'

const schema = conditionalValidate(
  z.object({
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
    numberEnum: z.union([z.literal(1), z.literal(2), z.literal(4)]).optional(),
  })
).conditionalRefine(
  (s) => s.pick({ min: true, max: true, requireMinLteMax: true }),
  ({ min, max, requireMinLteMax }) => !requireMinLteMax || min < max,
  [
    { path: ['min'], message: 'must be <= max' },
    { path: ['max'], message: 'must be >= min' },
  ]
)

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

  // const { submitting, pristine } = useFormStatus()

  const {
    arrayActions: { push },
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
        <Box sx={{ mt: 2 }}>
          <FormSelectField field={form.get('numberEnum')} label="Number Enum">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="4">Four</option>
          </FormSelectField>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Array</Typography>
          <IconButton onClick={() => push(form.get('array'), {})}>
            <Add />
          </IconButton>
        </Box>
        <ArrayField field={form.get('array')} />
        <Box sx={{ mt: 2 }}>
          <SubmitButton />
        </Box>
      </Paper>
    </form>
  )
}

const SubmitButton = React.memo(function SubmitButton() {
  const { pristine, submitting } = useFormStatus()
  return (
    <Button disabled={pristine || submitting} type="submit">
      Submit
    </Button>
  )
})

const FormTextField = React.memo(function FormTextField({
  field,
  type,
  ...props
}: Omit<React.ComponentProps<typeof TextField>, 'type'> & {
  type: HTMLInputTypeAttribute
  field: FieldPathForValue<string | number | bigint | null | undefined>
}) {
  const { input, meta } = useHtmlField({ field, type })
  const error = meta.touched ? meta.error : undefined
  return (
    <TextField {...input} error={error != null} helperText={error} {...props} />
  )
})

const FormSelectField = React.memo(function FormSelectField({
  field,
  sx,
  label,
  children,
  ...props
}: Omit<React.ComponentProps<'select'>, 'type'> & {
  sx?: SxProps
  label?: React.ReactNode
  field: FieldPathForValue<string | number | bigint | null | undefined>
}) {
  const { input, meta } = useHtmlField({ field, type: 'text' })
  const error = meta.touched ? meta.error : undefined
  return (
    <FormControl sx={sx} error={error != null}>
      <FormLabel sx={{ display: 'flex', flexDirection: 'column' }}>
        {label}
        <select {...input} {...props}>
          {children}
        </select>
      </FormLabel>
      {error ?
        <FormHelperText>{error}</FormHelperText>
      : undefined}
    </FormControl>
  )
})

const FormSwitchField = React.memo(function FormSwitchField({
  field,
  label,
  ...props
}: React.ComponentProps<typeof Switch> & {
  field: FieldPathForValue<boolean | null | undefined>
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
      {error ?
        <FormHelperText>{error}</FormHelperText>
      : null}
    </FormControl>
  )
})

const ArrayField = React.memo(function ArrayField({
  field,
}: {
  field: FieldPath<SchemaAt<typeof schema, ['array']>>
}) {
  const { elements, remove } = useArrayField(field)
  return (
    <List>
      {elements.map((element, index) => (
        <ListItem key={index} sx={{ pl: 0, pr: 0, alignItems: 'flex-start' }}>
          <FormTextField
            field={element.get('value')}
            type="text"
            placeholder="Value"
          />
          <FormTextField
            field={element.get('displayText')}
            type="text"
            placeholder="Display Text"
          />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton sx={{ mt: 1 }} onClick={() => remove(index)}>
            <Remove />
          </IconButton>
        </ListItem>
      ))}
    </List>
  )
})
