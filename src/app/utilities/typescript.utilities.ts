/** Exclude a property (Typescript 3.5 already has this helper) */
export type Omit<T, TK extends keyof T> = Pick<T, Exclude<keyof T, TK>>

/** Makes specified properties optional */
export type PartialBy<T, TK extends keyof T> = Omit<T, TK> &
  Partial<Pick<T, TK>>

/** Makes every property optional except the specified ones */
export type PartialWithout<T, TK extends keyof T> = Partial<Omit<T, TK>> &
  Pick<T, TK>

/** Makes type not nil */
export type NotNil<T> = Exclude<T, null | undefined>

/** Makes type nil */
export type Nil<T> = T | null | undefined

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null

/** Like Partial but recursive */
// Taken from: https://github.com/krzkaczor/ts-essentials/blob/master/lib/types.ts
export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Function
  ? T
  : T extends Date
  ? T
  : T extends Map<infer K, infer V>
  ? DeepPartialMap<K, V>
  : T extends Set<infer U>
  ? DeepPartialSet<U>
  : T extends {}
  ? { [TK in keyof T]?: DeepPartial<T[TK]> }
  : Partial<T>
interface DeepPartialSet<TItem> extends Set<DeepPartial<TItem>> {}
interface DeepPartialMap<TKey, TValue>
  extends Map<DeepPartial<TKey>, DeepPartial<TValue>> {}

/**
 * Creates an object mixed with onther object.
 * Source: https://www.typescriptlang.org/docs/handbook/mixins.html
 *
 * @param derivedCtor The base class to extend
 * @param baseCtors A list of classes that will extend the base class
 */
export const applyMixins = (derivedCtor: any, baseCtors: Array<any>) => {
  // We are doing side effects and mutating objects prototype
  // tslint:disable: no-expression-statement
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || {}
      )
    })
  })
  // tslint:enable: no-expression-statement
}

export const mixins: unique symbol = Symbol()
