import { TestBed } from '@angular/core/testing';

import { TenantSliderService } from './tenant-slider.service';

describe('TenantSliderService', () => {
  let service: TenantSliderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantSliderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
