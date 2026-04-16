import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'shop',
    loadChildren: () => import('./features/shop/shop.module').then((m) => m.ShopModule),
  },
  {
    path: 'product',
    loadChildren: () => import('./features/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.module').then((m) => m.CheckoutModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'account',
    loadChildren: () => import('./features/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'page/:slug',
    loadChildren: () => import('./cms/cms.module').then((m) => m.CmsModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
