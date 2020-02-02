import { Observable } from 'rxjs'

export type Constructor<T = {}> = new (...args: Array<any>) => T

/**
 * Typed version of `SimpleChange`
 */
export interface TypedChange<T> {
  readonly previousValue: T
  readonly currentValue: T
  readonly firstChange: boolean
  // Needed because this Interface is just the typed version of `SimpleChange`,
  // and we can't split it in multiple interfaces
  // tslint:disable-next-line: no-mixed-interface
  readonly isFirstChange: () => boolean
}

/**
 * Typed version of `SimpleChanges`
 */
export type TypedChanges<T> = { [key in keyof T]?: TypedChange<T[key]> }

export type ObservableDictionary<T> = { [P in keyof T]: Observable<T[P]> }

export class BaseEmpty {}

export class Callable<T extends Function> extends Function {
  constructor(fn: T) {
    super()
    return Object.setPrototypeOf(fn, new.target.prototype)
  }
}

export type NextFn<T> = (next: T) => void
