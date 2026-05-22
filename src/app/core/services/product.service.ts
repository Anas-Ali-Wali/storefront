  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { ApiService } from './api.service';

export interface ProductResponseDto {
  productId:   number;
  tenantId:    number;
  name:        string;
  description?: string;
  price:       number;
  imageUrl?:   string;
  categoryId?: number;
  stockQty:    number;
  status:      boolean;
  createdDate: string;
  imagesUrls:  string[];

  // ✅ Naye fields
  sizes:   string[];
  colors:  string[];
  sku?:    string;
  brand?:  string;

    images: ProductImageDto[];
}


// ✅ NEW — add karo
export interface ProductImageDto {
  imageId:   number;
  imageUrl:  string;
  colorName: string;
  isPrimary: boolean;
  orderNo:   number;
}

  export type Product = ProductResponseDto;

  export interface PaginatedProducts {
    items: ProductResponseDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }

  @Injectable()
  export class ProductService {
    constructor(private api: ApiService) {}

    // GET /Product/tenant/{tenantId}
    getProductsByTenant(
      tenantId: number,
      pageNumber = 1,
      pageSize = 20
    ): Observable<PaginatedProducts> {
      return this.api
        .get<any>(`/Product/tenant/${tenantId}`, { pageNumber, pageSize })
        .pipe(map((res) => res.data));
    }

    // GET /Product/{id}
    getProductById(id: number): Observable<ProductResponseDto> {
      return this.api
        .get<any>(`/Product/${id}`)
        .pipe(map((res) => res.data));
    }

    // GET /Product/category/{categoryId}
    getProductsByCategory(
      categoryId: number,
      pageNumber = 1,
      pageSize = 20
    ): Observable<PaginatedProducts> {
      return this.api
        .get<any>(`/Product/category/${categoryId}`, { pageNumber, pageSize })
        .pipe(map((res) => res.data));
    }

    // ✅ NEW — product ki sari images lao
getProductImages(productId: number): Observable<ProductImageDto[]> {
  return this.api
    .get<any>(`/ProductImage/${productId}`)
    .pipe(map((res) => res.data));
}
  }