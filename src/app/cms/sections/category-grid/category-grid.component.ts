import { Component, Input, OnInit } from '@angular/core';
import { FullSection } from '../../../core/services/cms.service';
import {  CategoryResponseDto, CategoryService } from '../../../core/services/category.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment.prod';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';
// import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css'],
})
export class CategoryGridComponent implements OnInit {

   @Input() section!: FullSection;

  categories: CategoryResponseDto[] = [];
    categoryCardStyle = 'square'; // default


  constructor(
    private categoryService: CategoryService,
    private auth: AuthService,
        private tenantResolver: TenantResolverService

  ) {}

  // ngOnInit(): void {
  //   const tenantId = this.auth.getTenantId() ?? 0;

  //   this.categoryService.getCategoriesByTenant(tenantId).subscribe({
  //         // next: (cats) => this.categories = cats.slice(0, 8), // ← sirf 8
  //     next: (cats) => this.categories = cats,
  //     error: (err) => console.error(err)
  //   });
  // }

    ngOnInit(): void {
    // ✅ Settings se card style lo
    const settings = this.tenantResolver.getSavedSettings();
    if (settings?.categoryCardStyle) {
      this.categoryCardStyle = settings.categoryCardStyle;
    }

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
