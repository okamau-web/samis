import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenList } from './citizen-list';

describe('CitizenList', () => {
  let component: CitizenList;
  let fixture: ComponentFixture<CitizenList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
