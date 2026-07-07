import { Component, Input } from '@angular/core';
import { FullSection, SectionDataResponseDto } from '../../../core/services/cms.service';
import { ProductResponseDto, ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { TenantSliderResponse, TenantSliderService } from 'src/app/core/services/tenant-slider.service';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';
import { Subscription } from 'rxjs';
import { HeroGallerySyncService } from 'src/app/core/services/hero-gallery-sync.service';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.css'],
})
export class HeroBannerComponent {
  @Input() section!: FullSection;

  slides: TenantSliderResponse[] = [];
  currentIndex = 0;
  interval: any;
  loading = true;
  error = false;

  manualSlide: TenantSliderResponse | null = null;   // ← NEW: gallery click se aaya slide
  private gallerySub!: Subscription;

  constructor(
    private tenantSliderService: TenantSliderService,
    private tenantResolver: TenantResolverService,
    private heroGallerySync: HeroGallerySyncService   // ← NEW
  ) {}

  ngOnInit(): void {
    const tenantId = this.tenantResolver.getTenantId();

    if (!tenantId) {
      console.error('HeroBanner: tenantId not resolved');
      this.error = true;
      this.loading = false;
      return;
    }

    this.tenantSliderService.getActiveSliders(tenantId).subscribe({
      next: (sliders) => {
        this.slides = (sliders || []).filter(s => !s.isPresetImage);
        this.loading = false;
        if (this.slides.length > 1) {
          this.startAutoSlide();
        }
      },
      error: (err) => {
        console.error('HeroBanner: failed to load sliders', err);
        this.error = true;
        this.loading = false;
      }
    });

    // ← NEW: gallery se click hone par sunte raho
    this.gallerySub = this.heroGallerySync.selectedImage$.subscribe((img) => {
      if (img) {
        this.manualSlide = img;
        clearInterval(this.interval);   // manual selection ke waqt auto-slide rok do
      }
    });
  }

  // ← NEW: template ab isi ko use karega slides[currentIndex] ki jagah
  get activeSlide(): TenantSliderResponse | null {
    return this.manualSlide || this.slides[this.currentIndex] || null;
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.manualSlide = null;   // auto-rotation resume ho to manual override clear ho jaye
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }, 4000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.gallerySub?.unsubscribe();
  }

}


