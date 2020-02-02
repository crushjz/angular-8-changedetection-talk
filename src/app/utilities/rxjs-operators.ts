import { NgZone } from '@angular/core'
import { Observable } from 'rxjs'
import { filter, tap } from 'rxjs/operators'

import { notNil } from './utilities'

export const consoleLog = (
  label: string
): (<T>(source$: Observable<T>) => Observable<T>) => <T>(
  source$: Observable<T>
): Observable<T> => {
  // tslint:disable: no-console // Debug method
  return source$.pipe(
    tap(
      value => console.log(label, 'next', value),
      value => console.error(label, 'error', value),
      () => console.log(label, 'complete')
    )
  )
  // tslint:enable: no-console
}

export const filterNotNil = () => <T>(
  source: Observable<T | null | undefined>
): Observable<T> => {
  return source.pipe(filter(notNil))
}

/**
 * Executes an RxJS pipe inside `NgZone.runOutsideAngular`.
 * Used to prevent useless app ChangeDetection cycles (`tick()`) when subscribing to DOM events.
 *
 * @example
 * const obs$ = fromEvent(window, 'scroll').pipe(outsideZone(this.zone))
 */
export function outsideZone<T = void>(zone: NgZone) {
  return (source: Observable<T>) =>
    new Observable<T>(observer =>
      zone.runOutsideAngular(() => source.subscribe(observer))
    )
}
