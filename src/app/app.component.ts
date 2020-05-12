import { AfterViewInit, Component } from '@angular/core';
import { Device, DevicePoint, OneStepGpsService } from './one-step-gps/one-step-gps.service';
import { LeafletService } from './core/leaflet.service';
import { map } from 'rxjs/operators';
import * as R from 'ramda';
import * as moment from 'moment';

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
      this.oneStepGpsService.printOutTable(onlineDevices, 'Online:');
      this.oneStepGpsService.printOutTable(offlineDevices, 'Offline: ');

      this.oneStepGpsService.printOutTable(
        devicesWithLastPoint.filter(({latest_device_point}: Device) => (this.isInMinneapolis(latest_device_point))),
        'Minneapolis Vehicles:',
      );
    });
  }

  addDevicePointAsLeafletCircle(point: DevicePoint): void {
    this.leafletService.addCircle(
      point.lat, point.lng, 'red', '#ff0033', 0.5, 50
    );
  }

  isInMinneapolis({lat, lng}: DevicePoint): boolean {
    // return lat
    /**
     * ^ (lat >0)
     * |
     * |   ----------------- [top-right][north-east][NE]
     * |   |                      |
     * |   |                      |
     * |   |                      |
     * |   |                      |
     * |   [bottom-left]----------
     * |   [south-west][SW]
     * |
     * <----------------------------- (lng <0)
     */
    const minneapolis = {
      topRight: {
        lat: 45.333808,
        lng: -92.852934,
      },
      bottomLeft: {
        lat:  44.763414,
        lng:  -93.603020,
      },
    };

    return minneapolis.bottomLeft.lng < lng && lng < minneapolis.topRight.lng
      && minneapolis.bottomLeft.lat < lat && lat < minneapolis.topRight.lat;
  }

  drawPointsFromHistoryOfDevice(deviceId, start = this.yesterdayStartOfDay(), end = this.yesterdayEndOfDay()) {
    // const queryParamsFromUI = 'dtf=2020-04-16T07%3A00%3A00.000Z&dtt=2020-04-17T07%3A00%3A00.000Z';
    // const yesterdayMorning = '2020-04-16T07:00:00.00Z';
    // const yesterdayNight = '2020-04-17T07:00:00.00Z';
    this.oneStepGpsService.devicePoints(deviceId, {start, end}).subscribe((d) => {
      d.result_list.forEach(this.addDevicePointAsLeafletCircle.bind(this));
      console.log(d);
    });
  }

  yesterdayStartOfDay(): string {
    return moment().utc().subtract(1, 'day').startOf('day').toISOString();
  }

  yesterdayEndOfDay(): string {
    return moment().utc().subtract(1, 'day').startOf('day').toISOString();
  }
}
