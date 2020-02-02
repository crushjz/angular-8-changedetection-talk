import {
  AfterContentInit,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { concat, from, Observable, ReplaySubject } from 'rxjs'
import { distinctUntilChanged, mergeMap, takeUntil } from 'rxjs/operators'

import { selectProp } from './selectors'
import { TypedChanges } from './types'
import { filterNotNil } from '../utilities/utilities'

const onInitSubject = Symbol('OnInitSubject')
const onDestroySubject = Symbol('OnDestroySubject')
const onChangesSubject = Symbol('OnChangesSubject')
const afterViewInitSubject = Symbol('AfterViewInitSubject')
const afterContentInitSubject = Symbol('AfterContentInitSubject')

export class ReactiveLifecycleHooks<TProps>
  implements OnInit, OnDestroy, OnChanges, AfterViewInit, AfterContentInit {
  readonly onInit$: Observable<true>
  readonly onDestroy$: Observable<true>
  readonly onChanges$: Observable<TypedChanges<TProps>>
  readonly afterViewInit$: Observable<true>
  readonly afterContentInit$: Observable<true>

  private readonly [onInitSubject] = new ReplaySubject<true>(1)
  private readonly [onDestroySubject] = new ReplaySubject<true>(1)
  private readonly [onChangesSubject] = new ReplaySubject<TypedChanges<TProps>>(
    1
  )
  private readonly [afterViewInitSubject] = new ReplaySubject<true>(1)
  private readonly [afterContentInitSubject] = new ReplaySubject<true>(1)

  constructor() {
    this.onInit$ = this[onInitSubject].asObservable()
    this.onDestroy$ = this[onDestroySubject].asObservable()
    this.onChanges$ = this[onChangesSubject].asObservable()
    this.afterViewInit$ = this[afterViewInitSubject].asObservable()
    this.afterContentInit$ = this[afterContentInitSubject].asObservable()
  }

  /**
   * Manages the subscription and unsubcription of each observable.
   * The subscription will happen after the OnInit hook.
   * @param sources A list of observables
   */
  sink(sources: Array<Observable<any>>): void {
    const sink$ = from(sources).pipe(mergeMap(source$ => source$))
    const obsList$ = concat(this.onInit$, sink$).pipe(
      takeUntil(this.onDestroy$)
    )

    // tslint:disable-next-line: no-expression-statement
    obsList$.subscribe()
  }

  /**
   * Select a component @Input as an observable.
   * It will trigger only if the value is not nil.
   * @param prop The name of the input to select
   */
  selectInput<TKey extends keyof TProps>(prop: TKey): Observable<TProps[TKey]> {
    return this.onChanges$.pipe(
      selectProp(prop),
      filterNotNil(),
      distinctUntilChanged()
    )
  }

  ngOnInit() {
    this[onInitSubject].next(true)
    this[onInitSubject].complete()
  }

  ngOnDestroy() {
    this[onDestroySubject].next(true)
    this[onDestroySubject].complete()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const typedChanges = changes as TypedChanges<TProps>
    this[onChangesSubject].next(typedChanges)
  }

  ngAfterViewInit() {
    this[afterViewInitSubject].next(true)
    this[afterViewInitSubject].complete()
  }

  ngAfterContentInit() {
    this[afterContentInitSubject].next(true)
    this[afterContentInitSubject].complete()
  }
}
