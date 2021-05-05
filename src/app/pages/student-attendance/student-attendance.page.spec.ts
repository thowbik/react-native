import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAttendancePage } from './student-attendance.page';

describe('StudentAttendancePage', () => {
  let component: StudentAttendancePage;
  let fixture: ComponentFixture<StudentAttendancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAttendancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
