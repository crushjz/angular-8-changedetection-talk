import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core'

@Component({
  selector: 'app-count-viewer',
  templateUrl: './count-viewer.component.html',
  styleUrls: ['./count-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountViewerComponent implements OnInit {
  @Input() readonly count: Number

  constructor() {
    //
  }

  get rendered() {
    console.log(`${this.constructor.name} rendered`)
    return `${this.constructor.name} - OnPush`
  }

  ngOnInit() {
    //
  }
}
