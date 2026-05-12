import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-account-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class AccountProfileComponent implements OnInit {
user: any = null;
  orders: any[] = [];
  loadingOrders = true;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (this.user?.customerId && this.user?.tenantId) {
      this.orderService.getOrdersByUser(
        this.user.tenantId, 
        this.user.customerId
      ).subscribe({
        next: (res) => {
          // this.orders = res?.data || [];
          this.orders = res || [];
          this.loadingOrders = false;
        },
        error: () => (this.loadingOrders = false)
      });
    } else {
      this.loadingOrders = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }


  

}
