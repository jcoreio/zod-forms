import z from 'zod'
import { SetMountedAction } from './actions/setMounted'
import { InitializeAction } from './actions/initialize'
import { SetValueAction } from './actions/setValue'
import { SetRawValueAction } from './actions/setRawValue'

export type FormAction<T extends z.ZodTypeAny> =
  | SetMountedAction
  | InitializeAction<T>
  | SetValueAction<T, any>
  | SetRawValueAction<T, any>
