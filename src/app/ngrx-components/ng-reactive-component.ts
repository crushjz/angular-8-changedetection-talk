import { ChangeDetectorRef } from '@angular/core'
import { flow } from 'fp-ts/lib/function'
import { animationFrameScheduler, concat, from } from 'rxjs'
import { debounceTime, mergeMap, takeUntil, tap } from 'rxjs/operators'

import { getPropKeys, identity } from '../utilities/utilities'

import { ReactiveLifecycleHooks } from './ng-reactive-lifecyclehooks'
import { createWithOnChanges$, WithOnChangesType } from './ng-with-onchanges'
import { createWithOnDestroy$, WithOnDestroyType } from './ng-with-ondestroy'
import { createWithOnInit$, WithOnInitType } from './ng-with-oninit'
import { createWithState } from './ng-with-state'
import { BaseEmpty, Constructor, ObservableDictionary } from './types'
import { createWithSink } from './ng-with-sink'

/**
 * Sources:
 *
 * NgObservable
 *  https://zodiac.repl.to/guide/ng-observable
 *  https://github.com/zodiac-team/zodiac-ui/blob/master/libs/ng-observable/lib/invoke-subject.ts
 *
 *
 * Rethinking Reactivity:
 * https://github.com/MikeRyanDev/rethinking-reactivity-angularconnect2019/blob/master/src/app/app.component.ts
 * RFC Spec:
 * https://github.com/ngrx/platform/issues/2052
 *
 * Push Pipe
 * https://github.com/ngrx-utils/ngrx-utils/blob/master/projects/store/src/pipes/push.ts
 *
 * This implements an Inheritance approach (because of Angular limitations)
 * https://github.com/ngrx/platform/issues/2052#issuecomment-535846581
 *
 * Class Mixins
 * https://mariusschulz.com/blog/mixin-classes-in-typescript
 */

type ConstructorWithInitAndDestroyAndChanges = Constructor &
  WithOnDestroyType &
  WithOnInitType &
  WithOnChangesType

/**
 * Creates a Reactive Component with typed Props and State
 *
 *
 * @example
 *
 *    const ReactiveComponent = createReactiveComponent<Props, State>()
 *    class Component extends ReactiveComponent {
 *      readonly state: State
 *      constructor(cd: ChangeDetectorRef) {
 *        super()
 *        this.onChanges$.pipe(map(x => x))
 *        this.state = this.connect({...}, cd)
 *      }
 *    }
 *
 */
export const createReactiveComponent = <TProps, TState>() =>
  flow(
    identity<BaseEmpty>(),
    createWithOnInit$(),
    createWithOnDestroy$(),
    createWithOnChanges$<Constructor, TProps>(),
    createWithState<ConstructorWithInitAndDestroyAndChanges, TState>(),
    createWithSink()
  )(BaseEmpty)

// Without pipe
// export const createReactiveComponent = <TProps, TState>() =>
//   createWithState<ConstructorWithInitAndDestroyAndChanges, TState>()(
//     createWithOnChanges$<ConstructorWithInitAndDestroy, TProps>()(
//       createWithOnDestroy$<ConstructorWithInit>()(
//         createWithOnInit$()(BaseEmpty)
//       )
//     )
//   )

/**
 * Reactive Component class with typed Props and State
 *
 * @example
 *
 *    class Component extends ReactiveComponent<Props, State> {
 *      readonly state: State
 *      constructor(cd: ChangeDetectorRef) {
 *        super(cd)
 *        this.onChanges$.pipe(map(x => x))
 *        this.state = this.connect({...})
 *      }
 *    }
 *
 */
export class ReactiveComponent<TProps, TState> extends ReactiveLifecycleHooks<
  TProps
> {
  constructor(private readonly cd: ChangeDetectorRef) {
    super()
  }

  /**
   * Detaches the ChangeDetctorRef, and subscribe to each source observable.
   * Every time an observable emits, it will call detectChanges() so that the view is updated.
   * @param sources An dictionary of observables
   * @param changeDetector Angular ChangeDetctorRef
   *
   * @returns The mutable state
   */
  connect(sources: ObservableDictionary<TState>): Partial<TState> {
    // Detach default ChangeDetection
    this.cd.detach()

    // Mutable state - it will be updated on every observable emit
    const mutableSink: Partial<TState> = {}

    const sourceKeys = getPropKeys(sources)

    // Updates the state on every obsersavable emit
    const updateSink$ = from(sourceKeys).pipe(
      mergeMap(key => {
        const source$ = sources[key]
        return source$.pipe(
          tap(sinkValue => {
            mutableSink[key] = sinkValue
          })
        )
      })
    )

    // Runs change detections when:
    const runChangeDetection$ = concat(
      this.onInit$, // Component is initialized
      updateSink$ // On every subsequent observables emit
    ).pipe(
      // sync to RequestAnimationFrame scheduler and batch changes
      debounceTime(0, animationFrameScheduler),
      tap(() => {
        // Run ChangeDetection when a state value changes
        this.cd.detectChanges()
      }),
      takeUntil(this.onDestroy$)
    )

    // tslint:disable-next-line: no-expression-statement
    runChangeDetection$.subscribe()

    return mutableSink
  }
}
