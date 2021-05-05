import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TntpContentPage } from './tntp-content.page';

describe('TntpContentPage', () => {
  let component: TntpContentPage;
  let fixture: ComponentFixture<TntpContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TntpContentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TntpContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
