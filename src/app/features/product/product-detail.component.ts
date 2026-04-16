import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductResponseDto, ProductService } from '../../core/services/product.service';
import { CartItem, CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: ProductResponseDto | null = null;
  loading = true;
  error = false;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stockQty) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.product) return;
    const item: CartItem = {
      productId: this.product.productId,
      name: this.product.name,
      price: this.product.price,
      imageUrl: this.product.imageUrl || '',
      quantity: this.quantity,
      stockQty: this.product.stockQty
    };
    this.cartService.addToCart(item);
  }
}
