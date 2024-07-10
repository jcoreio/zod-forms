import React from 'react'
import { Store, applyMiddleware, bindActionCreators, createStore } from 'redux'
import z from 'zod'
import { setMounted } from './actions/setMounted'
import { createFormReducer } from './createFormReducer'
import { FormAction } from './FormAction'
import { FormState } from './FormState'
import { FormContextProps } from './FormContextProps'
import { Provider, ReactReduxContextValue } from 'react-redux'
import { initialize } from './actions/initialize'
import { setRawValue } from './actions/setRawValue'
import { setValue } from './actions/setValue'
import { FormContext } from './FormContext'
import { createFormMiddleware } from './createFormMiddleware'
import { setHandlers } from './actions/setHandlers'
import { submit } from './actions/submit'
import { setSubmitStatus } from './actions/setSubmitStatus'

export const createFormProvider = <T extends z.ZodTypeAny>({
  schema,
  inverseSchema,
  useField,
  useHtmlField,
  FormReactReduxContext,
}: Pick<
  FormContextProps<T>,
  'schema' | 'inverseSchema' | 'useField' | 'useHtmlField'
> & {
  FormReactReduxContext: React.Context<ReactReduxContextValue<
    FormState<T>,
    FormAction<T>
  > | null>
}) =>
  function FormProvider({ children }: { children: React.ReactElement }) {
    const storeRef = React.useRef<Store<FormState<T>, FormAction<T>>>()
    if (!storeRef.current)
      storeRef.current = createStore(
        createFormReducer({ schema, inverseSchema }),
        applyMiddleware(createFormMiddleware())
      )
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
        schema,
        inverseSchema,
        useField,
        useHtmlField,
        ...bindActionCreators(
          {
            initialize: initialize<T>,
            setHandlers: setHandlers<T>,
            submit,
            setSubmitStatus: setSubmitStatus<T>,
            setRawValue: setRawValue as any,
            setValue: setValue as any,
          },
          dispatch
        ),
      }),
      []
    )

    return (
      <FormContext.Provider value={formContext as any}>
        <Provider store={store} context={FormReactReduxContext}>
          {children}
        </Provider>
      </FormContext.Provider>
    )
  }
