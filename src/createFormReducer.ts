import { Reducer } from 'redux'
import z from 'zod'
import { FormAction } from './FormAction'
import { FormState } from './FormState'
import { initFormState } from './initFormState'
import { addHandlersReducer } from './reducers/addHandlers'
import { removeHandlersReducer } from './reducers/removeHandlers'
import { createSetValueReducer } from './reducers/setValue'
import { createSetRawValueReducer } from './reducers/setRawValue'
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
import { arrayPushRawReducer } from './reducers/arrayPushRaw'
import { arrayInsertRawReducer } from './reducers/arrayInsertRaw'
import { arraySpliceRawReducer } from './reducers/arraySpliceRaw'
import { arrayUnshiftRawReducer } from './reducers/arrayUnshiftRaw'
import { arrayPushReducer } from './reducers/arrayPush'
import { arrayUnshiftReducer } from './reducers/arrayUnshift'
import { arrayInsertReducer } from './reducers/arrayInsert'
import { arraySpliceReducer } from './reducers/arraySplice'

export function createFormReducer<T extends z.ZodTypeAny>(options: {
  schema: T
  inverseSchema: z.ZodType<z.input<T>, any, z.output<T>>
}): Reducer<FormState<T>, FormAction<T>> {
  const initializeReducer = createInitializeReducer(options)
  const setValueReducer = createSetValueReducer(options)
  const setRawValueReducer = createSetRawValueReducer(options)
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
      case 'setValue':
        return setValueReducer(state, action)
      case 'setRawValue':
        return setRawValueReducer(state, action)
      case 'setMeta':
        return setMetaReducer(state, action)
      case 'arrayInsert':
        return arrayInsertReducer(formReducer, state, action)
      case 'arrayInsertRaw':
        return arrayInsertRawReducer(formReducer, state, action)
      case 'arrayMove':
        return arrayMoveReducer(formReducer, state, action)
      case 'arrayPop':
        return arrayPopReducer(formReducer, state, action)
      case 'arrayPush':
        return arrayPushReducer(formReducer, state, action)
      case 'arrayPushRaw':
        return arrayPushRawReducer(formReducer, state, action)
      case 'arrayRemove':
        return arrayRemoveReducer(formReducer, state, action)
      case 'arrayRemoveAll':
        return arrayRemoveAllReducer(formReducer, state, action)
      case 'arrayShift':
        return arrayShiftReducer(formReducer, state, action)
      case 'arraySplice':
        return arraySpliceReducer(formReducer, state, action)
      case 'arraySpliceRaw':
        return arraySpliceRawReducer(formReducer, state, action)
      case 'arraySwap':
        return arraySwapReducer(formReducer, state, action)
      case 'arrayUnshift':
        return arrayUnshiftReducer(formReducer, state, action)
      case 'arrayUnshiftRaw':
        return arrayUnshiftRawReducer(formReducer, state, action)
    }
    return state
  }
  return formReducer
}
