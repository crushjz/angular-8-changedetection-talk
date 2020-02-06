import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { interval } from 'rxjs'
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherComponent implements OnInit {
  // Mutable property
  mutableCount = -1

  constructor() {
    interval(1000).pipe(
      tap(() => {
        this.mutableCount++
      })
    )
    // .subscribe()
  }

  get rendered() {
    console.log(`${this.constructor.name} rendered`)
    return `${this.constructor.name}`
  }

  onClick() {
    console.log('CLICK')
  }

  ngOnInit() {
    //
  }
}
