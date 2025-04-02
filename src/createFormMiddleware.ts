import { Dispatch, Middleware } from 'redux'
import z from 'zod'
import { FormAction } from './FormAction'
import { FormState } from './FormState'
import { SubmitAction } from './actions/submit'
import { setSubmitStatus } from './actions/setSubmitStatus'
import { submitSucceeded } from './actions/submitSucceeded'

export function createFormMiddleware<T extends z.ZodTypeAny>(): Middleware<
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  FormState<T>,
  Dispatch<FormAction<T>>
> {
  return (store) => (next) => (action) => {
    const result: FormState<T> = next(action) as any

    const nextState = store.getState()

    if (isSubmitAction(action) && !nextState.submitting) {
      const {
        onSubmit,
        onSubmitSucceeded,
        onSubmitFailed,
        parsedValues,
        values,
        initialValues,
        initialParsedValues,
      } = nextState
      const submitPromise = (async () => {
        if (nextState.validationError) throw nextState.validationError
        for (const fn of onSubmit)
          await fn(parsedValues, { initialValues, initialParsedValues })
      })()
      store.dispatch(
        setSubmitStatus({
          submitting: true,
          submittedParsedValues: parsedValues,
          submittedValues: values,
          submitError: undefined,
          submitSucceeded: false,
          submitFailed: false,
          submitPromise,
        })
      )
      submitPromise.then(
        async () => {
          if (store.getState().submitPromise !== submitPromise) return
          store.dispatch(submitSucceeded())
          for (const fn of onSubmitSucceeded) await fn()
        },
        async (error) => {
          if (store.getState().submitPromise !== submitPromise) return
          store.dispatch(
            setSubmitStatus({
              submitting: false,
              submitError: error,
              submitSucceeded: false,
              submitFailed: true,
              submitPromise: undefined,
            })
          )
          for (const fn of onSubmitFailed) await fn(error)
        }
      )
    }

    return result
  }
}

function isSubmitAction(action: any): action is SubmitAction {
  return (
    action instanceof Object && 'type' in action && action.type === 'submit'
  )
}
