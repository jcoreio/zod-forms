export type SetMountedAction = ReturnType<typeof setMounted>

export function setMounted(mounted: boolean) {
  return {
    type: 'setMounted',
    mounted,
  } as const
}
