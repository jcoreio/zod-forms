import React from 'react'
import { Store, applyMiddleware, bindActionCreators, createStore } from 'redux'
import z from 'zod'
import { setMounted } from './actions/setMounted'
import { createFormReducer } from './createFormReducer'
import { FormAction } from './FormAction'
import { FormState } from './FormState'
import { Provider } from 'react-redux'
import { initialize } from './actions/initialize'
import { setRawValue } from './actions/setRawValue'
import { setValue } from './actions/setValue'
import { FormContext, FormContextProps } from './FormContext'
import { FormStateContext } from './FormStateContext'
import { createFormMiddleware } from './createFormMiddleware'
import { submit } from './actions/submit'
import { setSubmitStatus } from './actions/setSubmitStatus'
import { setMeta } from './actions/setMeta'
import { addHandlers } from './actions/addHandlers'
import { removeHandlers } from './actions/removeHandlers'
import { arrayActions } from './actions/arrayActions'

export const createFormProvider = <T extends z.ZodTypeAny>(
  props: Pick<
    FormContextProps<T>,
    | 'root'
    | 'schema'
    | 'inverseSchema'
    | 'selectFormStatus'
    | 'selectFieldErrorMap'
    | 'selectFormValues'
  >
) =>
  function FormProvider({ children }: { children: React.ReactElement }) {
    const storeRef = React.useRef<Store<FormState<T>, FormAction<T>>>()
    if (!storeRef.current) {
      storeRef.current = createStore(
        createFormReducer(props),
        applyMiddleware(createFormMiddleware())
      )
    }
    const store = storeRef.current
    const { dispatch } = store

    React.useEffect(
      () => () => {
        store.dispatch(setMounted(false))
      },
      []
    )
    const formContext = React.useMemo(
      (): FormContextProps<T> => ({
        ...props,
        ...bindActionCreators(
          {
            initialize: initialize<T>,
            addHandlers: addHandlers<T>,
            removeHandlers: removeHandlers<T>,
            submit,
            setSubmitStatus: setSubmitStatus<T>,
            setMeta: setMeta as any,
            setRawValue: setRawValue as any,
            setValue: setValue as any,
          },
          dispatch
        ),
        array: bindActionCreators(arrayActions, dispatch),
      }),
      []
    )

    return (
      <FormContext.Provider value={formContext as any}>
        <Provider
          store={store}
          context={FormStateContext as FormStateContext<T>}
        >
          {children}
        </Provider>
      </FormContext.Provider>
    )
  }
