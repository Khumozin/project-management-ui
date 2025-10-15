import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Projects {}
