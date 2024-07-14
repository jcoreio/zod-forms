import { FieldPathForValue } from '../FieldPath'
import z from 'zod'

export type ArrayFieldPath<V = any, R = any> = FieldPathForValue<
  V[] | null | undefined,
  R[] | null | undefined
>

type ValueFor<Field extends ArrayFieldPath> = NonNullable<
  z.output<Field['schema']>
>[number]

type RawValueFor<Field extends ArrayFieldPath> = NonNullable<
  z.input<Field['schema']>
>[number]

export type ArrayInsertAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  ReturnType<typeof arrayInsert<Field>>

export function arrayInsert<Field extends ArrayFieldPath>(
  field: Field,
  index: number,
  value: ValueFor<Field>
) {
  return { type: 'arrayInsert', field, index, value } as const
}

export type ArrayInsertRawAction<
  Field extends ArrayFieldPath = ArrayFieldPath
> = ReturnType<typeof arrayInsertRaw<Field>>

export function arrayInsertRaw<Field extends ArrayFieldPath>(
  field: Field,
  index: number,
  rawValue: RawValueFor<Field>
) {
  return { type: 'arrayInsertRaw', field, index, rawValue } as const
}

export type ArrayMoveAction = ReturnType<typeof arrayMove>

export function arrayMove(field: ArrayFieldPath, from: number, to: number) {
  return { type: 'arrayMove', field, from, to } as const
}

export type ArrayPopAction = ReturnType<typeof arrayPop>

export function arrayPop(field: ArrayFieldPath) {
  return { type: 'arrayPop', field } as const
}

export type ArrayPushAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  ReturnType<typeof arrayPush<Field>>

export function arrayPush<Field extends ArrayFieldPath>(
  field: Field,
  value: ValueFor<Field>
) {
  return { type: 'arrayPush', field, value } as const
}

export type ArrayPushRawAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  ReturnType<typeof arrayPushRaw<Field>>

export function arrayPushRaw<Field extends ArrayFieldPath>(
  field: Field,
  rawValue: RawValueFor<Field>
) {
  return { type: 'arrayPushRaw', field, rawValue } as const
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

export type ArraySpliceAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  ReturnType<typeof arraySplice<Field>>

export function arraySplice<Field extends ArrayFieldPath>(
  field: Field,
  index: number,
  deleteCount: number,
  ...values: ValueFor<Field>[]
) {
  return { type: 'arraySplice', field, index, deleteCount, values } as const
}

export type ArraySpliceRawAction<
  Field extends ArrayFieldPath = ArrayFieldPath
> = ReturnType<typeof arraySpliceRaw<Field>>

export function arraySpliceRaw<Field extends ArrayFieldPath>(
  field: Field,
  index: number,
  deleteCount: number,
  ...rawValues: RawValueFor<Field>[]
) {
  return {
    type: 'arraySpliceRaw',
    field,
    index,
    deleteCount,
    rawValues,
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

export type ArrayUnshiftAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  ReturnType<typeof arrayUnshift<Field>>

export function arrayUnshift<Field extends ArrayFieldPath>(
  field: Field,
  value: ValueFor<Field>
) {
  return { type: 'arrayUnshift', field, value } as const
}

export type ArrayUnshiftRawAction<
  Field extends ArrayFieldPath = ArrayFieldPath
> = ReturnType<typeof arrayUnshiftRaw<Field>>

export function arrayUnshiftRaw<Field extends ArrayFieldPath>(
  field: Field,
  rawValue: RawValueFor<Field>
) {
  return { type: 'arrayUnshiftRaw', field, rawValue } as const
}

export type ArrayAction<Field extends ArrayFieldPath = ArrayFieldPath> =
  | ArrayInsertAction<Field>
  | ArrayInsertRawAction<Field>
  | ArrayMoveAction
  | ArrayPopAction
  | ArrayPushAction<Field>
  | ArrayPushRawAction<Field>
  | ArrayRemoveAction
  | ArrayRemoveAllAction
  | ArrayShiftAction
  | ArraySpliceAction<Field>
  | ArraySpliceRawAction<Field>
  | ArraySwapAction
  | ArrayUnshiftAction<Field>
  | ArrayUnshiftRawAction<Field>

export const arrayActions = {
  insert: arrayInsert,
  insertRaw: arrayInsertRaw,
  move: arrayMove,
  pop: arrayPop,
  push: arrayPush,
  pushRaw: arrayPushRaw,
  remove: arrayRemove,
  removeAll: arrayRemoveAll,
  shift: arrayShift,
  splice: arraySplice,
  spliceRaw: arraySpliceRaw,
  swap: arraySwap,
  unshift: arrayUnshift,
  unshiftRaw: arrayUnshiftRaw,
}
