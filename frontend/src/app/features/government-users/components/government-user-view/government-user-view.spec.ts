import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentUserView } from './government-user-view';

describe('GovernmentUserView', () => {
  let component: GovernmentUserView;
  let fixture: ComponentFixture<GovernmentUserView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentUserView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentUserView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
