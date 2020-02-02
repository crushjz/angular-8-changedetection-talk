import { fromNullable, Option } from 'fp-ts/lib/Option'
import prop from 'ramda/src/prop'
import { Observable, pipe as rxPipe } from 'rxjs'
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators'

import { filterNotNil } from '../utilities/utilities'

import { TypedChange, TypedChanges } from './types'

export const selectProp = <T, TKey extends keyof T>(key: TKey) => (
  source: Observable<TypedChanges<T>>
): Observable<T[TKey]> =>
  rxPipe(
    // Explicit map due to type inference issues
    map((tcs: TypedChanges<T>): TypedChange<T[TKey]> | undefined => tcs[key]),
    filterNotNil(),
    map(prop('currentValue')),
    distinctUntilChanged()
  )(source)

export const selectPropOpt = <T, TKey extends keyof T>(key: TKey) => (
  source: Observable<TypedChanges<T>>
): Observable<Option<T[TKey]>> =>
  rxPipe(selectProp<T, TKey>(key), map(fromNullable))(source)

export const selectPropWithDefault = <T, TKey extends keyof T>(
  key: TKey,
  defaultValue: T[TKey]
) => (source: Observable<TypedChanges<T>>): Observable<T[TKey]> =>
  rxPipe(
    selectProp<T, TKey>(key),
    filterNotNil(),
    startWith(defaultValue)
  )(source)

export const selectPropFirstChange = <T, TKey extends keyof T>(key: TKey) => (
  source: Observable<TypedChanges<T>>
): Observable<T[TKey]> =>
  rxPipe(
    map((tcs: TypedChanges<T>): TypedChange<T[TKey]> | undefined => tcs[key]),
    filterNotNil(),
    filter(prop('firstChange')),
    map(prop('currentValue'))
  )(source)
