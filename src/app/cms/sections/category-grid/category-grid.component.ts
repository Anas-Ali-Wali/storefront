import { Component, Input, OnInit } from '@angular/core';
import { FullSection } from '../../../core/services/cms.service';
import {  CategoryResponseDto, CategoryService } from '../../../core/services/category.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';

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
    private tenantResolver: TenantResolverService   // 👈 AuthService ki jagah
  ) {}

  ngOnInit(): void {
    const tenantId = this.tenantResolver.getTenantId();

    if (!tenantId) {
      console.error('CategoryGrid: tenantId not resolved');
      return;
    }

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
