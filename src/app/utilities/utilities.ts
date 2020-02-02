export function getPropKeys<T, TK extends keyof T>(obj: T): Array<TK> {
  return Object.keys(obj) as Array<TK>
}

/** Can infer types inside a pipe */
export const identity = <T>() => (a: T) => a

// Nil Type guard
export function notNil<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
