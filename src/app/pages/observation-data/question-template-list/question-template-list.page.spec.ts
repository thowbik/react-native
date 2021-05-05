import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionTemplateListPage } from './question-template-list.page';

describe('QuestionTemplateListPage', () => {
  let component: QuestionTemplateListPage;
  let fixture: ComponentFixture<QuestionTemplateListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionTemplateListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionTemplateListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
