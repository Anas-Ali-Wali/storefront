import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AccountProfileComponent } from './profile/profile.component';
import { AccountOrdersComponent } from './orders/orders.component';
import { AuthGuard } from '../../core/guards/auth.guard';

@NgModule({
  declarations: [AccountProfileComponent, AccountOrdersComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'profile', component: AccountProfileComponent, canActivate: [AuthGuard] },
      { path: 'orders', component: AccountOrdersComponent, canActivate: [AuthGuard] },
    ]),
  ],
})
export class AccountModule {}
