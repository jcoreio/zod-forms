import z from 'zod'
import { PathInType, PathstringInType } from './PathInType'

export type PathInSchema<T extends z.ZodTypeAny> = PathInType<z.input<T>>
export type PathstringInSchema<T extends z.ZodTypeAny> = PathstringInType<
  z.input<T>
>
