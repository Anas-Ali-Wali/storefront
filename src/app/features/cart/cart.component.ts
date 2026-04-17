import { Component } from '@angular/core';
import { CartItem, CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
     cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 500;
  tax = 0;
  total = 0;


  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  updateQty(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(productId);
      return;
    }
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

}
