import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductResponseDto, ProductService } from '../../core/services/product.service';
import { CartItem, CartService } from '../../core/services/cart.service';
import { environment } from 'src/environments/environment.prod';
// import { environment } from 'src/environments/environment';

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

  // ✅ Size & Color selection
  selectedSize?: string;
  selectedColor?: string;

  private apiBase = environment.apiBase;

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

  selectSize(size: string): void {
    this.selectedSize = this.selectedSize === size ? undefined : size;
  }

  selectColor(color: string): void {
    this.selectedColor = this.selectedColor === color ? undefined : color;
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stockQty)
      this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.product) return;
    const item: CartItem = {
      productId:     this.product.productId,
      name:          this.product.name,
      price:         this.product.price,
      imageUrl:      this.getImageUrl(this.product.imageUrl),
      quantity:      this.quantity,
      stockQty:      this.product.stockQty,
      selectedSize:  this.selectedSize,   // ✅
      selectedColor: this.selectedColor,  // ✅
    };
    this.cartService.addToCart(item);
  }

  getImageUrl(imageUrl?: string): string {
    if (!imageUrl) return 'https://via.placeholder.com/600x750?text=Product';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${this.apiBase}${imageUrl}`;
  }

  getColorHex(colorName: string): string {
    const map: Record<string, string> = {
      'black':  '#191c1d',
      'white':  '#f5f5f5',
      'beige':  '#d4b896',
      'red':    '#dc2626',
      'pink':   '#f472b6',
      'nude':   '#c9956c',
      'brown':  '#92400e',
      'grey':   '#9ca3af',
      'gray':   '#9ca3af',
      'blue':   '#3b82f6',
      'green':  '#22c55e',
      'yellow': '#facc15',
    };
    return map[colorName.toLowerCase()] ?? '#ccc';
  }

}
