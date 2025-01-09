import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtcToLocalTimePipe } from './pipes/utc-to-localtime.pipe';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'messenger-client';
}
