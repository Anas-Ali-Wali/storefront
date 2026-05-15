import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FullSection, SectionDataResponseDto } from '../../../core/services/cms.service';
import { ProductResponseDto, ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TenantSliderResponse, TenantSliderService } from 'src/app/core/services/tenant-slider.service';
import { SliderStateService } from 'src/app/core/services/slider-state.service';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.css'],
})
export class HeroBannerComponent {
  // @Input() section!: FullSection;

  // slides: TenantSliderResponse[] = [];
  // currentIndex = 0;
  // interval: any;
  // loading = true;

  // constructor(private sliderService: TenantSliderService) { }

  // ngOnInit(): void {
  //   this.sliderService.getActiveSliders().subscribe({
  //     next: (data) => {
  //       this.slides = (data || [])
  //         .filter(s => s.isActive)
  //         .sort((a, b) => a.orderNo - b.orderNo);
  //       this.loading = false;
  //       this.startAutoSlide();
  //     },
  //     error: () => {
  //       this.loading = false;
  //     }
  //   });
  // }

  // startAutoSlide(): void {
  //   if (this.slides.length > 1) {
  //     this.interval = setInterval(() => {
  //       this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  //     }, 4000);
  //   }
  // }

  // prev(): void {
  //   this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  // }

  // next(): void {
  //   this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  // }

  // ngOnDestroy(): void {
  //   if (this.interval) clearInterval(this.interval);
  // }

@Input() section!: FullSection;

  slides: TenantSliderResponse[] = [];
  presetImages: TenantSliderResponse[] = [];
  selectedPreset: TenantSliderResponse | null = null;
  currentIndex = 0;
  interval: any;
  loading = true;
  private stateSub!: Subscription;

  constructor(
    private sliderService: TenantSliderService,
    private sliderState: SliderStateService,
    private cdr: ChangeDetectorRef  // ← ADD
  ) {}

  ngOnInit(): void {
    this.sliderService.getActiveSliders().subscribe({
      next: (data) => {
        this.slides = (data || []).filter(s => s.isActive).sort((a, b) => a.orderNo - b.orderNo);
        this.loading = false;
        this.startAutoSlide();
      },
      error: () => { this.loading = false; }
    });

    this.sliderService.getPresetImages().subscribe({
      next: (data) => {
        this.presetImages = (data || []).sort((a, b) => a.orderNo - b.orderNo);
      },
      error: () => {}
    });

    // this.stateSub = this.sliderState.selectedImage$.subscribe(image => {
this.stateSub = this.sliderState.selectedImage$.subscribe((image: TenantSliderResponse | null) => {

      this.selectedPreset = image;
      this.cdr.detectChanges();  // ← ADD
      if (image) {
        if (this.interval) clearInterval(this.interval);
      } else {
        this.startAutoSlide();
      }
    });
  }

  getCurrentBgImage(i: number): string {
    if (this.selectedPreset && i === this.currentIndex) {
      return `url(${this.selectedPreset.imageUrl})`;
    }
    return `url(${this.slides[i]?.imageUrl || ''})`;
  }

  selectPreset(preset: TenantSliderResponse): void {
    if (this.selectedPreset?.sliderId === preset.sliderId) {
      this.selectedPreset = null;
      this.startAutoSlide();
    } else {
      this.selectedPreset = preset;
      if (this.interval) clearInterval(this.interval);
    }
  }

  get activeBannerImage(): string {
    return this.selectedPreset?.imageUrl || this.slides[this.currentIndex]?.imageUrl || '';
  }

  get activeBannerBgColor(): string {
    return this.selectedPreset?.bgColor || this.slides[this.currentIndex]?.bgColor || '#111';
  }

  get activeBannerOverlay(): number {
    return this.selectedPreset?.overlayOpacity ?? this.slides[this.currentIndex]?.overlayOpacity ?? 50;
  }

  startAutoSlide(): void {
    if (this.interval) clearInterval(this.interval);
    if (this.slides.length > 1 && !this.selectedPreset) {
      this.interval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      }, 4000);
    }
  }

  prev(): void {
    this.selectedPreset = null;
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.startAutoSlide();
  }

  next(): void {
    this.selectedPreset = null;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
    if (this.stateSub) this.stateSub.unsubscribe();
  }
}


