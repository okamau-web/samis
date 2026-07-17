import { TestBed } from '@angular/core/testing';

import { GovernmentUser } from './government-user';

describe('GovernmentUser', () => {
  let service: GovernmentUser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GovernmentUser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
