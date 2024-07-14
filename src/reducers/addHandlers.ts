import z from 'zod'
import { FormState } from '../FormState'
import { AddHandlersAction } from '../actions/addHandlers'
import { setAdd } from '../util/setAdd'

export function addHandlersReducer<T extends z.ZodTypeAny>(
  state: FormState<T>,
  action: AddHandlersAction<T>
) {
  const { onSubmit, onSubmitSucceeded, onSubmitFailed } = action
  return {
    ...state,
    ...(onSubmit && { onSubmit: setAdd(state.onSubmit, onSubmit) }),
    ...(onSubmitSucceeded && {
      onSubmitSucceeded: setAdd(state.onSubmitSucceeded, onSubmitSucceeded),
    }),
    ...(onSubmitFailed && {
      onSubmitFailed: setAdd(state.onSubmitFailed, onSubmitFailed),
    }),
  }
}
