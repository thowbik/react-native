import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAttendancePage } from './staff-attendance.page';

describe('StaffAttendancePage', () => {
  let component: StaffAttendancePage;
  let fixture: ComponentFixture<StaffAttendancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffAttendancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
