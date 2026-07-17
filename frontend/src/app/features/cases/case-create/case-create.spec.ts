import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCreate } from './case-create';

describe('CaseCreate', () => {
  let component: CaseCreate;
  let fixture: ComponentFixture<CaseCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
