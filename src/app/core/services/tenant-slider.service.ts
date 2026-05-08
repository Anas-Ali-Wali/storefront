import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';
import { TenantResolverService } from './tenant-resolver.service';

export interface TenantSliderResponse {
  sliderId: number;
  tenantId: number;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  orderNo: number;
  isActive: boolean;
  createdDate: string;

  // ✅ Yeh fields add karo
  layoutType: 'full-image' | 'text-only' | 'split-left' | 'split-right';
  bgColor: string;
  textColor: string;
  overlayOpacity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TenantSliderService {
constructor(
    private api: ApiService,
    private tenantResolver: TenantResolverService
  ) {}

  getActiveSliders(): Observable<TenantSliderResponse[]> {
    const tenantId = this.tenantResolver.getTenantId();

    return this.api.get<any>(`/TenantSlider/tenant/${tenantId}`).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.items)) return res.data.items;
        return [];
      })
    );
  }


}