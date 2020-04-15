import { TestBed } from '@angular/core/testing';

import { OneStepGpsService } from './one-step-gps.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('OneStepGpsService', () => {
  let service: OneStepGpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
      ]
    });
    service = TestBed.inject(OneStepGpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should compute the correct URL', () => {
    expect(service.devicesUrl())
      .toBe('http://localhost:4201/track/v3/api/public/device');
  });

  it('should add the correct query params for the devicePoint URL', () => {
    expect(service.devicePointsUrl('6dCt9ZZ2NXHeRk81f07-0-'))
      .toBe('http://localhost:4201/track/v3/api/public/device-point?device_id=6dCt9ZZ2NXHeRk81f07-0-');
  });

  // we want to make a difference between
  // IMEI: 4762022264
  // deviceId: '6dCt9ZZ2NXHeRk81f07-0-'
});
