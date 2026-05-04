import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product, ProductResponseDto } from '../../../core/services/product.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
@Input() product!: ProductResponseDto;
  @Output() addToCart = new EventEmitter<ProductResponseDto>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }


    getImageUrl(imageUrl?: string): string {
    if (!imageUrl) return 'https://via.placeholder.com/300x300?text=Product';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${environment.apiBase}${imageUrl}`;
  }

}
