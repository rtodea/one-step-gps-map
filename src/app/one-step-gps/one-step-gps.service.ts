import { Injectable } from '@angular/core';
import { EnvironmentService, ONE_STEP_GPS_API_KEY, ONE_STEP_GPS_API_URL } from '../core/environment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as urlParse from 'url-parse';

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

export type ResultList<T> = {
  result_list: T[];
};

@Injectable({
  providedIn: 'root'
})
export class OneStepGpsService {
  private apiKey: string;

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

  devicePoints(deviceId: DeviceId): Observable<ResultList<DevicePoint>> {
    return this.httpClient.get<ResultList<DevicePoint>>(
      this.devicePointsUrl(deviceId), this.authorizationHeaders());
  }

  devicePointsUrl(deviceId: DeviceId): UrlString {
    const baseUrl = [
      this.apiUrl,
      'device-point'
    ].join('/');
    const parsedUrl = urlParse(baseUrl);
    parsedUrl.set('query', {
      device_id: deviceId,
    });
    return parsedUrl.toString();
  }
}
