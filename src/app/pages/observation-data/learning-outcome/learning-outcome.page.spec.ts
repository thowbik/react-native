import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningOutcomePage } from './learning-outcome.page';

describe('LearningOutcomePage', () => {
  let component: LearningOutcomePage;
  let fixture: ComponentFixture<LearningOutcomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningOutcomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningOutcomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
