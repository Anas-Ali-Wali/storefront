import { Component, Input, OnInit } from '@angular/core';
import { FullSection } from '../../../core/services/cms.service';
import {  CategoryResponseDto, CategoryService } from '../../../core/services/category.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css'],
})
export class CategoryGridComponent implements OnInit {

   @Input() section!: FullSection;

  categories: CategoryResponseDto[] = [];

  constructor(
    private categoryService: CategoryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const tenantId = this.auth.getTenantId() ?? 0;

    this.categoryService.getCategoriesByTenant(tenantId).subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error(err)
    });
  }

  getImageUrl(imageUrl?: string): string {
    if (!imageUrl) return 'assets/placeholder.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${environment.apiBase}${imageUrl}`;
  }

}
