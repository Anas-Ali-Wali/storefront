import { Component, Input } from '@angular/core';
import {  FullSection, SectionDataResponseDto } from '../../../core/services/cms.service';

@Component({
  selector: 'app-promo-banner',
  templateUrl: './promo-banner.component.html',
  styleUrls: ['./promo-banner.component.css'],
})
export class PromoBannerComponent {
@Input() section!: FullSection;

//   get headline(): string {
//     return this.section.data.find((item: SectionDataResponseDto) => item.key === 'headline')?.value || 'Special offer';
//   }

//   get cta(): string {
//     return this.section.data.find((item: SectionDataResponseDto) => item.key === 'cta')?.value || 'Shop now';
//   }

//   get link(): string {
//     return this.section.data.find((item: SectionDataResponseDto) => item.key === 'link')?.value || '/shop';
//   }


  private getValue(key: string): string {
    return this.section?.data?.find((x: SectionDataResponseDto) => x.key === key)?.value || '';
  }

  get headline(): string {
    return this.getValue('headline') || 'Special Offer';
  }

  get cta(): string {
    return this.getValue('cta') || 'Shop Now';
  }

  get link(): string {
    return this.getValue('link') || '/shop';
  }

}
