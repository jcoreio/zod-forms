import z from 'zod'
import { SetMountedAction } from './actions/setMounted'
import { InitializeAction } from './actions/initialize'
import { SetValueAction } from './actions/setValue'
import { SetRawValueAction } from './actions/setRawValue'
import { SetMetaAction } from './actions/setMeta'
import { FieldPath } from './FieldPath'
import { SetHandlersAction } from './actions/setHandlers'
import { SubmitAction } from './actions/submit'
import { SubmitSucceededAction } from './actions/submitSucceeded'
import { SetSubmitStatusAction } from './actions/setSubmitStatus'

export type FormAction<T extends z.ZodTypeAny> =
  | SetMountedAction
  | InitializeAction<T>
  | SetValueAction<FieldPath>
  | SetRawValueAction<FieldPath>
  | SetMetaAction<FieldPath>
  | SetHandlersAction<T>
  | SubmitAction
  | SubmitSucceededAction
  | SetSubmitStatusAction<T>
