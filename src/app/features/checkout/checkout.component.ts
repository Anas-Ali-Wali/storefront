import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

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
  orderConfirmed = false;  // ✅ NEW
  orderId = '';            // ✅ NEW

  customerName = '';
  customerEmail = '';
  customerPhone = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private auth: AuthService // ← ADD

  ) { }

  ngOnInit(): void {
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  submit(): void {
    if (!this.customerName) return;
    this.loading = true;
    const tenantId = this.auth.getTenantId() ?? 0; // ← DYNAMIC
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

        //   Promise.all(details.map((d) => d.toPromise())).then(() => {
        //     this.cartService.clearCart();
        //     this.router.navigate(['/account/orders']);
        //   });
        // },
        Promise.all(details.map((d) => d.toPromise())).then(() => {
          this.loading = false; // ✅ ADD THIS
          this.cartService.clearCart();
          this.orderId = 'ORD-' + order.orderId;  // ✅ OrderId save
          this.orderConfirmed = true;
          // this.router.navigate(['/shop']);
        })
      },

      error: () => {
        this.error = 'Order failed. Please try again.';
        this.loading = false;
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/shop']);
  }

}
