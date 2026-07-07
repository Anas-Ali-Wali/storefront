import { TestBed } from '@angular/core/testing';

import { HeroGallerySyncService } from './hero-gallery-sync.service';

describe('HeroGallerySyncService', () => {
  let service: HeroGallerySyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroGallerySyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
