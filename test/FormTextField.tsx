import React, { HTMLInputTypeAttribute } from 'react'
import { TextField } from '@mui/material'
import { FieldPathForValue, useHtmlField } from '../src'

export function FormTextField({
  field,
  type,
  normalizeOnMount,
  normalizeOnBlur,
  ...props
}: {
  field: FieldPathForValue<number | bigint | string | null | undefined>
  type: HTMLInputTypeAttribute
  normalizeOnMount?: boolean
  normalizeOnBlur?: boolean
} & Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  const { input, meta } = useHtmlField({
    field,
    type,
    normalizeOnMount,
    normalizeOnBlur,
  })

  const error = meta.touched ? meta.error : undefined
  return (
    <TextField
      {...input}
      {...props}
      inputProps={{ 'data-testid': field.pathstring, ...props.inputProps }}
      FormHelperTextProps={
        { 'data-testid': `${field.pathstring}-helperText` } as any
      }
      error={error != null}
      helperText={error}
    />
  )
}
