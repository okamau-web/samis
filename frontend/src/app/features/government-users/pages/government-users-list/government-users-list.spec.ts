import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentUsersList } from './government-users-list';

describe('GovernmentUsersList', () => {
  let component: GovernmentUsersList;
  let fixture: ComponentFixture<GovernmentUsersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentUsersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentUsersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
