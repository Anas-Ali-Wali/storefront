import { Component, Input, OnInit } from '@angular/core';
import { FullSection, SectionDataResponseDto } from '../../../core/services/cms.service';
import { ProductResponseDto, ProductService, PaginatedProducts } from '../../../core/services/product.service';
import { CartItem, CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css'],
})
export class FeaturedProductsComponent implements OnInit {
  @Input() section!: FullSection;
  products: ProductResponseDto[] = [];
  cardStyle = 'fashion'; // default

  private apiBase = environment.apiBase;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService,
    private tenantResolver: TenantResolverService
  ) {}

  // ngOnInit(): void {
  //   // ✅ Settings se card style lo
  //   const settings = this.tenantResolver.getSavedSettings();
  //   if (settings?.cardStyle) {
  //     this.cardStyle = settings.cardStyle;
  //   }

  //   const raw = this.section.data.find(
  //     (item: SectionDataResponseDto) => item.key === 'productIds'
  //   )?.value;
  //   const productIds: number[] = raw
  //     ? raw.split(',').map((id: string) => Number(id.trim())).filter(Boolean)
  //     : [];

  //   if (productIds.length > 0) {
  //     productIds.forEach((id: number) => {
  //       this.productService.getProductById(id).subscribe({
  //         next: (product) => this.products.push(product),
  //         error: () => {}
  //       });
  //     });
  //   } else {
  //     this.productService.getProductsByTenant(this.auth.getTenantId() ?? 0, 1, 25).subscribe({
  //       next: (res: PaginatedProducts) => (this.products = res.items),
  //       error: () => {}
  //     });
  //   }
  // }


  ngOnInit(): void {
  // ✅ Direct localStorage se read karo
  const raw = localStorage.getItem('tenant_settings');
  const settings = raw ? JSON.parse(raw) : null;
  
  if (settings?.cardStyle) {
    this.cardStyle = settings.cardStyle;
  }
  
  console.log('cardStyle loaded:', this.cardStyle); // confirm karo

  const sectionRaw = this.section.data.find(
    (item: SectionDataResponseDto) => item.key === 'productIds'
  )?.value;
  const productIds: number[] = sectionRaw
    ? sectionRaw.split(',').map((id: string) => Number(id.trim())).filter(Boolean)
    : [];

  if (productIds.length > 0) {
    productIds.forEach((id: number) => {
      this.productService.getProductById(id).subscribe({
        next: (product) => this.products.push(product),
        error: () => {}
      });
    });
  } else {
    this.productService.getProductsByTenant(this.auth.getTenantId() ?? 0, 1, 25).subscribe({
      next: (res: PaginatedProducts) => (this.products = res.items),
      error: () => {}
    });
  }
}

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
      imageUrl: this.getImageUrl(product.imageUrl),
      quantity: 1,
      stockQty: product.stockQty
    };
    this.cartService.addToCart(item);
  }



  // ✅ Yahan add karo
getBadgeClass(): string {
  const classes: Record<string, string> = {
    fashion:  'rounded-sm',
    badge:    'rounded',
    minimal:  'rounded-sm',
    colorbg:  'rounded-full',
  };
  return classes[this.cardStyle] || 'rounded-md';
}
}