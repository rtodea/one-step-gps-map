import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneStepGpsDeviceListComponent } from './one-step-gps-device-list.component';

describe('OneStepGpsDeviceListComponent', () => {
  let component: OneStepGpsDeviceListComponent;
  let fixture: ComponentFixture<OneStepGpsDeviceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneStepGpsDeviceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneStepGpsDeviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
