import { Component, Input } from '@angular/core';
import {  FullSection, SectionDataResponseDto } from '../../../core/services/cms.service';

@Component({
  selector: 'app-promo-banner',
  templateUrl: './promo-banner.component.html',
  styleUrls: ['./promo-banner.component.css'],
})
export class PromoBannerComponent {
@Input() section!: FullSection;

  get headline(): string {
    return this.section.data.find((item: SectionDataResponseDto) => item.key === 'headline')?.value || 'Special offer';
  }

  get cta(): string {
    return this.section.data.find((item: SectionDataResponseDto) => item.key === 'cta')?.value || 'Shop now';
  }

  get link(): string {
    return this.section.data.find((item: SectionDataResponseDto) => item.key === 'link')?.value || '/shop';
  }


}
