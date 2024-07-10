import React from 'react'
import { Store, bindActionCreators, createStore } from 'redux'
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

export const createFormProvider = <T extends z.ZodTypeAny>({
  schema,
  inverseSchema,
  FormContext,
  FormReactReduxContext,
}: {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
  FormContext: React.Context<FormContextProps<T> | null>
  FormReactReduxContext: React.Context<ReactReduxContextValue<
    FormState<T>,
    FormAction<T>
  > | null>
}) =>
  function FormProvider({ children }: { children: React.ReactElement }) {
    const storeRef = React.useRef<Store<FormState<T>, FormAction<T>>>()
    if (!storeRef.current)
      storeRef.current = createStore(
        createFormReducer({ schema, inverseSchema })
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
      () => ({
        schema,
        inverseSchema,
        ...bindActionCreators(
          {
            initialize: initialize<T>,
            setRawValue: setRawValue<T, any>,
            setValue: setValue<T, any>,
          },
          dispatch
        ),
      }),
      []
    )

    return (
      <FormContext.Provider value={formContext}>
        <Provider store={store} context={FormReactReduxContext}>
          {children}
        </Provider>
      </FormContext.Provider>
    )
  }
