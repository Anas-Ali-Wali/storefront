import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsImageGalleryComponent } from './image-gallery.component';

describe('CmsImageGalleryComponent', () => {
  let component: CmsImageGalleryComponent;
  let fixture: ComponentFixture<CmsImageGalleryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CmsImageGalleryComponent]
    });
    fixture = TestBed.createComponent(CmsImageGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
