import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface CategoryResponseDto {
  categoryId: number;    // was "id"
  tenantId: number;
  name: string;
  parentCategoryId?: number;  // was "parentId"
  status: boolean;
  imageUrl?: string; // ✅ ADD THIS (IMPORTANT)

}

@Injectable()
export class CategoryService {
  constructor(private api: ApiService) {}

  // GET /Category/tenant/{tenantId}?pageNumber=1&pageSize=1000
  getCategoriesByTenant(tenantId: number): Observable<CategoryResponseDto[]> {
    return this.api
      .get<any>(`/Category/tenant/${tenantId}`, { pageNumber: 1, pageSize: 1000 })
      .pipe(map((res) => res.data?.items || []));
  }

  // GET /Category/{id}
  getCategoryById(id: number): Observable<CategoryResponseDto> {
    return this.api
      .get<any>(`/Category/${id}`)
      .pipe(map((res) => res.data));
  }
}