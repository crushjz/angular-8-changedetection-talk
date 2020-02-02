import rT from 'ramda/src/T'
import cond from 'ramda/src/cond'
import { Observable, ReplaySubject, Subject } from 'rxjs'

import { applyMixins, mixins } from '../utilities/typescript.utilities'

import { Callable, NextFn } from './types'

export interface InvokeReplaySubject<T = void> extends ReplaySubject<T> {
  (next: T): void
  (...next: T extends Array<infer U> ? Array<U> : Array<never>): void
}

/**
 * Like `InvokeSubject`, but uses `ReplaySubject(1)` under the hood.
 * Replays last emission to late subscribers.
 */
export class InvokeReplaySubject<T = void> extends Callable<NextFn<T>> {
  /**
   * Creates a new `InvokeReplaySubject` instance
   *
   */
  constructor() {
    const fn: NextFn<T> = (...args: any) =>
      cond<any, void>([
        [x => x.length === 0, () => this.next()],
        [x => x.length === 1, argsArr => this.next(argsArr[0])],
        [rT, argsArr => this.next(argsArr)],
      ])(args)

    super(fn)

    // tslint:disable: no-expression-statement // Object mutation
    Object.assign(this, new ReplaySubject<T>(1))
  }

  // This class will be extended with Observable and Subject classes
  private static readonly [mixins] = applyMixins(InvokeReplaySubject, [
    Observable,
    Subject,
    ReplaySubject,
  ])
}
