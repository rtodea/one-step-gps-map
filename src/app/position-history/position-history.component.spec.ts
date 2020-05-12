import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionHistoryComponent } from './position-history.component';

describe('PositionHistoryComponent', () => {
  let component: PositionHistoryComponent;
  let fixture: ComponentFixture<PositionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
