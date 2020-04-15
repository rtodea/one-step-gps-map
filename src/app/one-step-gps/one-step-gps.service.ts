import { Injectable } from '@angular/core';
import { EnvironmentService, ONE_STEP_GPS_API_KEY, ONE_STEP_GPS_API_URL } from '../core/environment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UrlString = string;

export type Device = {};

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

  devices(): Observable<Device> {
    return this.httpClient.get<Device>(this.devicesUrl(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      }
    });
  }

  devicesUrl(): UrlString {
    return [
      this.apiUrl,
      'device',
    ].join('/');
  }

  devicePointUrl(): UrlString {
    return [
      this.apiUrl,
      'device-point'
    ].join('/');
  }
}
