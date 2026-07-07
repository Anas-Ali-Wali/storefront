import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
 shippingMethod = 'standard';
  customerAddress = '';
  city = '';
  paymentMethod = 'Cash';
  cartItems = this.cartService.getItems();
  total = this.cartService.getTotal();
  loading = false;
  error = '';

  customerName = '';
  customerEmail = '';
  customerPhone = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private tenantResolver: TenantResolverService   // 👈 AuthService ki jagah
  ) {}

  ngOnInit(): void {
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  submit(): void {
    if (!this.customerName) return;

    const tenantId = this.tenantResolver.getTenantId();

    if (!tenantId) {
      this.error = 'Store information could not be loaded. Please refresh and try again.';
      return;
    }

    this.loading = true;

    this.orderService.createOrder({
      tenantId: tenantId,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      totalAmount: this.total,
      status: 'Pending'
    }).subscribe({
      next: (order) => {
        const details = this.cartItems.map((item) =>
          this.orderService.addOrderDetail({
            orderId: order.orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })
        );

        Promise.all(details.map((d) => d.toPromise())).then(() => {
          this.loading = false;
          this.cartService.clearCart();
          this.router.navigate(['/shop']);
        }).catch(() => {
          this.error = 'Order placed but details could not be saved. Please contact support.';
          this.loading = false;
        });
      },
      error: () => {
        this.error = 'Order failed. Please try again.';
        this.loading = false;
      }
    });
  }

}
