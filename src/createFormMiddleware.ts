import { Dispatch, Middleware } from 'redux'
import z from 'zod'
import { FormAction } from './FormAction'
import { FormState } from './FormState'
import { SubmitAction } from './actions/submit'
import { setSubmitStatus } from './actions/setSubmitStatus'

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
        values,
        initialValues,
      } = nextState
      const submitPromise = (async () => {
        if (nextState.validationError) throw nextState.validationError
        await onSubmit?.(values, { initialValues })
      })()
      store.dispatch(
        setSubmitStatus({
          submitting: true,
          submitError: undefined,
          submitSucceeded: false,
          submitFailed: false,
          submitPromise,
        })
      )
      submitPromise.then(
        () => {
          if (store.getState().submitPromise !== submitPromise) return
          store.dispatch(
            setSubmitStatus({
              submitting: false,
              submitError: undefined,
              submitSucceeded: true,
              submitFailed: false,
              submitPromise: undefined,
            })
          )
          onSubmitSucceeded?.()
        },
        (error) => {
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
          onSubmitFailed?.(error)
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
