export type DeepPartial<T> = T extends object | any[]
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T
