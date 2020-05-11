import { AfterViewInit, Component } from '@angular/core';
import { Device, DevicePoint, OneStepGpsService } from './one-step-gps/one-step-gps.service';
import { LeafletService } from './core/leaflet.service';
import { map } from 'rxjs/operators';
import * as R from 'ramda';

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
    this.oneStepGpsService.devices().pipe(map(({result_list}) => (result_list))).subscribe((devices) => {
      console.log('All Devices ' + devices.length, devices);
      console.log('Ones with `latest_device_point` ' + devices.length, devices);
      const devicesWithLastPoint = devices.filter((d) => !!d.latest_device_point);
      console.log(devicesWithLastPoint);
      devicesWithLastPoint.forEach((d: Device) => {
        this.addDevicePointAsLeafletCircle(d.latest_device_point);
      });

      const [onlineDevices, offlineDevices] = R.partition(R.prop('online'), devicesWithLastPoint);

      const toConsoleTable = (d: Device) => [d.display_name, `${d.latest_device_point.lat}, ${d.latest_device_point.lng}`];
      console.log('Online: ');
      console.table(onlineDevices.map(toConsoleTable));

      console.log('Offline: ');
      console.table(offlineDevices.map(toConsoleTable));
    });
  }

  addDevicePointAsLeafletCircle(point: DevicePoint): void {
    this.leafletService.addCircle(
      point.lat, point.lng, 'red', '#ff0033', 0.5, 50
    );
  }

  drawPointsFromHistoryOfDevice() {
    const deviceName = 'Gene - OBDII - New';
    const deviceId = '6dCt9ZZ2NXHeRk81f07-0-';
    const queryParamsFromUI = 'dtf=2020-04-16T07%3A00%3A00.000Z&dtt=2020-04-17T07%3A00%3A00.000Z';
    const yesterdayMorning = '2020-04-16T07:00:00.00Z';
    const yesterdayNight = '2020-04-17T07:00:00.00Z';
    this.oneStepGpsService.devicePoints(deviceId, {start: yesterdayMorning, end: yesterdayNight}).subscribe((d) => {
      d.result_list.forEach(this.addDevicePointAsLeafletCircle.bind(this));
      console.log(d);
    });
  }
}
