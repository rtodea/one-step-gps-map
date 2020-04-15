import { TestBed } from '@angular/core/testing';

import { OneStepGpsService } from './one-step-gps.service';
import { HttpClientModule } from '@angular/common/http';

describe('OneStepGpsService', () => {
  let service: OneStepGpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(OneStepGpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should compute the correct URL', () => {
    expect(service.devicesUrl()).toBe('https://track.onestepgps.com/v3/api/public/device');
  });
});
