import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSecInfoPage } from './class-sec-info.page';

describe('ClassSecInfoPage', () => {
  let component: ClassSecInfoPage;
  let fixture: ComponentFixture<ClassSecInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSecInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSecInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
