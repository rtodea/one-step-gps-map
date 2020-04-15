import { Injectable } from '@angular/core';

export const ONE_STEP_GPS_API_KEY = 'ONE_STEP_GPS_API_KEY';
export const ONE_STEP_GPS_API_URL = 'ONE_STEP_GPS_API_URL';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private innerMap = new Map();

  constructor() {
    this.set(ONE_STEP_GPS_API_KEY, 'kWHzHnN10Zy4z2z93cu0EgVm5bSsSFhw5NfYMHCgmzo');
    // this.set(ONE_STEP_GPS_API_URL, 'https://track.onestepgps.com/v3/api/public');
    this.set(ONE_STEP_GPS_API_URL, 'http://localhost:4201/track/v3/api/public');
  }

  get<T>(key): T {
    return this.innerMap.get(key) as T;
  }

  set<T>(key: string, value: T) {
    this.innerMap.set(key, value);
  }
}
