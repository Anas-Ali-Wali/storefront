import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface ProductImageResponseDto {
  imageId: number;
  productId: number;
  imageUrl: string;
  colorName?: string;
  isPrimary: boolean;
  orderNo: number;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {
  constructor(private api: ApiService) {}

  /**
   * Get all images for a product
   * Sorted by orderNo to maintain correct order
   */
  getImagesByProduct(productId: number): Observable<ProductImageResponseDto[]> {
    return this.api
      .get<any>(`/ProductImage/${productId}`)
      .pipe(
        map((res) => {
          // Ensure images are sorted by orderNo
          const images = res.data || [];
          return images.sort((a: ProductImageResponseDto, b: ProductImageResponseDto) => a.orderNo - b.orderNo);
        })
      );
  }
}
