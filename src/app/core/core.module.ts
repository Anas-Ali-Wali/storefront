import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './services/api.service';

import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { AuthService } from './services/auth.service';
import { CmsService } from './services/cms.service';
import { TenantInterceptor } from './interceptors/jwt.interceptor';

// @NgModule({
//   imports: [HttpClientModule],
//   providers: [
//     ApiService,
//     ProductService,
//     CategoryService,
//     CartService,
//     OrderService,
//     AuthService,
//     CmsService,
//     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
//   ],
// })
@NgModule({
  imports: [HttpClientModule],
  providers: [
    ApiService,
    ProductService,
    CategoryService,
    CartService,
    OrderService,
    AuthService,
    CmsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TenantInterceptor,
      multi: true
    }
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import CoreModule in AppModule only.');
    }
  }
}
