import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SectionRendererComponent } from './section-renderer/section-renderer.component';
import { HeroBannerComponent } from './sections/hero-banner/hero-banner.component';
import { FeaturedProductsComponent } from './sections/featured-products/featured-products.component';
import { CategoryGridComponent } from './sections/category-grid/category-grid.component';
import { PromoBannerComponent } from './sections/promo-banner/promo-banner.component';

@NgModule({
  declarations: [SectionRendererComponent, HeroBannerComponent, FeaturedProductsComponent, CategoryGridComponent, PromoBannerComponent],
  imports: [SharedModule],
  exports: [SectionRendererComponent, HeroBannerComponent, FeaturedProductsComponent, CategoryGridComponent, PromoBannerComponent],
})
export class CmsSharedModule {}
