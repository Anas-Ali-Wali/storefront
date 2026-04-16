import { Component, Input } from '@angular/core';
import { FullSection } from '../../core/services/cms.service';

@Component({
  selector: 'app-section-renderer',
  templateUrl: './section-renderer.component.html',
  styleUrls: ['./section-renderer.component.css'],
})
export class SectionRendererComponent {
    // @Input() section: any; // 👈 ADD THIS

  @Input() section!: FullSection;


  get mappedType(): string {
  const type = this.section?.type?.toLowerCase()?.trim() || '';

  const map: Record<string, string> = {
    hero: 'hero-banner',
    'hero-banner': 'hero-banner',
    products: 'featured-products',
    'featured-products': 'featured-products',
    banner: 'promo-banner',
    'promo-banner': 'promo-banner',
    category: 'category-grid',
    'category-grid': 'category-grid',
    'promo banner': 'promo-banner',
    'category grid': 'category-grid',
    'featured products': 'featured-products',
    'hero banner': 'hero-banner',
  };

  return map[type] || type.replace(/\s+/g, '-');
}
}


  // get mappedType(): string {
  //   const map: Record<string, string> = {
  //     Hero: 'hero-banner',
  //     'hero-banner': 'hero-banner',
  //     Products: 'featured-products',
  //     'featured-products': 'featured-products',
  //     Banner: 'promo-banner',
  //     'promo-banner': 'promo-banner',
  //     Category: 'category-grid',
  //     'category-grid': 'category-grid',
  //   };

  //   return map[this.section.type] || this.section.type.toLowerCase().replace(/\s+/g, '-');
  // }

