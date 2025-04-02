import { it } from 'mocha'
import { expect } from 'chai'
import { render, act, fireEvent } from '@testing-library/react'
import sinon from 'sinon'
import React from 'react'
import z from 'zod'
import { createZodForm, SubmitHandler } from '../src'
import { FormContextProps } from '../src/FormContext'
import { FormCheckboxField } from './FormCheckboxField'

it(`boolean field test`, async function () {
  const schema = z.strictObject({
    field: z.boolean(),
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
    useInitialize({ parsedValues: { field: false } })
    formContext = useFormContext()

    return (
      <form onSubmit={useSubmit({ onSubmit })} data-testid="form">
        <FormCheckboxField field={root.get('field')} />
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
  expect(input.name).to.equal('field')
  expect(input.checked).to.equal(false)

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

  await act(() => formContext?.setParsedValue(root.get('field'), true))
  expect(input.checked).to.equal(true)
  await act(() => fireEvent.click(input))
  expect(formContext?.getParsedValues()).to.deep.equal({ field: false })
  await act(() => fireEvent.click(input))
  expect(formContext?.getParsedValues()).to.deep.equal({ field: true })
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
  await act(() => formContext?.setValue(root.get('field'), undefined as any))
  expect(formContext?.getStatus()).to.deep.equal({
    initialized: true,
    submitting: false,
    submitSucceeded: false,
    submitFailed: false,
    submitError: undefined,
    validationError: new z.ZodError([
      {
        code: z.ZodIssueCode.invalid_type,
        expected: 'boolean',
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
  expect(component.queryByTestId('field-helperText')?.innerHTML).to.equal(
    undefined
  )
  await act(() => fireEvent.blur(input, { target: { value: '' } }))
  await act(() => formContext?.setValue(root.get('field'), undefined as any))
  expect(component.queryByTestId('field-helperText')?.innerHTML).to.equal(
    'Required'
  )
  await act(() => fireEvent.click(input))
  expect(formContext?.getParsedValues()).to.deep.equal({ field: true })

  await act(() => fireEvent.submit(form))
  expect(onSubmit.args).to.deep.equal([
    [
      { field: true },
      {
        initialParsedValues: { field: false },
        initialValues: { field: false },
      },
    ],
  ])
})
