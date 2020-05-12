import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OneStepGpsService } from '../one-step-gps/one-step-gps.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-position-history',
  templateUrl: './position-history.component.html',
  styleUrls: ['./position-history.component.css']
})
export class PositionHistoryComponent implements OnInit {
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, private oneStepGps: OneStepGpsService) {
    this.formGroup = formBuilder.group({
      deviceId: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
  }

  onDraw() {
    const { deviceId, startDate, endDate } = this.formGroup.value as {deviceId: string, startDate: Moment, endDate: Moment};
    this.oneStepGps.devicePoints(deviceId, {start: startDate.toISOString(), end: endDate.toISOString()})
      .subscribe(({result_list}) => {
      });
  }

  onDelete() {
  }
}
