import rT from 'ramda/src/T'
import cond from 'ramda/src/cond'
import { Observable, Subject } from 'rxjs'

import { applyMixins, mixins } from '../utilities/typescript.utilities'

import { Callable, NextFn } from './types'

// Source:
// https://github.com/zodiac-team/zodiac-ui/blob/master/libs/ng-observable/lib/invoke-subject.ts

export interface InvokeSubject<T = void> extends Subject<T> {
  (next: T): void
  (...next: T extends Array<infer U> ? Array<U> : Array<never>): void
}

/**
 * A subject that implements both `Subject<T>` and `Function` interfaces. Using this subject in place of a normal
 * method turns all invocations of that method into an observable stream without needing to modify the source of
 * the caller. When called with multiple arguments it will emit the arguments as an array.
 *
 * @example Basic usage
 *
 * const subject = new InvokeSubject<string>() // single argument
 * const subject2 = new InvokeSubject<[string, number]>() // multiple arguments
 *
 * subject("message")
 * subject2("message", 42)
 *
 * @example Convert `@HostListener` and `(event)` bindings into observable streams
 *
 * Component({
 *     template: `<input type="text" (input)="inputChanges($event)" />`
 * })
 * export class MyComponent implements OnDestroy {
 *     HostListener("click", ["$event"])
 *     readonly hostClick = new InvokeSubject<MouseEvent>()
 *     readonly inputChanges = new InvokeSubject<Event>()
 *
 *     constructor() {
 *         hostClick.subscribe(event => console.log(event))
 *         inputChanges.subscribe(event => console.log(event))
 *     }
 * }
 *
 */
export class InvokeSubject<T = void> extends Callable<NextFn<T>> {
  /**
   * Creates a new `InvokeSubject` instance
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
    Object.assign(this, new Subject())
  }

  // This class will be extended with Observable and Subject classes
  private static readonly [mixins] = applyMixins(InvokeSubject, [
    Observable,
    Subject,
  ])
}
