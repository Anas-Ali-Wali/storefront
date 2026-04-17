import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  productId: number;   // was "id" — matches ProductResponseDto.productId
  name: string;        // was "title" — matches ProductResponseDto.name
  price: number;
  imageUrl: string;    // was "image" — matches ProductResponseDto.imageUrl
  quantity: number;
  stockQty: number;   
   // added — needed for stock validation
  badge?: string;    // yeh add karein
  variant?: string;  // yeh add karein

}

@Injectable()
export class CartService {
  private readonly storageKey = 'storefront_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();
  // cartCount$ = this.cartSubject.pipe(
  //   // total item count for header badge
  // );

    // ✅ FIX - yeh properly define karo
  cartCount$ = this.cartSubject.pipe(
    map(items => items.reduce((total, item) => total + item.quantity, 0))
  );


  private loadCart(): CartItem[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.cartSubject.next(items);
  }

  getItems(): CartItem[] {
    return this.cartSubject.value;
  }

  getCount(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  addToCart(item: CartItem): void {
    const items = [...this.cartSubject.value];
    const existing = items.find((c) => c.productId === item.productId);
    if (existing) {
      // Don't exceed stock
      existing.quantity = Math.min(existing.quantity + item.quantity, item.stockQty);
    } else {
      items.push({ ...item });
    }
    this.saveCart(items);
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = this.cartSubject.value.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.saveCart(items);
  }

  removeItem(productId: number): void {
    this.saveCart(this.cartSubject.value.filter((item) => item.productId !== productId));
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.cartSubject.value.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
  }
}