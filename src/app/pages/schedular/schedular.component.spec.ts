import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedularComponent } from './schedular.component';

describe('SchedularComponent', () => {
  let component: SchedularComponent;
  let fixture: ComponentFixture<SchedularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedularComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
