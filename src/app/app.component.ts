import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  VERSION,
} from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly name = `Angular ${VERSION.full}`

  get rendered() {
    console.log(`${this.constructor.name} rendered`)
    return `${this.constructor.name}`
  }

  ngOnInit() {
    //
  }
}
