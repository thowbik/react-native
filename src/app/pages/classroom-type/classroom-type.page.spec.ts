import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomTypePage } from './classroom-type.page';

describe('ClassroomTypePage', () => {
  let component: ClassroomTypePage;
  let fixture: ComponentFixture<ClassroomTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassroomTypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
