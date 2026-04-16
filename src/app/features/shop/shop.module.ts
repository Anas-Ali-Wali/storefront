import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ShopComponent } from './shop.component';
import { ProductFiltersComponent } from './product-filters/product-filters.component';

@NgModule({
  declarations: [ShopComponent, ProductFiltersComponent],
  imports: [SharedModule, FormsModule, RouterModule.forChild([{ path: '', component: ShopComponent }])],
})
export class ShopModule {}
