import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentUserForm } from './government-user-form';

describe('GovernmentUserForm', () => {
  let component: GovernmentUserForm;
  let fixture: ComponentFixture<GovernmentUserForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentUserForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentUserForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
