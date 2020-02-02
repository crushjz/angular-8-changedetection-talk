import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { delay, scan } from 'rxjs/operators'

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent implements OnInit {
  // Mutable property
  mutableCount: Number = -1

  // Bound to the push pipe
  readonly count$: Observable<number>

  private readonly values$ = new BehaviorSubject<number>(0)

  constructor(cd: ChangeDetectorRef) {
    const count$ = this.values$.pipe(
      scan((count, next) => count + next, 0),
      delay(2500)
    )

    // Mutability + side effects
    // tslint:disable-next-line: no-expression-statement
    count$.subscribe(v => {
      console.log('COUNT: ', v, ' isInAngularZone:', NgZone.isInAngularZone())
      this.mutableCount = v

      // cd.markForCheck()
    })

    this.count$ = count$
  }

  get rendered() {
    console.log(`${this.constructor.name} rendered`)
    return `${this.constructor.name}`
  }

  ngOnInit() {
    //
  }
}
