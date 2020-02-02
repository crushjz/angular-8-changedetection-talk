import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { CountViewerComponent } from './components/count-viewer/count-viewer.component'
import { CounterComponent } from './components/counter/counter.component'
import { OtherComponent } from './components/other/other.component'
import { ClickDirective } from './directives/click.directive'

@NgModule({
  declarations: [
    AppComponent,
    ClickDirective,
    CounterComponent,
    OtherComponent,
    CountViewerComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
