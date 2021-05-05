import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInfoPage } from './student-info.page';

describe('StudentInfoPage', () => {
  let component: StudentInfoPage;
  let fixture: ComponentFixture<StudentInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
