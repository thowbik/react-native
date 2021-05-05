import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmimodalComponent } from './emimodal.component';

describe('EmimodalComponent', () => {
  let component: EmimodalComponent;
  let fixture: ComponentFixture<EmimodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmimodalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmimodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
