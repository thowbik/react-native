import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmiverifyComponent } from './emiverify.component';

describe('EmiverifyComponent', () => {
  let component: EmiverifyComponent;
  let fixture: ComponentFixture<EmiverifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmiverifyComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmiverifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
