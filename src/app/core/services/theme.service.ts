import { Injectable } from '@angular/core';
import { TenantResolverService } from './tenant-resolver.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';


// Backend ka standard wrapper — admin panel jaisa hi
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// TenantSettings table ke columns se match karta interface
export interface TenantSettingsResponse {
  settingId: number;
  tenantId: number;
  storeName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  navbarBgColor: string;
  navbarTextColor: string;
  footerBgColor: string;
  footerTextColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: string;
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  footerTagline?: string;
  heroBgColor: string;
  promoBannerBg: string;
  promoBannerText: string;
  cardBg: string;
  cardText: string;
  cardStyle?: string;
  cardRadius?: string;
  fontHeading?: string;
  fontBody?: string;
  buttonRadius?: string;
  imageAspectRatio?: string;
  categoryCardStyle?: string;
}

// API field -> CSS variable name mapping
const CSS_VAR_MAP: Partial<Record<keyof TenantSettingsResponse, string>> = {
  primaryColor: '--primary-color',
  secondaryColor: '--secondary-color',
  accentColor: '--accent-color',
  backgroundColor: '--background-color',
  textColor: '--text-color',
  navbarBgColor: '--navbar-bg-color',
  navbarTextColor: '--navbar-text-color',
  footerBgColor: '--footer-bg-color',
  footerTextColor: '--footer-text-color',
  buttonColor: '--button-color',
  buttonTextColor: '--button-text-color',
  buttonRadius: '--button-radius',
  fontFamily: '--font-family',
  fontHeading: '--font-heading',
  fontBody: '--font-body',
  heroBgColor: '--hero-bg-color',
  promoBannerBg: '--promo-banner-bg',
  promoBannerText: '--promo-banner-text',
  cardBg: '--card-bg',
  cardText: '--card-text',
  cardRadius: '--card-radius',
  imageAspectRatio: '--image-aspect-ratio',
};

// Fallback agar API fail ho jaye — site broken na dikhe
const DEFAULT_THEME: Record<string, string> = {
  '--primary-color': '#ea6c2d',
  '--secondary-color': '#1a1a2e',
  '--accent-color': '#ffffff',
  '--background-color': '#ffffff',
  '--text-color': '#1a1a1a',
  '--navbar-bg-color': '#ffffff',
  '--navbar-text-color': '#1a1a1a',
  '--footer-bg-color': '#0f172a',
  '--footer-text-color': '#ffffff',
  '--button-color': '#ea6c2d',
  '--button-text-color': '#ffffff',
  '--button-radius': '8px',
  '--font-family': 'Poppins, sans-serif',
  '--hero-bg-color': '#ffffff',
  '--promo-banner-bg': '#1e1a14',
  '--promo-banner-text': '#f5ede0',
  '--card-bg': '#ffffff',
  '--card-text': '#2a1f14',
  '--card-radius': '16px',
  '--image-aspect-ratio': '1/1',
};


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

private currentSettings: TenantSettingsResponse | null = null;

  constructor(
    private http: HttpClient,
    private tenantResolver: TenantResolverService
  ) {}

  // Ye method APP_INITIALIZER se call hogi — GET karta hai, save nahi
  async loadAndApplyTheme(): Promise<void> {
    this.applyDefaults();

    const tenantId = this.tenantResolver.getTenantId();
    if (!tenantId) {
      console.warn('ThemeService: tenantId not resolved, using default theme');
      return;
    }

    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<TenantSettingsResponse>>(
          `${environment.apiUrl}/TenantSettings/${tenantId}`
        )
      );

      if (!res || !res.success || !res.data) {
        console.warn('ThemeService: API returned no data, using defaults');
        return;
      }

      this.currentSettings = res.data;
      this.applySettings(res.data);
      this.applyFavicon(res.data.faviconUrl);
    } catch (err) {
      console.error('ThemeService: failed to load tenant theme, using defaults', err);
    }
  }

  getSettings(): TenantSettingsResponse | null {
    return this.currentSettings;
  }

  private applyDefaults(): void {
    const root = document.documentElement;
    Object.entries(DEFAULT_THEME).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  private applySettings(settings: TenantSettingsResponse): void {
    const root = document.documentElement;
    (Object.keys(CSS_VAR_MAP) as (keyof TenantSettingsResponse)[]).forEach((key) => {
      const cssVar = CSS_VAR_MAP[key];
      const value = settings[key];
      if (cssVar && value !== null && value !== undefined && value !== '') {
        root.style.setProperty(cssVar, String(value));
      }
    });
  }

  private applyFavicon(faviconUrl?: string): void {
    if (!faviconUrl) return;
    const link: HTMLLinkElement =
      document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
  }
}
