import { FieldPathForParsedValue } from '../FieldPath'
import z from 'zod'
import { DeepPartial } from '../util/DeepPartial'

export type ArrayFieldPath<V = any, R = any> = FieldPathForParsedValue<
  V[] | null | undefined,
  R[] | null | undefined
>

type ParsedValueFor<Field extends ArrayFieldPath> = NonNullable<
  z.output<Field['schema']>
>[number]

type ValueFor<Field extends ArrayFieldPath> = DeepPartial<
  NonNullable<z.input<Field['schema']>>[number]
>

export type ArrayInsertParsedAction<
  Field extends ArrayFieldPath = ArrayFieldPath
> = ReturnType<typeof arrayInsertParsed<Field>>

export function arrayInsertParsed<Field extends ArrayFieldPath>(
  field: Field,
  index: number,
  parsedValue: ParsedValueFor<Field>
) {
  return { type: 'arrayInsertParsed', field, index, parsedValue } as const
}

export type ArrayInsertAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  ReturnType<typeof arrayInsert<Field>>

export function arrayInsert<Field extends ArrayFieldPath>(
  field: Field,
  index: number,
  value: ValueFor<Field>
) {
  return { type: 'arrayInsert', field, index, value } as const
}

export type ArrayMoveAction = ReturnType<typeof arrayMove>

export function arrayMove(field: ArrayFieldPath, from: number, to: number) {
  return { type: 'arrayMove', field, from, to } as const
}

export type ArrayPopAction = ReturnType<typeof arrayPop>

export function arrayPop(field: ArrayFieldPath) {
  return { type: 'arrayPop', field } as const
}

export type ArrayPushParsedAction<
  Field extends ArrayFieldPath = ArrayFieldPath
> = ReturnType<typeof arrayPushParsed<Field>>

export function arrayPushParsed<Field extends ArrayFieldPath>(
  field: Field,
  parsedValue: ParsedValueFor<Field>
) {
  return { type: 'arrayPushParsed', field, parsedValue } as const
}

export type ArrayPushAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  ReturnType<typeof arrayPush<Field>>

export function arrayPush<Field extends ArrayFieldPath>(
  field: Field,
  value: ValueFor<Field>
) {
  return { type: 'arrayPush', field, value } as const
}

export type ArrayRemoveAction = ReturnType<typeof arrayRemove>

export function arrayRemove(field: ArrayFieldPath, index: number) {
  return { type: 'arrayRemove', field, index } as const
}

export type ArrayRemoveAllAction = ReturnType<typeof arrayRemoveAll>

export function arrayRemoveAll(field: ArrayFieldPath) {
  return { type: 'arrayRemoveAll', field } as const
}

export type ArrayShiftAction = ReturnType<typeof arrayShift>

export function arrayShift(field: ArrayFieldPath) {
  return { type: 'arrayShift', field } as const
}

export type ArraySpliceParsedAction<
  Field extends ArrayFieldPath = ArrayFieldPath
> = ReturnType<typeof arraySpliceParsed<Field>>

export function arraySpliceParsed<Field extends ArrayFieldPath>(
  field: Field,
  index: number,
  deleteCount: number,
  ...parsedValues: ParsedValueFor<Field>[]
) {
  return {
    type: 'arraySpliceParsed',
    field,
    index,
    deleteCount,
    parsedValues,
  } as const
}

export type ArraySpliceAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  ReturnType<typeof arraySplice<Field>>

export function arraySplice<Field extends ArrayFieldPath>(
  field: Field,
  index: number,
  deleteCount: number,
  ...values: ValueFor<Field>[]
) {
  return {
    type: 'arraySplice',
    field,
    index,
    deleteCount,
    values,
  } as const
}

export type ArraySwapAction = ReturnType<typeof arraySwap>

export function arraySwap(
  field: ArrayFieldPath,
  indexA: number,
  indexB: number
) {
  return { type: 'arraySwap', field, indexA, indexB } as const
}

export type ArrayUnshiftParsedAction<
  Field extends ArrayFieldPath = ArrayFieldPath
> = ReturnType<typeof arrayUnshiftParsed<Field>>

export function arrayUnshiftParsed<Field extends ArrayFieldPath>(
  field: Field,
  parsedValue: ParsedValueFor<Field>
) {
  return { type: 'arrayUnshiftParsed', field, parsedValue } as const
}

export type ArrayUnshiftAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  ReturnType<typeof arrayUnshift<Field>>

export function arrayUnshift<Field extends ArrayFieldPath>(
  field: Field,
  value: ValueFor<Field>
) {
  return { type: 'arrayUnshift', field, value } as const
}

export type ArrayAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  | ArrayInsertParsedAction<Field>
  | ArrayInsertAction<Field>
  | ArrayMoveAction
  | ArrayPopAction
  | ArrayPushParsedAction<Field>
  | ArrayPushAction<Field>
  | ArrayRemoveAction
  | ArrayRemoveAllAction
  | ArrayShiftAction
  | ArraySpliceParsedAction<Field>
  | ArraySpliceAction<Field>
  | ArraySwapAction
  | ArrayUnshiftParsedAction<Field>
  | ArrayUnshiftAction<Field>

export type arrayActions<Field extends ArrayFieldPath = ArrayFieldPath> = {
  insertParsed: typeof arrayInsertParsed<Field>
  insert: typeof arrayInsert<Field>
  move: typeof arrayMove
  pop: typeof arrayPop
  pushParsed: typeof arrayPushParsed<Field>
  push: typeof arrayPush<Field>
  remove: typeof arrayRemove
  removeAll: typeof arrayRemoveAll
  shift: typeof arrayShift
  spliceParsed: typeof arraySpliceParsed<Field>
  splice: typeof arraySplice<Field>
  swap: typeof arraySwap
  unshiftParsed: typeof arrayUnshiftParsed<Field>
  unshift: typeof arrayUnshift<Field>
}

export const arrayActions = {
  insertParsed: arrayInsertParsed,
  insert: arrayInsert,
  move: arrayMove,
  pop: arrayPop,
  pushParsed: arrayPushParsed,
  push: arrayPush,
  remove: arrayRemove,
  removeAll: arrayRemoveAll,
  shift: arrayShift,
  spliceParsed: arraySpliceParsed,
  splice: arraySplice,
  swap: arraySwap,
  unshiftParsed: arrayUnshiftParsed,
  unshift: arrayUnshift,
}
