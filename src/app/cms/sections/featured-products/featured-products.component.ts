import { Component, Input, OnInit } from '@angular/core';
import { FullSection, SectionDataResponseDto, } from '../../../core/services/cms.service';
import { Product, ProductResponseDto, ProductService, PaginatedProducts } from '../../../core/services/product.service';
import { environment } from 'src/environments/environment.prod';
import { CartItem, CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css'],
})
export class FeaturedProductsComponent  implements OnInit {
  //  implements OnInit
    @Input() section!: FullSection;
  products: ProductResponseDto[] = [];
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService

  ) {}

  ngOnInit(): void {
    const raw = this.section.data.find(
      (item: SectionDataResponseDto) => item.key === 'productIds'
    )?.value;
    const productIds: number[] = raw
      ? raw.split(',').map((id: string) => Number(id.trim())).filter(Boolean)
      : [];

    if (productIds.length > 0) {
      productIds.forEach((id: number) => {
        this.productService.getProductById(id).subscribe({
          next: (product) => this.products.push(product),
          error: () => {}
        });
      });
    } else {
      this.productService.getProductsByTenant(this.auth.getTenantId() ?? 0, 1, 4).subscribe({
        next: (res: PaginatedProducts) => (this.products = res.items),
        error: () => {}
      });
    }
  }
  // addToCart(product: ProductResponseDto): void {
  //   const item: CartItem = {
  //     productId: product.productId,
  //     name: product.name,
  //     price: product.price,
  //     imageUrl: product.imageUrl || '',
  //     quantity: 1,
  //     stockQty: product.stockQty
  //   };
  //   this.cartService.addToCart(item);
  // }


  //   products = [
  //   { name: 'M1 Chronograph', price: 249 },
  //   { name: 'Acoustic Core', price: 399 },
  //   { name: 'Canvas High', price: 85 },
  //   { name: 'Omni Tab Pro', price: 899 }
  // ];


  private apiBase = 'http://localhost:5025';

getImageUrl(imageUrl?: string): string {
  if (!imageUrl) return 'assets/placeholder.jpg';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${this.apiBase}${imageUrl}`;
}

addToCart(product: ProductResponseDto): void {
  const item: CartItem = {
    productId: product.productId,
    name: product.name,
    price: product.price,
    imageUrl: this.getImageUrl(product.imageUrl), // ✅ full URL
    quantity: 1,
    stockQty: product.stockQty
  };
  this.cartService.addToCart(item);
}

}
