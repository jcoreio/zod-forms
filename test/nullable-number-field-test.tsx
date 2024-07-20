import { it } from 'mocha'
import { expect } from 'chai'
import { render, act, fireEvent } from '@testing-library/react'
import sinon from 'sinon'
import React from 'react'
import z from 'zod'
import { createZodForm, SubmitHandler, useSubmit } from '../src'
import { FormTextField } from './FormTextField'
import { FormContextProps } from '../src/FormContext'

it(`nullable number field test`, async function () {
  const schema = z.strictObject({
    field: z.number().min(-10).max(10).nullable(),
  })
  const onSubmit = sinon.spy<SubmitHandler<typeof schema>>(() => {})
  const { FormProvider, root, useInitialize, useFormContext } = createZodForm({
    schema,
  })

  let formContext: FormContextProps<typeof schema> | undefined

  const Form = () => (
    <FormProvider>
      <Form2 />
    </FormProvider>
  )

  const Form2 = () => {
    useInitialize({ values: { field: 3 } })
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
  expect(input.value).to.equal('3')

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

  await act(() => formContext?.setValue(root.get('field'), 5))
  expect(input.value).to.equal('5')
  await act(() => fireEvent.change(input, { target: { value: '-3' } }))
  expect(formContext?.getValues()).to.deep.equal({
    field: -3,
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
    validationError: undefined,
    valid: true,
    invalid: false,
    pristine: false,
    dirty: true,
  })
  await act(() => fireEvent.blur(input, { target: { value: ' ' } }))
  expect(component.queryByTestId('field-helperText')?.innerHTML).to.equal(
    undefined
  )
  await act(() => fireEvent.change(input, { target: { value: ' 3x ' } }))
  expect(component.queryByTestId('field-helperText')?.innerHTML).to.equal(
    'Invalid number'
  )
  expect(formContext?.getValues()).to.deep.equal(undefined)
  expect(formContext?.getRawValues()).to.deep.equal({ field: ' 3x ' })
  expect(input.value).to.equal(' 3x ')
  await act(() => fireEvent.blur(input, { target: { value: ' 3x ' } }))
  expect(input.value).to.equal(' 3x ')

  await act(() => fireEvent.change(input, { target: { value: ' -14 ' } }))
  expect(component.queryByTestId('field-helperText')?.innerHTML).to.equal(
    'Number must be greater than or equal to -10'
  )

  expect(formContext?.getStatus()).to.deep.equal({
    initialized: true,
    submitting: false,
    submitSucceeded: false,
    submitFailed: false,
    submitError: undefined,
    validationError: new z.ZodError([
      {
        code: z.ZodIssueCode.too_small,
        minimum: -10,
        type: 'number',
        inclusive: true,
        exact: false,
        message: 'Number must be greater than or equal to -10',
        path: ['field'],
      },
    ]),
    valid: false,
    invalid: true,
    pristine: false,
    dirty: true,
  })

  await act(() => fireEvent.change(input, { target: { value: ' -9.5 ' } }))

  expect(onSubmit.args).to.deep.equal([])
  await act(() => fireEvent.submit(form))
  expect(onSubmit.args).to.deep.equal([
    [{ field: -9.5 }, { initialValues: { field: 3 } }],
  ])

  await act(() => fireEvent.blur(input, { target: { value: ' -95e-1 ' } }))
  expect(input.value).to.equal('-9.5')

  onSubmit.resetHistory()
  await act(() => fireEvent.change(input, { target: { value: ' ' } }))
  await act(() => fireEvent.submit(form))
  expect(onSubmit.args).to.deep.equal([
    [{ field: null }, { initialValues: { field: -9.5 } }],
  ])
})
