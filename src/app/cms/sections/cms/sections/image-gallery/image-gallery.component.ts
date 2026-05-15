import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FullSection } from 'src/app/core/services/cms.service';
import { SliderStateService } from 'src/app/core/services/slider-state.service';
import { TenantSliderResponse, TenantSliderService } from 'src/app/core/services/tenant-slider.service';

@Component({
  selector: 'app-cms-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class CmsImageGalleryComponent {
   @Input() section!: FullSection;

  images: TenantSliderResponse[] = [];
  selectedImage: TenantSliderResponse | null = null;
  loading = true;

  constructor(
    private sliderService: TenantSliderService,
    private sliderState: SliderStateService
  ) {}

  ngOnInit(): void {
    // Already selected image restore karo (agar user wapas aaya page pe)
    this.selectedImage = this.sliderState.getImage();

    this.sliderService.getPresetImages().subscribe({
      next: (data) => {
        this.images = (data || []).sort((a, b) => a.orderNo - b.orderNo);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  selectImage(image: TenantSliderResponse): void {
    if (this.selectedImage?.sliderId === image.sliderId) {
      // Same card dobara click — deselect
      this.selectedImage = null;
      this.sliderState.setImage(null);
    } else {
      this.selectedImage = image;
      this.sliderState.setImage(image);  // → HeroBanner ko signal
    }
  }

}
