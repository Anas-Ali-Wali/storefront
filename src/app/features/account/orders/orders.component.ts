import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-account-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class AccountOrdersComponent implements OnInit {
 orders: any[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  // ngOnInit(): void {
  //   const tenantId = this.authService.getTenantId();  // ← from auth service

  //   this.orderService.getMyOrders(tenantId).subscribe({
  //     next: (res) => {
  //       this.orders = res?.items || [];
  //       this.loading = false;
  //     },
  //     error: () => (this.loading = false)
  //   });
  // }

  ngOnInit(): void {
  const tenantId = this.authService.getTenantId();

  if (!tenantId) {
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
