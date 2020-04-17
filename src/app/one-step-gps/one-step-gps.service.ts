import { Injectable } from '@angular/core';
import { EnvironmentService, ONE_STEP_GPS_API_KEY, ONE_STEP_GPS_API_URL } from '../core/environment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as urlParse from 'url-parse';
import * as R from 'ramda';

export type UrlString = string;

export type DeviceId = string;

export type FactoryId = string;

export type DateHourTZ = string;

export type DisplayName = string;

export type Maybe<T> = undefined | null | T;

export type ActiveState = 'active';

export type Device = {
  device_id: DeviceId
  created_at: Maybe<DateHourTZ>
  updated_at: DateHourTZ
  activated_at: Maybe<DateHourTZ>
  delivered_at: Maybe<DateHourTZ>
  factory_id: FactoryId
  active_state: ActiveState
  display_name: DisplayName
  bcc_id: string
  make: string
  model: string
  conn_type: string,
  secondary_id: string,
  latest_device_point: Maybe<any>,
  latest_accurate_device_point: Maybe<any>,
};

export type DevicePoint = {

};

export type ServerInterval = {
  dt_server_from: DateHourTZ;
  dt_server_to: DateHourTZ;
};

export type DevicePointOptions = {
  device_id: DeviceId
  device_id_list:	DeviceId[],

  limit: number; // 100 default
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
              private httpClient: HttpClient) {
    this.apiKey = this.environmentService.get(ONE_STEP_GPS_API_KEY);
    this.apiUrl = this.environmentService.get<UrlString>(ONE_STEP_GPS_API_URL);
  }

  devices(): Observable<ResultList<Device>> {
    return this.httpClient.get<ResultList<Device>>(
      this.devicesUrl(), this.authorizationHeaders());
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

  devicePoints(deviceId: DeviceId, interval?: Interval): Observable<ResultList<DevicePoint>> {
    return this.httpClient.get<ResultList<DevicePoint>>(
      this.devicePointsUrl(deviceId, interval), this.authorizationHeaders());
  }

  devicePointsUrl(deviceId: DeviceId, interval?: Interval): UrlString {
    const baseUrl = [
      this.apiUrl,
      'device-point'
    ].join('/');
    const parsedUrl = urlParse(baseUrl);
    parsedUrl.set('query', {
      device_id: deviceId,
      ...this.fromIntervalToServerInterval(interval),
    });
    return parsedUrl.toString();
  }

  fromIntervalToServerInterval(interval: Interval): Partial<ServerInterval>{
    const serverInterval: Partial<ServerInterval> = {};
    if (R.isNil(interval) || R.isEmpty(interval)) { return {}; }
    if (interval.start) {
      serverInterval.dt_server_from = interval.start;
    }
    if (interval.end) {
      serverInterval.dt_server_to = interval.end;
    }

    return serverInterval;
  }
}
