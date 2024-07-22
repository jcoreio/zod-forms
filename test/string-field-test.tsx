import { it } from 'mocha'
import { expect } from 'chai'
import { render, act, fireEvent } from '@testing-library/react'
import sinon from 'sinon'
import React from 'react'
import z from 'zod'
import { createZodForm, SubmitHandler } from '../src'
import { FormTextField } from './FormTextField'
import { FormContextProps } from '../src/FormContext'

it(`string field test`, async function () {
  const schema = z.strictObject({
    field: z.string().trim(),
  })
  const onSubmit = sinon.spy<SubmitHandler<typeof schema>>(() => {})
  const { FormProvider, root, useInitialize, useFormContext, useSubmit } =
    createZodForm({
      schema,
    })

  let formContext: FormContextProps<typeof schema> | undefined

  const Form = () => (
    <FormProvider>
      <Form2 />
    </FormProvider>
  )

  const Form2 = () => {
    useInitialize({ values: { field: 'init' } })
    formContext = useFormContext()

    return (
      <form onSubmit={useSubmit({ onSubmit })} data-testid="form">
        <FormTextField field={root.get('field')} type="text" />
      </form>
    )
  }

  const component = render(<Form />)
  const form = z
    .instanceof(HTMLFormElement)
    .parse(component.getByTestId('form'))
  const input = z
    .instanceof(HTMLInputElement)
    .parse(component.getByTestId('field'))
  expect(input.value).to.equal('init')

  expect(formContext?.getStatus()).to.deep.equal({
    initialized: true,
    submitting: false,
    submitSucceeded: false,
    submitFailed: false,
    submitError: undefined,
    validationError: undefined,
    valid: true,
    invalid: false,
    pristine: true,
    dirty: false,
  })

  await act(() => formContext?.setValue(root.get('field'), 'newValue'))
  expect(input.value).to.equal('newValue')
  await act(() =>
    fireEvent.change(input, { target: { value: 'changedValue' } })
  )
  expect(formContext?.getValues()).to.deep.equal({
    field: 'changedValue',
  })
  expect(formContext?.getStatus()).to.deep.equal({
    initialized: true,
    submitting: false,
    submitSucceeded: false,
    submitFailed: false,
    submitError: undefined,
    validationError: undefined,
    valid: true,
    invalid: false,
    pristine: false,
    dirty: true,
  })
  await act(() => fireEvent.change(input, { target: { value: ' ' } }))
  expect(component.queryByTestId('field-helperText')?.innerHTML).to.equal(
    undefined
  )
  expect(input.value).to.equal(' ')

  expect(formContext?.getStatus()).to.deep.equal({
    initialized: true,
    submitting: false,
    submitSucceeded: false,
    submitFailed: false,
    submitError: undefined,
    validationError: new z.ZodError([
      {
        code: z.ZodIssueCode.invalid_type,
        expected: 'string',
        received: 'undefined',
        path: ['field'],
        message: 'Required',
      },
    ]),
    valid: false,
    invalid: true,
    pristine: false,
    dirty: true,
  })
  await act(() => fireEvent.blur(input, { target: { value: ' ' } }))
  expect(component.queryByTestId('field-helperText')?.innerHTML).to.equal(
    'Required'
  )
  await act(() => fireEvent.change(input, { target: { value: ' x ' } }))
  expect(component.queryByTestId('field-helperText')?.innerHTML).to.equal(
    undefined
  )
  expect(formContext?.getValues()).to.deep.equal({ field: 'x' })
  expect(formContext?.getRawValues()).to.deep.equal({ field: ' x ' })
  expect(input.value).to.equal(' x ')
  await act(() => fireEvent.blur(input, { target: { value: ' x ' } }))
  expect(input.value).to.equal('x')

  expect(formContext?.getStatus()).to.deep.equal({
    initialized: true,
    submitting: false,
    submitSucceeded: false,
    submitFailed: false,
    submitError: undefined,
    validationError: undefined,
    valid: true,
    invalid: false,
    pristine: false,
    dirty: true,
  })

  expect(onSubmit.args).to.deep.equal([])
  await act(() => fireEvent.submit(form))
  expect(onSubmit.args).to.deep.equal([
    [{ field: 'x' }, { initialValues: { field: 'init' } }],
  ])
})
