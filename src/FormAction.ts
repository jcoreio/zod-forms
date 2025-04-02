import z from 'zod'
import { SetMountedAction } from './actions/setMounted'
import { InitializeAction } from './actions/initialize'
import { SetParsedValueAction } from './actions/setParsedValue'
import { SetValueAction } from './actions/setValue'
import { SetMetaAction } from './actions/setMeta'
import { FieldPath } from './FieldPath'
import { SubmitAction } from './actions/submit'
import { SubmitSucceededAction } from './actions/submitSucceeded'
import { SetSubmitStatusAction } from './actions/setSubmitStatus'
import { AddHandlersAction } from './actions/addHandlers'
import { RemoveHandlersAction } from './actions/removeHandlers'
import { ArrayAction } from './actions/arrayActions'

export type FormAction<T extends z.ZodTypeAny> =
  | SetMountedAction
  | InitializeAction<T>
  | SetParsedValueAction<FieldPath>
  | SetValueAction<FieldPath>
  | SetMetaAction<FieldPath>
  | AddHandlersAction<T>
  | RemoveHandlersAction<T>
  | SubmitAction
  | SubmitSucceededAction
  | SetSubmitStatusAction<T>
  | ArrayAction
