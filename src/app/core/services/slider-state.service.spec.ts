import { TestBed } from '@angular/core/testing';

import { SliderStateService } from './slider-state.service';

describe('SliderStateService', () => {
  let service: SliderStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SliderStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
