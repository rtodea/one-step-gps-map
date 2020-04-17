import { AfterViewInit, Component } from '@angular/core';
import { OneStepGpsService } from './one-step-gps/one-step-gps.service';
import { LeafletService } from './core/leaflet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'one-step-gps-map';

  constructor(private oneStepGpsService: OneStepGpsService,
              private leafletService: LeafletService) {
  }

  ngAfterViewInit() {
    this.oneStepGpsService.devices().subscribe(console.log);
    const deviceName = 'Gene - OBDII - New';
    const deviceId = '6dCt9ZZ2NXHeRk81f07-0-';
    const queryParamsFromUI = 'dtf=2020-04-16T07%3A00%3A00.000Z&dtt=2020-04-17T07%3A00%3A00.000Z';
    const yesterdayMorning = '2020-04-16T07:00:00.00Z';
    const yesterdayNight = '2020-04-17T07:00:00.00Z';
    this.oneStepGpsService.devicePoints(deviceId, {start: yesterdayMorning, end: yesterdayNight}).subscribe((d) => {
      d.result_list.forEach((point) => this.leafletService.addCircle(
        point.lat, point.lng, 'red', '#ff0033', 0.5, 50
      ));
      console.log(d);
    });
  }
}
