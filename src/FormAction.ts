import z from 'zod'
import { SetMountedAction } from './actions/setMounted'
import { InitializeAction } from './actions/initialize'
import { SetValueAction } from './actions/setValue'
import { SetRawValueAction } from './actions/setRawValue'
import { SetMetaAction } from './actions/setMeta'
import { FieldPath } from './FieldPath'

export type FormAction<T extends z.ZodTypeAny> =
  | SetMountedAction
  | InitializeAction<T>
  | SetValueAction<FieldPath>
  | SetRawValueAction<FieldPath>
  | SetMetaAction<FieldPath>
