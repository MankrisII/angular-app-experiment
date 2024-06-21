import { TestBed } from '@angular/core/testing';

import { HomeCustomisationService } from './home-customisation.service';

describe('HomeCustomisationService', () => {
  let service: HomeCustomisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeCustomisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
