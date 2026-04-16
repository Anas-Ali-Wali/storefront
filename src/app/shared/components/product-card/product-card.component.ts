import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product, ProductResponseDto } from '../../../core/services/product.service';

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


}
