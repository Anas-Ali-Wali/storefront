import { Component, Input, OnInit } from '@angular/core';
import { FullSection } from '../../../core/services/cms.service';
import {  CategoryResponseDto, CategoryService } from '../../../core/services/category.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css'],
})
export class CategoryGridComponent implements OnInit {
  @Input() section!: FullSection;
  categories: CategoryResponseDto[] = [];

  constructor(private categoryService: CategoryService,private auth: AuthService
) {}

  ngOnInit(): void {
      const tenantId = this.auth.getTenantId() ?? 0; // ← ADD
    this.categoryService.getCategoriesByTenant(tenantId).subscribe({
      next: (cats) => (this.categories = cats),
      error: () => {}
    });
  }
}
