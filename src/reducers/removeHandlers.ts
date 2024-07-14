import z from 'zod'
import { FormState } from '../FormState'
import { RemoveHandlersAction } from '../actions/removeHandlers'
import { setDelete } from '../util/setDelete'

export function removeHandlersReducer<T extends z.ZodTypeAny>(
  state: FormState<T>,
  action: RemoveHandlersAction<T>
) {
  const { onSubmit, onSubmitSucceeded, onSubmitFailed } = action
  return {
    ...state,
    ...(onSubmit && { onSubmit: setDelete(state.onSubmit, onSubmit) }),
    ...(onSubmitSucceeded && {
      onSubmitSucceeded: setDelete(state.onSubmitSucceeded, onSubmitSucceeded),
    }),
    ...(onSubmitFailed && {
      onSubmitFailed: setDelete(state.onSubmitFailed, onSubmitFailed),
    }),
  }
}
