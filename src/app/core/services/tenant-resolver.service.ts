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

  // resolve(): Observable<any> {
  //   const slug = this.getSlugFromUrl();

  //   return this.http.get<any>(
  //     `${environment.apiUrl}/tenant/by-slug/${slug}`
  //   ).pipe(
  //     tap((res) => {
  //       if (res?.data?.tenantId) {
  //         this.resolvedTenantId = Number(res.data.tenantId);
  //         localStorage.setItem('website_tenant_id', String(this.resolvedTenantId));
  //       }
  //     }),
  //     catchError(() => of(null))
  //   );
  // }


resolve(): Observable<any> {
  const tenantIdFromUrl = this.getTenantIdFromUrl();
  if (tenantIdFromUrl !== null) {
    this.resolvedTenantId = tenantIdFromUrl;
    localStorage.setItem('website_tenant_id', String(this.resolvedTenantId));
    return of({ data: { tenantId: this.resolvedTenantId } });
  }

  const storedTenantId = this.getStoredTenantId();
  if (storedTenantId !== null) {
    this.resolvedTenantId = storedTenantId;
    return of({ data: { tenantId: this.resolvedTenantId } });
  }

  const slug = this.getSlugFromUrl();
  if (!slug) {
    return of(null);
  }

  return this.http.get<any>(
    `${environment.apiUrl}/tenant/by-slug/${encodeURIComponent(slug)}`
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
    if (this.resolvedTenantId !== null) return this.resolvedTenantId;
    return this.getStoredTenantId();
  }

private getStoredTenantId(): number | null {
  const stored = localStorage.getItem('website_tenant_id');
  if (!stored) return null;
  const tenantId = Number(stored);
  return Number.isNaN(tenantId) ? null : tenantId;
}

private getTenantIdFromUrl(): number | null {
  const params = new URLSearchParams(window.location.search);
  const tenantIdValue = params.get('tenantId') ?? params.get('tenant_id');
  if (!tenantIdValue) return null;
  const tenantId = Number(tenantIdValue);
  return Number.isNaN(tenantId) ? null : tenantId;
}

private getSlugFromUrl(): string {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 3) return parts[0];

  const params = new URLSearchParams(window.location.search);
  return params.get('tenant') || params.get('tenantSlug') || '';
}
}