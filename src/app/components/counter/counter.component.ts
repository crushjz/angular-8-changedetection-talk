import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core'
import { interval, Observable, Subject } from 'rxjs'
import { scan, startWith, tap } from 'rxjs/operators'
import { consoleLog } from 'src/app/utilities/rxjs-operators'

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  // Mutable property
  mutableCount = -1

  // Bound to the push pipe
  readonly count$: Observable<number>

  private readonly values$ = new Subject<number>()

  constructor(cd: ChangeDetectorRef) {
    const count$ = this.values$.pipe(
      startWith(0),
      scan((count, next) => count + next, 0),
      consoleLog('count')
    )

    // interval(1500)
    //   .pipe(
    //     tap(() => {
    //       this.values$.next(-1)
    //     })
    //   )
    //   .subscribe()

    // Mutability + side effects
    // count$.subscribe(v => {
    //   this.mutableCount = v
    //   // cd.markForCheck()
    // })

    this.count$ = count$
  }

  get rendered() {
    console.log(`${this.constructor.name} rendered`)
    return `${this.constructor.name}`
  }

  onDecrementClick() {
    this.values$.next(-1)
  }
  onIncrementClick() {
    this.values$.next(+1)
  }
}
