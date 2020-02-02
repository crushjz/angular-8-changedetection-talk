import {
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core'
import { fromEvent, Subscription } from 'rxjs'
import { tap } from 'rxjs/operators'

import { outsideZone } from '../utilities/rxjs-operators'

@Directive({
  selector: '[appClick]',
})
export class ClickDirective implements OnDestroy {
  @Output()
  readonly elClick = new EventEmitter<Event>()

  private readonly mutableClickSubscription: Subscription

  constructor(elRef: ElementRef, ngZone: NgZone) {
    this.mutableClickSubscription = fromEvent<Event>(
      elRef.nativeElement,
      'click'
    )
      .pipe(
        outsideZone(ngZone),
        tap(e => this.elClick.emit(e))
      )
      .subscribe()
  }

  ngOnDestroy() {
    this.mutableClickSubscription.unsubscribe()
  }
}
