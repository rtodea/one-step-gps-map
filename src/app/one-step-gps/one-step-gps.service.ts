import { Injectable } from '@angular/core';
import { EnvironmentService, ONE_STEP_GPS_API_KEY, ONE_STEP_GPS_API_URL } from '../core/environment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as urlParse from 'url-parse';
import * as R from 'ramda';
import { LeafletService } from '../core/leaflet.service';

export type UrlString = string;

export type DeviceId = string;

export type FactoryId = string;

export type DateHourTZ = string;

export type DisplayName = string;

export type Maybe<T> = undefined | null | T;

export type ActiveState = 'active';

export type Device = {
  device_id: DeviceId
  display_name: DisplayName,

  created_at: Maybe<DateHourTZ>
  updated_at: DateHourTZ
  activated_at: Maybe<DateHourTZ>
  delivered_at: Maybe<DateHourTZ>

  active_state: ActiveState
  online: boolean,

  make: string
  factory_id: FactoryId
  model: string
  conn_type: string,
  secondary_id: string,
  bcc_id: string
  latest_device_point: Maybe<any>,
  latest_accurate_device_point: Maybe<any>,
};

export type ISO8601DateString = string;

export type DevicePoint = {
  lat: number; // -180 180
  lng: number; // -90 90 NumberBetweenMinus90And90
  dt_tracker: ISO8601DateString;
};

export type ServerInterval = {
  dt_server_from: DateHourTZ;
  dt_server_to: DateHourTZ;

  dt_tracker_from: DateHourTZ;
  dt_tracker_to: DateHourTZ;
};

export type DeviceOptions = {
  limit: number; // 4999
  user_id: string;
  latest_point: boolean;
  vuid: string; // 6dt7xZRjNfyzKk81f07-0-
};

export type DevicePointOptions = {
  device_id: DeviceId
  device_id_list:	DeviceId[],

  limit: number; // 100 default, 5000 maximum
  offset: number;
  return_count: boolean;

  dt_tracker_from: DateHourTZ;
  dt_tracker_to: DateHourTZ;

  sort: 'sequence,desc' | 'sequence'
} & ServerInterval;

export type ResultList<T> = {
  result_list: T[];
};

export type Interval = {
  start: DateHourTZ,
  end?: DateHourTZ,
};

@Injectable({
  providedIn: 'root'
})
export class OneStepGpsService {
  private readonly apiKey: string;

  private apiUrl: UrlString;

  constructor(private environmentService: EnvironmentService,
              private httpClient: HttpClient,
  ) {
    this.apiKey = this.environmentService.get(ONE_STEP_GPS_API_KEY);
    this.apiUrl = this.environmentService.get<UrlString>(ONE_STEP_GPS_API_URL);
  }

  devices(): Observable<ResultList<Device>> {
    return this.httpClient.get<ResultList<Device>>(
      this.devicesWithLastPositionUrl(), this.authorizationHeaders());
  }

  authorizationHeaders(): {headers: {[key: string]: string}} {
    return {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      }
    };
  }

  devicesUrl(): UrlString {
    return [
      this.apiUrl,
      'device',
    ].join('/');
  }

  devicesWithLastPositionUrl(): UrlString {
    const parsedUrl = urlParse(this.devicesUrl());
    parsedUrl.set('query', {
      latest_point: true,
    });
    return parsedUrl.toString();
  }

  devicePoints(deviceId: DeviceId, interval?: Interval): Observable<ResultList<DevicePoint>> {
    return this.httpClient.get<ResultList<DevicePoint>>(
      this.devicePointsUrl(deviceId, interval), this.authorizationHeaders()
    );
  }

  devicePointsUrl(deviceId: DeviceId, interval?: Interval): UrlString {
    const baseUrl = [
      this.apiUrl,
      'device-point'
    ].join('/');
    const parsedUrl = urlParse(baseUrl);
    parsedUrl.set('query', {
      device_id: deviceId,
      limit: 5000,
      return_count: true,
      ...this.fromIntervalToServerInterval(interval),
    });
    return parsedUrl.toString();
  }

  fromIntervalToServerInterval(interval: Interval): Partial<ServerInterval>{
    const serverInterval: Partial<ServerInterval> = {};
    if (R.isNil(interval) || R.isEmpty(interval)) { return {}; }
    if (interval.start) {
      serverInterval.dt_tracker_from = interval.start;
    }
    if (interval.end) {
      serverInterval.dt_tracker_to = interval.end;
    }

    return serverInterval;
  }

  fromDeviceToConsoleTable(d: Device) {
    return [d.display_name, `${d.device_id}`, `${d.latest_device_point.lat}, ${d.latest_device_point.lng}`];
  }

  fromDevicePointToConsoleTable(dp: DevicePoint) {
    return [`${dp.lat}, ${dp.lng}, ${dp.dt_tracker}`];
  }

  printOutTable(devices: Device[], tableName: string): void {
    console.log(tableName);
    console.table(devices.map(this.fromDeviceToConsoleTable));
  }

  printOutPointTable(devicePoints: DevicePoint[], tableName: string): void {
    console.log(tableName, `(${devicePoints.length})`);
    const snapshot = R.concat(
      R.slice(0, 10, devicePoints),
      R.takeLast(10, devicePoints),
    );
    console.table(snapshot.map(this.fromDevicePointToConsoleTable));
  }
}
