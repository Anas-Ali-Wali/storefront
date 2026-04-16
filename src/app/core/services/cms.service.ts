import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface PageResponseDto {
  pageId: number;
  tenantId: number;
  title: string;
  slug: string;
  status: boolean;
  createdDate: string;
}

export interface SectionResponseDto {
  sectionId: number;
  pageId: number;
  type: string;
  orderNo: number;
  status: boolean;
}

export interface SectionDataResponseDto {
  dataId: number;
  sectionId: number;
  key: string;
  value: string;
}

export interface FullSection {
  sectionId: number;
  pageId: number;
  type: string;
  orderNo: number;
  status: boolean;
  data: SectionDataResponseDto[];
}

@Injectable()
export class CmsService {

  constructor(private api: ApiService) {}

  // 🔥 SAFE RESPONSE HANDLER (MOST IMPORTANT FIX)
  private extractArray(res: any): any[] {
    // return res?.data?.items
      if (Array.isArray(res)) return res; // ✅ FIX
  return res?.data?.items

      || res?.data
      || res?.items
      || [];
  }

  // =========================
  // PAGES
  // =========================
  getPagesByTenant(tenantId: number): Observable<PageResponseDto[]> {
    return this.api
      .get<any>(`/page/tenant/${tenantId}`, { pageNumber: 1, pageSize: 100 })
      .pipe(
        tap(res => console.log('PAGES RAW:', res)),
        map(res => this.extractArray(res))
      );
  }

  getPageBySlug(tenantId: number, slug: string): Observable<PageResponseDto | undefined> {
    const normalizedSlug = slug?.toLowerCase().trim();
    return this.getPagesByTenant(tenantId).pipe(
      map(pages =>
        pages.find(
          p => p.status === true && p.slug?.toLowerCase().trim() === normalizedSlug
        )
      )
    );
  }

  // =========================
  // SECTIONS
  // =========================
  getSectionsByPage(pageId: number): Observable<SectionResponseDto[]> {
    return this.api
      .get<any>(`/Section/page/${pageId}`)
      .pipe(
        tap(res => console.log('SECTIONS RAW:', res)),
        map(res => this.extractArray(res))
      );
  }

  // =========================
  // SECTION DATA
  // =========================
  getSectionData(sectionId: number): Observable<SectionDataResponseDto[]> {
    return this.api
      .get<any>(`/SectionData/section/${sectionId}`)
      .pipe(
        tap(res => console.log('SECTION DATA RAW:', res)),
        map(res => this.extractArray(res))
      );
  }

  // =========================
  // FULL SECTIONS (PAGE BUILDER)
  // =========================
  getFullSections(pageId: number): Observable<FullSection[]> {
    return this.getSectionsByPage(pageId).pipe(
      switchMap(sections => {

        // ❗ IMPORTANT: avoid silent empty bug
        if (!sections || sections.length === 0) {
          console.warn('No sections found for pageId:', pageId);
          return of([]);
        }

        const activeSections = sections.filter(s => s.status === true);

        if (!activeSections.length) {
          console.warn('No active sections found for pageId:', pageId);
          return of([]);
        }

        return forkJoin(
          activeSections.map(section =>
            this.getSectionData(section.sectionId).pipe(
              map(data => ({
                ...section,
                data
              }))
            )
          )
        );
      }),
      map(sections => [...sections].sort((a, b) => a.orderNo - b.orderNo))
    );
  }

  // =========================
  // MAIN ENTRY (HOME PAGE)
  // =========================
  getPageWithSections(tenantId: number, slug: string): Observable<FullSection[]> {
    return this.getPageBySlug(tenantId, slug).pipe(
      switchMap(page => {
        if (!page) {
          console.error('Page not found for slug:', slug, 'tenant:', tenantId);
          return of([]);
        }

        return this.getFullSections(page.pageId);
      })
    );
  }
}