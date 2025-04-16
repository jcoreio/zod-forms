import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material'
import React from 'react'
import { z } from 'zod'
import { FieldPath, useHtmlField } from '../src'

export function FormCheckboxField({
  field,
  label,
  ...props
}: React.ComponentProps<typeof Checkbox> & {
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
          control={
            <Checkbox
              {...input}
              {...props}
              inputProps={{ 'data-testid': field.pathstring } as any}
            />
          }
        />
      </FormGroup>
      {error ?
        <FormHelperText data-testid={`${field.pathstring}-helperText`}>
          {error}
        </FormHelperText>
      : null}
    </FormControl>
  )
}
