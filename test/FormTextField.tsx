import React, { HTMLInputTypeAttribute } from 'react'
import { TextField } from '@mui/material'
import { FieldPathForRawValue, useHtmlField } from '../src'

export function FormTextField({
  field,
  type,
  ...props
}: {
  field: FieldPathForRawValue<number | bigint | string | null | undefined>
  type: HTMLInputTypeAttribute
} & Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  const { input, meta } = useHtmlField({ field, type })

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
