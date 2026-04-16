import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryResponseDto } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.css'],
})
export class ProductFiltersComponent {
  @Input() categories: CategoryResponseDto[] = [];
  @Output() categorySelected = new EventEmitter<number | null>();

  selectedCategoryId: number | null = null;

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId = value === 'all' ? null : +value;
    this.categorySelected.emit(this.selectedCategoryId);
  }
}
