import { Component, input } from '@angular/core';

@Component({
  selector: 'app-timer',
  template: `
    <span class="timer" [class.timer-warning]="isWarning()" [class.timer-critical]="isCritical()">
      {{ displayTime() }}
    </span>
  `,
  styles: [':host { display: inline-block; }']
})
export class TimerComponent {
  readonly seconds = input(0);
  
  isWarning = () => this.seconds() > 10 && this.seconds() <= 30;
  isCritical = () => this.seconds() <= 10;

  displayTime(): string {
    const s = this.seconds();
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
}
