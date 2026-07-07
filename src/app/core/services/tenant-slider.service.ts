// tenant-slider.service.ts (WEBSITE side)
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';

export interface TenantSliderResponse {
  sliderId: number;
  tenantId: number;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  layoutType: 'full-image' | 'text-only' | 'split-left' | 'split-right';
  bgColor: string;
  textColor: string;
  overlayOpacity: number;
  isPresetImage: boolean;
  isActive: boolean;
  orderNo: number;
}

@Injectable({ providedIn: 'root' })
export class TenantSliderService {
  constructor(private api: ApiService) {}

  getActiveSliders(tenantId: number): Observable<TenantSliderResponse[]> {
    return this.api
      .get<any>(`/TenantSlider/tenant/${tenantId}`)
      .pipe(map((res) => res.data));
  }

  // ← NEW: preset/gallery images fetch karne ke liye
  getPresetImages(tenantId: number): Observable<TenantSliderResponse[]> {
    return this.api
      .get<any>(`/TenantSlider/preset/${tenantId}`)
      .pipe(map((res) => res.data));
  }
}