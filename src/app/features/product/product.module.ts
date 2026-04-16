import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductDetailComponent } from './product-detail.component';
import { ImageGalleryComponent } from './image-gallery/image-gallery.component';

@NgModule({
  declarations: [ProductDetailComponent, ImageGalleryComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: ':id', component: ProductDetailComponent }])],
})
export class ProductModule {}
