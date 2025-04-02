import { Reducer } from 'redux'
import z from 'zod'
import { FormAction } from './FormAction'
import { FormState } from './FormState'
import { initFormState } from './initFormState'
import { addHandlersReducer } from './reducers/addHandlers'
import { removeHandlersReducer } from './reducers/removeHandlers'
import { createSetParsedValueReducer } from './reducers/setParsedValue'
import { createSetValueReducer } from './reducers/setValue'
import { setMetaReducer } from './reducers/setMeta'
import { submitSucceededReducer } from './reducers/submitSucceeded'
import { setSubmitStatusReducer } from './reducers/setSubmitStatus'
import { createInitializeReducer } from './reducers/initialize'
import { arrayPopReducer } from './reducers/arrayPop'
import { arrayMoveReducer } from './reducers/arrayMove'
import { arrayRemoveReducer } from './reducers/arrayRemove'
import { arrayRemoveAllReducer } from './reducers/arrayRemoveAll'
import { arrayShiftReducer } from './reducers/arrayShift'
import { arraySwapReducer } from './reducers/arraySwap'
import { arrayPushReducer } from './reducers/arrayPush'
import { arrayInsertReducer } from './reducers/arrayInsert'
import { arraySpliceReducer } from './reducers/arraySplice'
import { arrayUnshiftReducer } from './reducers/arrayUnshift'
import { arrayPushParsedReducer } from './reducers/arrayPushParsed'
import { arrayUnshiftParsedReducer } from './reducers/arrayUnshiftParsed'
import { arrayInsertParsedReducer } from './reducers/arrayInsertParsed'
import { arraySpliceParsedReducer } from './reducers/arraySpliceParsed'

export function createFormReducer<T extends z.ZodTypeAny>(options: {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
}): Reducer<FormState<T>, FormAction<T>> {
  const initializeReducer = createInitializeReducer(options)
  const setParsedValueReducer = createSetParsedValueReducer(options)
  const setValueReducer = createSetValueReducer(options)
  const formReducer = (
    state: FormState<T> = initFormState(),
    action: FormAction<T>
  ): FormState<T> => {
    switch (action.type) {
      case 'setMounted':
        return { ...state, mounted: action.mounted }
      case 'addHandlers':
        return addHandlersReducer(state, action)
      case 'removeHandlers':
        return removeHandlersReducer(state, action)
      case 'initialize':
        return initializeReducer(state, action)
      case 'setSubmitStatus':
        return setSubmitStatusReducer(state, action)
      case 'submitSucceeded':
        return submitSucceededReducer(state)
      case 'setParsedValue':
        return setParsedValueReducer(state, action)
      case 'setValue':
        return setValueReducer(state, action)
      case 'setMeta':
        return setMetaReducer(state, action)
      case 'arrayInsertParsed':
        return arrayInsertParsedReducer(formReducer, state, action)
      case 'arrayInsert':
        return arrayInsertReducer(formReducer, state, action)
      case 'arrayMove':
        return arrayMoveReducer(formReducer, state, action)
      case 'arrayPop':
        return arrayPopReducer(formReducer, state, action)
      case 'arrayPushParsed':
        return arrayPushParsedReducer(formReducer, state, action)
      case 'arrayPush':
        return arrayPushReducer(formReducer, state, action)
      case 'arrayRemove':
        return arrayRemoveReducer(formReducer, state, action)
      case 'arrayRemoveAll':
        return arrayRemoveAllReducer(formReducer, state, action)
      case 'arrayShift':
        return arrayShiftReducer(formReducer, state, action)
      case 'arraySpliceParsed':
        return arraySpliceParsedReducer(formReducer, state, action)
      case 'arraySplice':
        return arraySpliceReducer(formReducer, state, action)
      case 'arraySwap':
        return arraySwapReducer(formReducer, state, action)
      case 'arrayUnshiftParsed':
        return arrayUnshiftParsedReducer(formReducer, state, action)
      case 'arrayUnshift':
        return arrayUnshiftReducer(formReducer, state, action)
    }
    return state
  }
  return formReducer
}
