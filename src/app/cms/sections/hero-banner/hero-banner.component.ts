import { Component, Input } from '@angular/core';
import { FullSection, SectionDataResponseDto } from '../../../core/services/cms.service';
import { ProductResponseDto, ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { TenantSliderResponse, TenantSliderService } from 'src/app/core/services/tenant-slider.service';

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

  constructor(private sliderService: TenantSliderService) { }

  ngOnInit(): void {
    this.sliderService.getActiveSliders().subscribe({
      next: (data) => {
        this.slides = (data || [])
          .filter(s => s.isActive)
          .sort((a, b) => a.orderNo - b.orderNo);
        this.loading = false;
        this.startAutoSlide();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  startAutoSlide(): void {
    if (this.slides.length > 1) {
      this.interval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      }, 4000);
    }
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

}


