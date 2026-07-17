import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentUserDetails } from './government-user-details';

describe('GovernmentUserDetails', () => {
  let component: GovernmentUserDetails;
  let fixture: ComponentFixture<GovernmentUserDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentUserDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentUserDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
