import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';

@Component({
  selector: 'app-account-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class AccountOrdersComponent {
   orders: any[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private tenantResolver: TenantResolverService
  ) {}

  ngOnInit(): void {
    const tenantId = this.tenantResolver.getTenantId();

    if (!tenantId) {
      console.error('AccountOrders: tenantId not resolved');
      this.loading = false;
      return;
    }

    this.orderService.getMyOrders(tenantId).subscribe({
      next: (res) => {
        this.orders = res?.items || [];
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

}
