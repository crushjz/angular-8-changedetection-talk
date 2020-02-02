import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherComponent implements OnInit {
  constructor() {
    //
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
