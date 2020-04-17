import { AfterViewInit, Component } from '@angular/core';
import { OneStepGpsService } from './one-step-gps/one-step-gps.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'one-step-gps-map';

  constructor(private oneStepGpsService: OneStepGpsService) {
  }

  ngAfterViewInit() {
    this.oneStepGpsService.devices().subscribe(console.log);

    const deviceName = 'Gene - OBDII - New';
    const deviceId = '6dCt9ZZ2NXHeRk81f07-0-';
    const yesterdayMorning = '';
    const yesterdayNight = '';
    this.oneStepGpsService.devicePoints(deviceId, {start: yesterdayMorning, end: yesterdayNight}).subscribe(console.log);
  }
}
