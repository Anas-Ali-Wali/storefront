// src/app/core/services/tenant-resolver.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TenantResolverService {

  private resolvedTenantId: number | null = null;

  constructor(private http: HttpClient) {}

  resolve(): Observable<any> {
    const slug = this.getSlugFromUrl();

    return this.http.get<any>(
      `${environment.apiUrl}/tenant/by-slug/${slug}`
    ).pipe(
      tap((res) => {
        if (res?.data?.tenantId) {
          this.resolvedTenantId = Number(res.data.tenantId);
          localStorage.setItem('website_tenant_id', String(this.resolvedTenantId));
        }
      }),
      catchError(() => of(null))
    );
  }

  getTenantId(): number | null {
    if (this.resolvedTenantId) return this.resolvedTenantId;
    const stored = localStorage.getItem('website_tenant_id');
    return stored ? Number(stored) : null;
  }

  private getSlugFromUrl(): string {
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length >= 3) return parts[0]; // ali.yourstore.com → "ali"

    // Local dev: localhost:4200?tenant=ali
    const params = new URLSearchParams(window.location.search);
    return params.get('tenant') || 'default';
  }
}