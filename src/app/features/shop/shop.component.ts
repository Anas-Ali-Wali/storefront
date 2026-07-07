import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductResponseDto, ProductService, PaginatedProducts } from '../../core/services/product.service';
import { CategoryResponseDto, CategoryService } from 'src/app/core/services/category.service';
import { CartItem, CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
products: ProductResponseDto[] = [];
  categories: CategoryResponseDto[] = [];

  loading = false;
  error = false;

  selectedCategoryId: number | null = null;

  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  showFilters = false;
  isMobile = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private tenantResolver: TenantResolverService   // 👈 AuthService ki jagah ye
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.route.queryParams.subscribe(params => {
      this.selectedCategoryId = params['categoryId']
        ? +params['categoryId']
        : null;

      this.loadProducts();
    });

    this.loadCategories();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 1024;
    this.showFilters = !this.isMobile;
  }

  loadCategories(): void {
    const tenantId = this.tenantResolver.getTenantId();
    if (!tenantId) {
      console.error('ShopComponent: tenantId not resolved for categories');
      return;
    }

    this.categoryService.getCategoriesByTenant(tenantId).subscribe({
      next: (cats) => (this.categories = cats),
      error: () => {}
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = false;

    const tenantId = this.tenantResolver.getTenantId();
    if (!tenantId) {
      console.error('ShopComponent: tenantId not resolved for products');
      this.loading = false;
      this.error = true;
      return;
    }

    const request$ = this.selectedCategoryId
      ? this.productService.getProductsByCategory(
          this.selectedCategoryId,
          this.currentPage,
          this.pageSize
        )
      : this.productService.getProductsByTenant(
          tenantId,
          this.currentPage,
          this.pageSize
        );

    request$.subscribe({
      next: (res: PaginatedProducts) => {
        this.products = res.items;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
    this.loadProducts();

    if (this.isMobile) {
      this.showFilters = false;
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
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

  private apiBase = 'http://localhost:5025';

  getImageUrl(imageUrl?: string): string {
    if (!imageUrl) return 'assets/placeholder.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${this.apiBase}${imageUrl}`;
  }

}


//  products: ProductResponseDto[] = [];
//   categories: CategoryResponseDto[] = [];
//   loading = true;
//   error = false;
//   selectedCategoryId: number | null = null;
//   currentPage = 1;
//   pageSize = 12;
//   totalPages = 1;


//   constructor(
//     private productService: ProductService,
//     private categoryService: CategoryService,
//     private cartService: CartService,
//     private route: ActivatedRoute,
//     private auth: AuthService

//   ) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       const categoryId = params['categoryId'];
//       this.selectedCategoryId = categoryId ? +categoryId : null;
//     });
//     this.loadCategories();
//     this.loadProducts();
//   }

//   loadCategories(): void {
//     const tenantId = this.auth.getTenantId() ?? 0;
//     this.categoryService.getCategoriesByTenant(tenantId).subscribe({
//       next: (cats) => (this.categories = cats),
//       error: () => {}
//     });
//   }

//   loadProducts(): void {
//     this.loading = true;
//     this.error = false;
//     const request$ = this.selectedCategoryId
//       ? this.productService.getProductsByCategory(
//           this.selectedCategoryId,
//           this.currentPage,
//           this.pageSize
//         )
//       : this.productService.getProductsByTenant(
//           this.auth.getTenantId() ?? 0,
//           this.currentPage,
//           this.pageSize
//         );

//     request$.subscribe({
//       next: (res: PaginatedProducts) => {
//         this.products = res.items;
//         this.totalPages = res.totalPages;
//         this.loading = false;
//       },
//       error: () => {
//         this.error = true;
//         this.loading = false;
//       }
//     });
//   }

//   filterByCategory(categoryId: number | null): void {
//     this.selectedCategoryId = categoryId;
//     this.currentPage = 1;
//     this.loadProducts();
//   }

//   changePage(page: number): void {
//     this.currentPage = page;
//     this.loadProducts();
//   }

//   addToCart(product: ProductResponseDto): void {
//     const item: CartItem = {
//       productId: product.productId,
//       name: product.name,
//       price: product.price,
//       imageUrl: product.imageUrl || '',
//       quantity: 1,
//       stockQty: product.stockQty
//     };
//     this.cartService.addToCart(item);
//   }

//   showFilters = false;

// get isMobile(): boolean {
//   return window.innerWidth < 1024;
// }
