import { it } from 'mocha'
import { expect } from 'chai'
import { render } from '@testing-library/react'
import sinon from 'sinon'
import React from 'react'
import z from 'zod'
import { createZodForm, SubmitHandler } from '../src'
import { FormTextField } from './FormTextField'
import { FormContextProps } from '../src/FormContext'

it(`useInitialize test`, async function () {
  const schema = z.strictObject({
    field: z.string().trim(),
  })
  const onSubmit = sinon.spy<SubmitHandler<typeof schema>>(() => {})
  const {
    FormProvider,
    root,
    useInitialize,
    useFormContext,
    useSubmit,
    useFormStatus,
  } = createZodForm({
    schema,
  })

  let formContext: FormContextProps<typeof schema> | undefined

  const Form = ({ data }: { data?: z.input<typeof schema> }) => (
    <FormProvider>
      <Form2 data={data} />
    </FormProvider>
  )

  const Form2 = ({ data }: { data?: z.input<typeof schema> }) => {
    useInitialize({ values: data })
    formContext = useFormContext()
    const { initialized } = useFormStatus()

    return (
      <form
        onSubmit={useSubmit({ onSubmit })}
        data-testid="form"
        data-initialized={initialized}
      >
        <FormTextField field={root.get('field')} type="text" />
      </form>
    )
  }

  const component = render(<Form />)
  const form = component.getByTestId('form')
  const input = z
    .instanceof(HTMLInputElement)
    .parse(component.getByTestId('field'))
  expect(form.getAttribute('data-initialized')).to.equal('false')
  expect(input.value).to.equal('')

  expect(formContext?.getStatus()).to.deep.equal({
    initialized: false,
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

  component.rerender(<Form data={{ field: 'foo' }} />)

  expect(form.getAttribute('data-initialized')).to.equal('true')
  expect(input.value).to.equal('foo')
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
})
