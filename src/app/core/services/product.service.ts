  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { ApiService } from './api.service';

  export interface ProductResponseDto {
    productId: number;
    tenantId: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
    stockQty: number;
    status: boolean;
    createdDate: string;
    imagesUrls: string[];
  }

  // Alias so old components still work
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
  }