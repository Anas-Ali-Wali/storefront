// src/app/core/services/tenant-resolver.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TenantResolverService {


//   private resolvedTenantId: number | null = null;

//   constructor(private http: HttpClient) {}


// resolve(): Observable<any> {
//   const domain = window.location.hostname;

//   // ✅ LOCAL DEV: URL se tenantId lo
//   // http://localhost:56334?tenantId=9
//   if (domain === 'localhost' || domain === '127.0.0.1') {
//     const params = new URLSearchParams(window.location.search);
//     const tenantId = params.get('tenantId');

//     if (tenantId) {
//       this.resolvedTenantId = Number(tenantId);
//       localStorage.setItem('website_tenant_id', tenantId);
//     }
//     return of(null); // API call mat karo
//   }

//   // ✅ LIVE: domain se resolve karo (ye pehle se sahi hai)
//   return this.http.get<any>(
//     `${environment.apiUrl}/Tenant/resolve?domain=${domain}`
//   ).pipe(
//     tap((res) => {
//       if (res?.data?.tenantId) {
//         this.resolvedTenantId = Number(res.data.tenantId);
//         localStorage.setItem('website_tenant_id', String(this.resolvedTenantId));
//         if (res.data.themeColor) {
//           localStorage.setItem('website_theme_color', res.data.themeColor);
//           this.applyTheme(res.data.themeColor);
//         }
//       }
//     }),
//     catchError(() => of(null))
//   );
// }

// // ✅ NEW METHOD
// applyTheme(color: string): void {
//   const colorMap: Record<string, string> = {
//     'blue':   '#3b82f6',
//     'red':    '#ef4444',
//     'green':  '#22c55e',
//     'purple': '#a855f7',
//     'orange': '#f97316',
//     'pink':   '#ec4899',
//   };

//   const hex = colorMap[color] ?? '#3b82f6';
//   document.documentElement.style.setProperty('--primary-color', hex);
// }


//   getTenantId(): number | null {
//     if (this.resolvedTenantId) return this.resolvedTenantId;
//     const stored = localStorage.getItem('website_tenant_id');
//     return stored ? Number(stored) : null;
//   }


private resolvedTenantId: number | null = null;

  constructor(private http: HttpClient) {}

  resolve(): Observable<any> {
    const domain = window.location.hostname;

    if (domain === 'localhost' || domain === '127.0.0.1') {
      const params = new URLSearchParams(window.location.search);
      const tenantId = params.get('tenantId');

      if (tenantId) {
        this.resolvedTenantId = Number(tenantId);
        localStorage.setItem('website_tenant_id', tenantId);

        // ✅ Settings load karo
        this.loadAndApplySettings(Number(tenantId));
      }
      return of(null);
    }

    return this.http.get<any>(
      `${environment.apiUrl}/Tenant/resolve?domain=${domain}`
    ).pipe(
      tap((res) => {
        if (res?.data?.tenantId) {
          this.resolvedTenantId = Number(res.data.tenantId);
          localStorage.setItem('website_tenant_id', String(this.resolvedTenantId));

          if (res.data.themeColor) {
            localStorage.setItem('website_theme_color', res.data.themeColor);
            this.applyTheme(res.data.themeColor);
          }

          // ✅ Settings load karo
          this.loadAndApplySettings(this.resolvedTenantId!);
        }
      }),
      catchError(() => of(null))
    );
  }

  // ✅ NEW — Admin se saved settings load karo
  loadAndApplySettings(tenantId: number): void {
    this.http.get<any>(`${environment.apiUrl}/TenantSettings/${tenantId}`)
      .subscribe({
        next: (res) => {
          if (res?.success && res?.data) {
            this.applySettings(res.data);
            localStorage.setItem('tenant_settings', JSON.stringify(res.data));
          }
        },
        error: () => {} // silently fail
      });
  }

  // ✅ NEW — CSS variables apply karo
  private applySettings(settings: any): void {
    const root = document.documentElement;

    root.style.setProperty('--primary-color',     settings.primaryColor     ?? '#ea6c2d');
    root.style.setProperty('--secondary-color',   settings.secondaryColor   ?? '#1a1a2e');
    root.style.setProperty('--accent-color',      settings.accentColor      ?? '#ffffff');
    root.style.setProperty('--bg-color',          settings.backgroundColor  ?? '#ffffff');
    root.style.setProperty('--text-color',        settings.textColor        ?? '#1a1a1a');
    root.style.setProperty('--navbar-bg',         settings.navbarBgColor    ?? '#ffffff');
    root.style.setProperty('--navbar-text',       settings.navbarTextColor  ?? '#1a1a1a');
    root.style.setProperty('--footer-bg',         settings.footerBgColor    ?? '#0f172a');
    root.style.setProperty('--footer-text',       settings.footerTextColor  ?? '#ffffff');
    root.style.setProperty('--button-color',      settings.buttonColor      ?? '#ea6c2d');
    root.style.setProperty('--button-text-color', settings.buttonTextColor  ?? '#ffffff');
    root.style.setProperty('--hero-bg', settings.heroBgColor ?? '#ffffff'); // ✅ yahan
    // ✅ Yeh 4 lines add karo
  root.style.setProperty('--promo-bg',          settings.promoBannerBg    ?? '#1e1a14');
  root.style.setProperty('--promo-text',        settings.promoBannerText  ?? '#f5ede0');
  root.style.setProperty('--card-bg',           settings.cardBg           ?? '#ffffff');
  root.style.setProperty('--card-text',         settings.cardText         ?? '#2a1f14');

    if (settings.fontFamily) {
      root.style.setProperty('--font-family', settings.fontFamily);
      document.body.style.fontFamily = settings.fontFamily;
    }

    if (settings.storeName) {
      document.title = settings.storeName;
    }

    if (settings.faviconUrl) {
      const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (favicon) favicon.href = settings.faviconUrl;
    }
  }

  applyTheme(color: string): void {
  const colorMap: Record<string, string> = {
    'blue':   '#3b82f6',
    'red':    '#ef4444',
    'green':  '#22c55e',
    'purple': '#a855f7',
    'orange': '#f97316',
    'pink':   '#ec4899',
  };
  const hex = colorMap[color] ?? '#3b82f6';
  document.documentElement.style.setProperty('--primary-color', hex); // sirf yahi rakho
}

  getTenantId(): number | null {
    if (this.resolvedTenantId) return this.resolvedTenantId;
    const stored = localStorage.getItem('website_tenant_id');
    return stored ? Number(stored) : null;
  }

  // ✅ Footer/Header ke liye saved settings get karo
  getSavedSettings(): any {
    const saved = localStorage.getItem('tenant_settings');
    return saved ? JSON.parse(saved) : null;
  }

}





  // resolve(): Observable<any> {
  //   const domain = window.location.hostname; // automatic detect

  //   return this.http.get<any>(
  //     `${environment.apiUrl}/Tenant/resolve?domain=${domain}`
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



  // mm

//   resolve(): Observable<any> {
//   const domain = window.location.hostname;

//   return this.http.get<any>(
//     `${environment.apiUrl}/Tenant/resolve?domain=${domain}`
//   ).pipe(
//     tap((res) => {
//       if (res?.data?.tenantId) {
//         this.resolvedTenantId = Number(res.data.tenantId);
//         localStorage.setItem('website_tenant_id', String(this.resolvedTenantId));

//         // ✅ ThemeColor bhi save aur apply karo
//         if (res.data.themeColor) {
//           localStorage.setItem('website_theme_color', res.data.themeColor);
//           this.applyTheme(res.data.themeColor);
//         }
//       }
//     }),
//     catchError(() => of(null))
//   );
// }





  // private resolvedTenantId: number | null = null;

  // constructor(private http: HttpClient) {}

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

  // getTenantId(): number | null {
  //   if (this.resolvedTenantId) return this.resolvedTenantId;
  //   const stored = localStorage.getItem('website_tenant_id');
  //   return stored ? Number(stored) : null;
  // }

  // private getSlugFromUrl(): string {
  //   const host = window.location.hostname;
  //   const parts = host.split('.');
  //   if (parts.length >= 3) return parts[0]; // ali.yourstore.com → "ali"

  //   // Local dev: localhost:4200?tenant=ali
  //   const params = new URLSearchParams(window.location.search);
  //   return params.get('tenant') || 'default';
  // }