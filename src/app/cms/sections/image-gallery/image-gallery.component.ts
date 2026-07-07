import { Component, Input } from '@angular/core';
import { FullSection } from 'src/app/core/services/cms.service';
import { HeroGallerySyncService } from 'src/app/core/services/hero-gallery-sync.service';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';
import { TenantSliderResponse, TenantSliderService } from 'src/app/core/services/tenant-slider.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent {
  @Input() section!: FullSection;

  images: TenantSliderResponse[] = [];
  loading = true;
  error = false;

  constructor(
    private tenantSliderService: TenantSliderService,
    private tenantResolver: TenantResolverService,
    private heroGallerySync: HeroGallerySyncService
  ) {}

  ngOnInit(): void {
    const tenantId = this.tenantResolver.getTenantId();

    if (!tenantId) {
      console.error('ImageGallery: tenantId not resolved');
      this.error = true;
      this.loading = false;
      return;
    }

    this.tenantSliderService.getPresetImages(tenantId).subscribe({
      next: (images) => {
        // ← sirf pehli 3 images (orderNo ke hisaab se sort karke)
        const sorted = (images || []).sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0));
        this.images = sorted.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        console.error('ImageGallery: failed to load preset images', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  onImageClick(img: TenantSliderResponse): void {
    this.heroGallerySync.selectImage(img);
    document.querySelector('.hero-banner-root')?.scrollIntoView({ behavior: 'smooth' });
  }

}
