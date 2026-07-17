import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentUserTable } from './government-user-table';

describe('GovernmentUserTable', () => {
  let component: GovernmentUserTable;
  let fixture: ComponentFixture<GovernmentUserTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentUserTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentUserTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
